"""
scraper.py
Fetches articles from news sources and filters by keywords related to
feminist, LGBTQIA+, and global rights topics.
Uses a systems-of-power taxonomy with 9 primary system categories.
Supports both SQLite (local dev) and PostgreSQL (Render production).
"""

import feedparser
import sqlite3
import hashlib
import re
import os
from datetime import datetime, timedelta

# ── Postgres support (optional — only used when DATABASE_URL is set) ──────────
DATABASE_URL = os.environ.get("DATABASE_URL", "")
USE_POSTGRES = bool(DATABASE_URL)

if USE_POSTGRES:
    try:
        import psycopg2
        _DRIVER = "psycopg2"
    except ImportError:
        try:
            import pg8000.dbapi as _pg8000_dbapi
            _DRIVER = "pg8000"
        except ImportError:
            try:
                import psycopg as _psycopg3
                _DRIVER = "psycopg3"
            except ImportError:
                _DRIVER = None
                USE_POSTGRES = False
else:
    _DRIVER = None

DB_FILE = "news.db"
MAX_ARTICLES_PER_SOURCE = 30

# ─────────────────────────────────────────────────────────────────────────────
#  DATABASE CONNECTION
# ─────────────────────────────────────────────────────────────────────────────
def get_connection():
    if USE_POSTGRES:
        import urllib.parse, time, ssl
        parsed = urllib.parse.urlparse(DATABASE_URL)
        host     = parsed.hostname
        port     = parsed.port or 5432
        dbname   = parsed.path.lstrip("/")
        user     = parsed.username
        password = parsed.password
        last_err = None

        for attempt in range(3):
            try:
                if _DRIVER == "pg8000":
                    ssl_ctx = ssl.create_default_context()
                    ssl_ctx.check_hostname = False
                    ssl_ctx.verify_mode = ssl.CERT_NONE
                    conn = _pg8000_dbapi.connect(
                        host=host, port=port, database=dbname,
                        user=user, password=password,
                        ssl_context=ssl_ctx,
                        timeout=30,
                    )
                elif _DRIVER == "psycopg3":
                    url = DATABASE_URL
                    if "sslmode" not in url:
                        url += ("&" if "?" in url else "?") + "sslmode=require"
                    conn = _psycopg3.connect(url)
                else:  # psycopg2
                    conn = psycopg2.connect(
                        host=host, port=port, dbname=dbname,
                        user=user, password=password,
                        sslmode="require", connect_timeout=30,
                    )
                print(f"  ✅  Connected via {_DRIVER}", flush=True)
                return conn
            except Exception as e:
                last_err = e
                print(f"  ⚠️  DB connection attempt {attempt+1} ({_DRIVER}) failed: {e}", flush=True)
                if attempt < 2:
                    time.sleep(5)
        raise last_err
    return sqlite3.connect(DB_FILE)


# ─────────────────────────────────────────────────────────────────────────────
#  NEWS SOURCES  — add or remove feeds here
#  Format: "Display Name": {"url": "RSS feed URL", "country": "XX"}
# ─────────────────────────────────────────────────────────────────────────────
FEEDS = {
    # ── General / World News (keyword-filtered) ─────────────────────────────
    "BBC News":             {"url": "https://feeds.bbci.co.uk/news/rss.xml",                    "country": "UK"},
    "BBC News World":       {"url": "https://feeds.bbci.co.uk/news/world/rss.xml",              "country": "UK"},
    "The Guardian":         {"url": "https://www.theguardian.com/world/rss",                     "country": "UK"},
    "Reuters":              {"url": "https://feeds.reuters.com/reuters/topNews",                  "country": "US"},
    "Reuters World":        {"url": "https://feeds.reuters.com/Reuters/worldNews",               "country": "US"},
    "Al Jazeera":           {"url": "https://www.aljazeera.com/xml/rss/all.xml",                 "country": "Qatar"},
    "NPR News":             {"url": "https://feeds.npr.org/1001/rss.xml",                        "country": "US"},
    "The Independent":      {"url": "https://www.independent.co.uk/news/rss",                    "country": "UK"},
    "HuffPost":             {"url": "https://www.huffpost.com/section/women/feed",                "country": "US"},
    "New York Times":       {"url": "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml", "country": "US"},
    "Associated Press":     {"url": "https://apnews.com/rss",                                    "country": "US"},
    "CNN World":            {"url": "http://rss.cnn.com/rss/edition_world.rss",                  "country": "US"},
    "Washington Post":      {"url": "https://feeds.washingtonpost.com/rss/world",                "country": "US"},
    "Financial Times":      {"url": "https://www.ft.com/world?format=rss",                       "country": "UK"},
    "CBC News World":       {"url": "https://www.cbc.ca/cmlink/rss-world",                       "country": "Canada"},
    "ABC News":             {"url": "https://abcnews.go.com/rss/headlines",                      "country": "US"},
    "SBS News World":       {"url": "https://www.sbs.com.au/news/topic/world/rss.xml",           "country": "Australia"},
    "Le Monde":             {"url": "https://www.lemonde.fr/international/rss.xml",              "country": "France"},
    "IPS News Agency":      {"url": "https://ipsnews.net/news/regional-categories/rss.xml",      "country": "International"},
    "The Conversation":     {"url": "https://theconversation.com/topics/world-news/rss",         "country": "International"},
    "Global Voices":        {"url": "https://globalvoices.org/feeds/",                            "country": "International"},
    "Fair Observer":        {"url": "https://www.fairobserver.com/category/world/feed",           "country": "US"},

    # ── Women & Feminist Publications (all articles kept) ───────────────────
    "The Guardian Women":   {"url": "https://www.theguardian.com/lifeandstyle/women/rss",        "country": "UK"},
    "Ms. Magazine":         {"url": "https://msmagazine.com/feed/",                              "country": "US"},
    "Feministing":          {"url": "https://feministing.com/feed/",                             "country": "US"},
    "Jezebel":              {"url": "https://jezebel.com/rss",                                   "country": "US"},
    "Refinery29 Feminism":  {"url": "https://www.refinery29.com/en-us/feminism/rss.xml",         "country": "US"},
    "The Funambulist":      {"url": "https://thefunambulist.net/feed",                            "country": "France"},

    # ── LGBTQIA+ Publications (all articles kept) ───────────────────────────
    "Gay Times":            {"url": "https://www.gaytimes.co.uk/feed/",                          "country": "UK"},
    "PinkNews":             {"url": "https://www.pinknews.co.uk/feed/",                          "country": "UK"},
    "Out Magazine":         {"url": "https://www.out.com/rss.xml",                               "country": "US"},
    "LGBTQ Nation":         {"url": "https://www.lgbtqnation.com/feed/",                         "country": "US"},
    "Advocate":             {"url": "https://www.advocate.com/rss.xml",                          "country": "US"},
    "Autostraddle":         {"url": "https://www.autostraddle.com/feed/",                        "country": "US"},
    "Them":                 {"url": "https://www.them.us/feed/rss",                              "country": "US"},
    "Queerty":              {"url": "https://www.queerty.com/feed",                              "country": "US"},
    "Xtra Magazine":        {"url": "https://xtramagazine.com/feed/",                            "country": "Canada"},

    # ── Progressive & Investigative (keyword-filtered) ──────────────────────
    "AlterNet":             {"url": "https://www.alternet.org/feeds/feed.rss",                   "country": "US"},
    "Democracy Now":        {"url": "https://www.democracynow.org/podcast.xml",                  "country": "US"},
    "FSRN":                 {"url": "https://fsrn.org/feed",                                     "country": "US"},
    "Jewish Voice for Peace":{"url": "https://jewishvoiceforpeace.org/feed/",                   "country": "US"},
    "Le Monde Diplomatique":{"url": "https://mondediplo.com/rss/",                              "country": "France"},
    "The Progressive":      {"url": "https://progressive.org/feed/",                             "country": "US"},
    "Reveal News":          {"url": "https://revealnews.org/feed/",                              "country": "US"},
    "Accuracy in Media":    {"url": "https://www.aim.org/feed/",                                 "country": "US"},
    "Media Matters":        {"url": "https://www.mediamatters.org/rss/latest",                   "country": "US"},

    # ── German: General / Quality News (keyword-filtered) ───────────────────
    "tagesschau.de":        {"url": "https://www.tagesschau.de/infoservices/alle-meldungen-100~rss2.xml", "country": "DE", "locale": "de"},
    "Der Spiegel":          {"url": "https://www.spiegel.de/schlagzeilen/tops/index.rss",         "country": "DE", "locale": "de"},
    "Die Zeit":             {"url": "https://www.zeit.de/index.xml",                              "country": "DE", "locale": "de"},
    "Süddeutsche Zeitung":  {"url": "https://rss.sueddeutsche.de/rss/Topthemen",                  "country": "DE", "locale": "de"},
    "taz":                  {"url": "https://taz.de/!p4608;rss/",                                 "country": "DE", "locale": "de"},
    "Deutsche Welle Deutsch":{"url": "https://rss.dw.com/xml/rss-de-all",                        "country": "DE", "locale": "de"},
    "Deutschlandfunk":      {"url": "https://www.deutschlandfunk.de/api/podcast/nachrichten.xml", "country": "DE", "locale": "de"},

    # ── German: Investigative / Digital Rights (all articles kept) ──────────
    "netzpolitik.org":      {"url": "https://netzpolitik.org/feed/",                             "country": "DE", "locale": "de"},

    # ── German: DACH Expansion (keyword-filtered) ───────────────────────────
    "Der Standard":         {"url": "https://www.derstandard.at/?page=rss&ressort=International", "country": "AT", "locale": "de"},
    "ORF.at":               {"url": "https://rss.orf.at/news.xml",                                "country": "AT", "locale": "de"},

    # ── German: LGBTQIA+ Specialist (all articles kept) ─────────────────────
    "queer.de":             {"url": "https://www.queer.de/rss/newsticker2.0.komplett.xml",       "country": "DE", "locale": "de"},

    # ── German: Feminist Specialist (all articles kept) ─────────────────────
    "Missy Magazine":       {"url": "https://missy-magazine.de/feed/",                           "country": "DE", "locale": "de"},
}

# Sources where ALL articles are kept (no keyword filter needed)
ALWAYS_INCLUDE_SOURCES = {
    "The Guardian Women",
    "Ms. Magazine",
    "Feministing",
    "Jezebel",
    "Refinery29 Feminism",
    "The Funambulist",
    "Gay Times",
    "PinkNews",
    "Out Magazine",
    "LGBTQ Nation",
    "Advocate",
    "Autostraddle",
    "Them",
    "Queerty",
    "Xtra Magazine",
}

# German sources where ALL articles are kept
DE_ALWAYS_INCLUDE_SOURCES = {
    "queer.de",           # LGBTQIA+ specialist
    "Missy Magazine",     # feminist specialist
    "netzpolitik.org",    # digital rights — all articles structurally relevant
}

LGBTQIA_SOURCES = {
    "Gay Times", "PinkNews", "Out Magazine", "LGBTQ Nation", "Advocate",
    "Autostraddle", "Them", "Queerty", "Xtra Magazine",
}

FEMINIST_SOURCES = {
    "Ms. Magazine", "Feministing", "Jezebel", "Refinery29 Feminism",
    "The Guardian Women", "The Funambulist",
}

DE_LGBTQIA_SOURCES = {"queer.de"}
DE_FEMINIST_SOURCES = {"Missy Magazine"}

# Sources that are paywalled at the source level
PAYWALLED_SOURCES = {"New York Times", "Financial Times", "Washington Post"}

# Phrases that signal a paywalled article in RSS content
PAYWALL_SIGNAL_PHRASES = [
    "subscribe to read", "subscription required", "subscribers only",
    "sign in to read", "create a free account", "this article is for subscribers",
    "exclusive to subscribers", "premium content", "member exclusive",
    "for full access", "to continue reading", "read more with a subscription",
    "register to read", "already a subscriber", "become a member",
]

# German paywall signal phrases
PAYWALL_SIGNAL_PHRASES_DE = [
    "jetzt abonnieren", "nur für abonnenten", "premium-artikel",
    "nur mit abo", "artikel weiterlesenregistrieren", "weiterlesen mit",
    "als abonnent lesen", "digital-abo", "plus-artikel",
    "kostenpflichtig", "exklusiv für abonnenten", "anmelden um weiterzulesen",
    "jetzt registrieren", "abo abschließen",
]


# ─────────────────────────────────────────────────────────────────────────────
#  INCLUSION KEYWORDS
#  Articles from general sources must match at least one of these to be saved.
#  Covers both Gate A (identity signals) and Gate B (structural system signals).
# ─────────────────────────────────────────────────────────────────────────────
KEYWORDS = [
    # ── Gate A — Direct identity signals ─────────────────────────────────────
    # Women / Gender
    "women", "woman", "girl", "girls", "female", "feminine", "feminism",
    "feminist", "gender equality", "gender gap", "gender pay gap",
    "reproductive rights", "abortion", "maternity", "maternal",
    "women's rights", "sexism", "misogyny", "patriarchy", "period poverty",
    "menstrual", "women's health", "domestic violence", "gender violence",
    "sexual harassment", "metoo", "me too", "#metoo", "femicide",
    "gender-based violence", "women in leadership",

    # LGBTQIA+
    "lgbt", "lgbtq", "lgbtqia", "queer", "gay", "lesbian", "bisexual",
    "transgender", "trans ", "nonbinary", "non-binary", "intersex",
    "asexual", "pansexual", "pride", "drag", "same-sex", "gay rights",
    "trans rights", "coming out", "homophobia", "transphobia",
    "biphobia", "conversion therapy", "gender affirming", "gender identity",
    "pronouns", "deadnaming", "two-spirit", "marriage equality",

    # Migration / Displacement
    "refugee", "asylum", "migrant", "migration", "deportation",
    "undocumented", "detention", "displacement", "diaspora",
    "stateless", "asylum seeker", "forced displacement",

    # Rights / Justice
    "human rights", "civil rights", "civil liberties", "discrimination",
    "minority rights", "indigenous", "racial justice", "racism",

    # ── Gate B — Structural system signals ──────────────────────────────────
    # Bodily autonomy
    "bodily autonomy", "fgm", "female genital mutilation",
    "forced sterilisation", "forced sterilization", "obstetric violence",

    # Economic structure
    "care economy", "unpaid care", "domestic workers", "garment workers",
    "labour rights", "labor rights", "workers rights", "pay equity",

    # Climate / land
    "land dispossession", "climate displacement", "environmental racism",
    "climate justice", "environmental justice", "indigenous land",

    # Technology
    "surveillance", "facial recognition", "algorithmic discrimination",
    "internet shutdown", "digital rights", "spyware", "deepfake",

    # Anti-rights
    "gender ideology", "anti-trans", "book ban", "don't say gay",
    "bathroom bill", "parents rights", "anti-lgbtq",

    # Violence / accountability
    "trafficking", "forced marriage", "honour killing",
    "extrajudicial killing", "forced disappearance", "impunity",

    # Media / narrative
    "press freedom", "journalist arrested", "media freedom",
    "censorship", "academic freedom",
]


# ─────────────────────────────────────────────────────────────────────────────
#  GERMAN INCLUSION KEYWORDS  (Gate A + Gate B, parallel to KEYWORDS above)
# ─────────────────────────────────────────────────────────────────────────────
KEYWORDS_DE = [
    # ── Gate A — Identity signals ────────────────────────────────────────────
    # Women / Gender
    "frauen", "frau", "mädchen", "weiblich", "feminismus", "feministisch",
    "frauenrechte", "gleichstellung", "lohnlücke", "gender pay gap", "equal pay",
    "reproduktive rechte", "abtreibung", "schwangerschaftsabbruch",
    "mutterschaft", "schwangerschaft", "sexismus", "misogynie", "patriarchat",
    "periodenarmut", "menstruation", "frauengesundheit",
    "häusliche gewalt", "geschlechtsspezifische gewalt",
    "sexuelle belästigung", "femizid", "ehrenmord", "körperliche selbstbestimmung",

    # LGBTQIA+
    "lgbt", "lgbtq", "lgbtqia", "queer", "schwul", "lesbisch", "bisexuell",
    "transgender", "trans ", "nichtbinär", "nicht-binär", "intergeschlechtlich",
    "asexuell", "pansexuell", "pride", "drag", "gleichgeschlechtlich",
    "homosexualität", "transphobie", "homophobie", "konversionstherapie",
    "geschlechtsangleichung", "pronomen", "deadnaming",
    "ehe für alle", "regenbogenfamilie",

    # Migration / Displacement
    "flüchtling", "flüchtlinge", "asyl", "asylsuchende", "migrant",
    "migration", "abschiebung", "papierlose", "abschiebehaft",
    "vertreibung", "diaspora", "staatenlose", "zwangsvertreibung",

    # Rights / Justice
    "menschenrechte", "bürgerrechte", "diskriminierung", "minderheitenrechte",
    "indigen", "rassismus", "rassengerechtigkeit", "antirassismus",

    # ── Gate B — Structural system signals ───────────────────────────────────
    # Bodily autonomy
    "körperliche selbstbestimmung", "genitalverstümmelung", "fgm",
    "zwangssterilisation", "geburtshilfegewalt",

    # Economic structure
    "sorgearbeit", "unbezahlte arbeit", "care-arbeit", "haushaltsarbeiterinnen",
    "arbeitsrechte", "lohngleichheit", "lohnungleichheit",

    # Land / climate
    "landenteignung", "klimavertreibung", "umweltrassismus",
    "klimagerechtigkeit", "umweltgerechtigkeit", "indigenes land",

    # Technology / surveillance
    "massenüberwachung", "gesichtserkennung", "algorithmische diskriminierung",
    "internetsperre", "digitale rechte", "spyware", "deepfake",
    "überwachungstechnologie",

    # Anti-rights
    "genderideologie", "anti-trans", "bücherzensur",
    "hassrede", "anti-lgbtq",

    # Violence / accountability
    "menschenhandel", "zwangsheirat", "ehrenverbrechen",
    "außergerichtliche tötung", "straflosigkeit", "folter",

    # Media / narrative
    "pressefreiheit", "journalist verhaftet", "medienfreiheit",
    "zensur", "akademische freiheit",
]


# ─────────────────────────────────────────────────────────────────────────────
#  SYSTEM TOPIC KEYWORDS
#  Maps each article to 1–3 primary system categories.
#  Categories follow the systems-of-power taxonomy.
# ─────────────────────────────────────────────────────────────────────────────
TOPIC_KEYWORDS = {

    "Anti-Rights & Backlash Movements": [
        # Core anti-rights framing
        "gender ideology", "traditional values", "family values",
        "anti-trans", "anti-lgbtq", "anti-lgbtqia",
        "book ban", "banned books", "curriculum ban", "curriculum removal",
        "don't say gay", "bathroom bill", "bathroom law",
        "anti-abortion movement", "pro-life movement", "fetal personhood",
        "rollback", "rights rollback",
        # Conversion therapy
        "conversion therapy", "reparative therapy",
        # Religious freedom as rights-rollback vehicle
        "religious freedom exemption", "religious liberty exemption",
        "parents rights", "parental rights" , "parental override",
        # Named organisations / movements
        "alliance defending freedom", " adf ", "heritage foundation",
        "agenda europe", "fidesz", "orban",
        "anti-homosexuality act", "same-sex ban", "criminalise homosexuality",
        "criminalizes homosexuality", "gay propaganda law",
        "russia gay propaganda", "section 28",
        # Far-right framing
        "far-right", "ultra-conservative", "hard right",
        "backlash", "culture war",
    ],

    "Bodily Autonomy & Reproductive Justice": [
        # Reproductive
        "reproductive rights", "reproductive justice", "reproductive health",
        "abortion", "pro-choice", "planned parenthood",
        "birth control", "contraception", "contraceptive",
        "fertility", "ivf", "pregnancy", "pregnant",
        "miscarriage", "stillbirth", "maternal mortality", "maternal health",
        "midwife", "midwifery", "gynecolog", "obstetric", "prenatal", "postnatal",
        "surrogacy", "bodily autonomy",
        "menstrual", "period poverty", "menstruation",
        # Harmful practices
        "fgm", "female genital mutilation", "forced sterilisation",
        "forced sterilization", "obstetric violence",
        # Gender-affirming healthcare
        "gender affirming care", "gender affirming", "puberty blocker",
        "hormone therapy", "hrt",
        # Health with rights dimension
        "mental health", "eating disorder", "body image",
        "hiv", "aids", "sexual health", "healthcare access",
        "breast cancer", "cervical cancer", "health inequality",
    ],

    "Violence, Safety & Criminal Justice": [
        # Gender-based violence
        "femicide", "domestic violence", "gender-based violence", "gbv",
        "sexual violence", "sexual assault", "rape", "sexual harassment",
        "honour killing", "forced marriage", "dowry violence",
        # Trafficking & exploitation
        "trafficking", "human trafficking", "sex trafficking",
        "forced labour", "forced labor", "modern slavery",
        # State violence
        "police brutality", "police violence", "extrajudicial killing",
        "forced disappearance", "torture", "arbitrary detention",
        "political prisoner",
        # Hate & targeted violence
        "hate crime", "attack on", "assault", "murder",
        "stalking", "threat", "intimidation",
        # Justice / accountability
        "protection order", "restraining order", "shelter",
        "survivor", "impunity", "accountability", "prosecution",
        "prison conditions", "incarceration", "criminal justice",
    ],

    "State Power, Law & Governance": [
        # Courts & legislation
        "supreme court", "constitutional court", "high court", "federal court",
        "ruling", "landmark ruling", "landmark decision",
        "legislation", "law passed", "signed into law", "executive order",
        "amendment", "constitution", "criminalised", "decriminalised",
        "anti-discrimination law", "equality act", "hate crime law",
        "civil rights act", "human rights act",
        "ban", "repeal", "overturn", "reform", "policy change",
        # International law
        "treaty", "ratification", "un resolution", "international law",
        "un human rights", "special rapporteur", "universal periodic review",
        # Elections & political power
        "election", "vote", "ballot", "campaign",
        "parliament", "senate", "congress", "minister",
        "government policy", "administration", "cabinet",
        "appointment", "nomination",
    ],

    "Economic & Labour Justice": [
        # Pay & wealth
        "pay gap", "gender pay gap", "wage gap", "equal pay", "pay equity",
        "pay disparity", "income inequality", "wealth gap",
        # Care economy
        "care economy", "unpaid care", "care work", "care workers",
        "domestic workers", "childcare", "eldercare",
        # Labour rights
        "labour rights", "labor rights", "workers rights",
        "union", "collective bargaining", "strike",
        "garment workers", "gig economy", "gig workers",
        "minimum wage", "wage theft", "forced labour",
        # Employment
        "maternity leave", "paternity leave", "parental leave",
        "pension", "retirement", "workplace discrimination",
        "motherhood penalty", "glass ceiling",
        "women in leadership", "women on boards", "corporate diversity",
        # Poverty / welfare
        "poverty", "welfare", "food security", "food insecurity",
        "debt", "economic inequality", "land rights",
    ],

    "Migration, Borders & Citizenship": [
        # Status
        "refugee", "asylum", "asylum seeker", "stateless", "statelessness",
        "undocumented", "displaced", "displacement",
        "citizenship", "citizenship revoked", "naturalisation",
        "visa", "residency",
        # Borders & detention
        "deportation", "deportee", "detention centre", "immigration detention",
        "border violence", "border control", "migration policy",
        "forced return", "pushback",
        # Specific crises
        "rohingya", "mediterranean crossing", "channel crossing",
        "kafala", "kafala system",
        # Community
        "diaspora", "exile", "resettlement", "integration",
        "xenophobia", "anti-immigration",
        "sanctuary city", "dreamers", "daca",
        "migrant worker", "seasonal worker",
    ],

    "Climate & Environmental Justice": [
        # Displacement
        "climate displacement", "climate refugee", "climate migrant",
        "climate migration", "climate-displaced",
        # Land & resources
        "land dispossession", "land grab", "indigenous land",
        "land rights", "water rights", "resource extraction",
        "deforestation", "dam construction", "mining community",
        # Environmental justice framing
        "environmental racism", "sacrifice zone", "pollution community",
        "environmental justice", "climate justice", "just transition",
        "climate finance", "loss and damage",
        # Climate impacts
        "climate change", "global warming", "sea level",
        "flood", "drought", "wildfire", "extreme heat",
        "environmental health",
    ],

    "Technology & Digital Power": [
        # Surveillance
        "facial recognition", "mass surveillance", "surveillance technology",
        "biometric", "predictive policing", "spyware", "pegasus",
        # Censorship & shutdowns
        "internet shutdown", "social media ban", "content moderation",
        "platform ban", "vpn ban", "censorship online",
        "encrypted", "encryption ban",
        # Algorithmic harm
        "algorithmic discrimination", "algorithmic bias", "ai bias",
        "automated decision", "discriminatory algorithm",
        # Online violence
        "deepfake", "non-consensual imagery", "revenge porn",
        "cyber harassment", "online abuse", "digital violence",
        "doxing",
        # Digital rights
        "digital rights", "data privacy", "data protection",
        "tech worker", "gig platform",
        "artificial intelligence", "ai regulation",
    ],

    "Culture, Media & Narrative Power": [
        # Press freedom
        "press freedom", "journalist arrested", "media freedom",
        "reporter imprisoned", "journalist killed",
        # Books & education censorship
        "book ban", "banned book", "curriculum", "academic freedom",
        "education rights", "school policy",
        # Representation & storytelling
        "representation", "visibility", "storytelling", "narrative",
        "indigenous media", "language rights", "cultural rights",
        # Arts & entertainment (with rights dimension)
        "film", "documentary", "book", "novel", "author",
        "art", "artist", "museum", "performance", "theatre", "theater",
        "drag", "drag queen", "drag king", "drag race",
        "music", "singer", "award", "oscar", "emmy", "grammy",
        "icon", "podcast", "interview",
        # Censorship
        "censorship", "banned film", "cancelled",
        # Social media & influence
        "social media", "influencer", "content creator",
        "platform", "algorithm",
    ],
}

# ─────────────────────────────────────────────────────────────────────────────
#  GERMAN SYSTEM TOPIC KEYWORDS  (same 9 categories, German terms)
# ─────────────────────────────────────────────────────────────────────────────
TOPIC_KEYWORDS_DE = {

    "Anti-Rights & Backlash Movements": [
        "genderideologie", "gender-ideologie", "traditionelle werte",
        "anti-trans", "anti-lgbtq", "transfeindlich",
        "bücherzensur", "verbotene bücher",
        "konversionstherapie",
        "religiöse freiheit als ausnahme", "elternrechte",
        "abtreibungsgegner", "lebensschutz", "abtreibungsverbot",
        "rechtsruck", "rollback", "rechtspopulismus",
        "identitäre", "afd queer", "afd frauen",
        "antigender", "anti-gender", "gender-kritisch",
        "schwulenpropaganda", "kriminalisierung homosexualität",
        "weit rechts", "ultrakonservativ",
        "backlash", "culture war", "kulturkampf",
    ],

    "Bodily Autonomy & Reproductive Justice": [
        "reproduktive rechte", "reproduktive gerechtigkeit",
        "abtreibung", "schwangerschaftsabbruch", "pro-choice",
        "verhütung", "kontrazeptivum",
        "ivf", "künstliche befruchtung", "fruchtbarkeit",
        "schwangerschaft", "schwangere", "fehlgeburt",
        "mütterliche sterblichkeit", "müttergesundheit",
        "hebamme", "geburtshilfe", "pränatal",
        "leihmutterschaft", "körperliche selbstbestimmung",
        "menstruation", "periodenarmut",
        "genitalverstümmelung", "fgm",
        "zwangssterilisation", "geburtshilfegewalt",
        "geschlechtsangleichung", "pubertätsblocker",
        "hormontherapie", "transgender-gesundheit",
        "psychische gesundheit", "essstörung", "körperbild",
        "hiv", "aids", "sexuelle gesundheit", "gesundheitsversorgung",
    ],

    "Violence, Safety & Criminal Justice": [
        "femizid", "häusliche gewalt", "geschlechtsspezifische gewalt",
        "sexuelle gewalt", "sexueller übergriff", "vergewaltigung",
        "sexuelle belästigung", "belästigung",
        "ehrenmord", "zwangsheirat", "mitgiftgewalt",
        "menschenhandel", "sexhandel", "zwangsarbeit",
        "moderne sklaverei",
        "polizeigewalt", "außergerichtliche tötung",
        "folter", "willkürliche verhaftung",
        "politischer gefangener", "verschwindenlassen",
        "hassverbrechen", "angriff auf",
        "stalking", "bedrohung", "einschüchterung",
        "straflosigkeit", "rechenschaftspflicht", "strafverfolgung",
        "gefängnisbedingungen", "strafvollzug", "justiz",
    ],

    "State Power, Law & Governance": [
        "bundesverfassungsgericht", "oberstes gericht", "europäischer gerichtshof",
        "eugh", "echr", "urteil", "grundsatzurteil",
        "gesetz verabschiedet", "gesetzgebung", "erlass",
        "kriminalisiert", "entkriminalisiert", "legalisiert",
        "antidiskriminierungsgesetz", "gleichstellungsgesetz",
        "verboten", "aufgehoben", "reform", "politikwechsel",
        "staatsvertrag", "ratifizierung", "un-resolution",
        "sonderberichterstatter", "menschenrechtsrat",
        "wahl", "abstimmung", "wahlkampf",
        "bundestag", "bundesrat", "parlament", "minister",
        "regierungspolitik", "bundesregierung", "kabinett",
        "ernennung", "nominierung",
    ],

    "Economic & Labour Justice": [
        "lohnlücke", "gender pay gap", "gleicher lohn", "lohngleichheit",
        "gehaltsungleichheit", "einkommensungleichheit",
        "sorgearbeit", "unbezahlte arbeit", "care-arbeit",
        "haushaltsarbeiterinnen", "kinderbetreuung", "pflegearbeit",
        "arbeitsrechte", "gewerkschaft", "tarifverhandlung", "streik",
        "mindestlohn", "lohndiebstahl", "gig-economy",
        "elternzeit", "mutterschutz", "vaterschaftsurlaub",
        "rente", "altersarmut", "arbeitsdiskriminierung",
        "mutterschaftsstrafe", "gläserne decke",
        "frauen in führungspositionen", "unternehmensvielfalt",
        "armut", "sozialleistungen", "ernährungssicherheit",
        "wirtschaftliche ungleichheit", "landrechte",
    ],

    "Migration, Borders & Citizenship": [
        "flüchtling", "flüchtlinge", "asyl", "asylsuchende",
        "staatenlose", "papierlose", "vertriebene",
        "staatsangehörigkeit", "einbürgerung",
        "abschiebung", "abgeschobene", "abschiebehaft",
        "grenzgewalt", "migrationspolitik",
        "zwangsrückkehr", "push-back", "pushback",
        "mittelmeer", "ärmelkanal", "fluchtroute",
        "kafala",
        "diaspora", "exil", "neuansiedlung", "integration",
        "fremdenfeindlichkeit", "anti-einwanderung",
        "migrantische arbeit", "saisonarbeiter",
    ],

    "Climate & Environmental Justice": [
        "klimavertreibung", "klimaflüchtling",
        "klimamigration", "klimabedingte vertreibung",
        "landenteignung", "landraub", "indigenes land",
        "landrechte", "wasserrechte", "ressourcenabbau",
        "abholzung", "bergbaugemeinde", "staudamm",
        "umweltrassismus", "opferzone", "umweltverschmutzung",
        "umweltgerechtigkeit", "klimagerechtigkeit",
        "klimafinanzierung", "verlust und schäden",
        "klimawandel", "erderwärmung", "meeresspiegel",
        "überschwemmung", "dürre", "waldbrand", "extremhitze",
        "nachhaltigkeit", "gerechter wandel",
    ],

    "Technology & Digital Power": [
        "gesichtserkennung", "massenüberwachung", "überwachungstechnologie",
        "biometrie", "predictive policing", "spyware", "pegasus",
        "internetsperre", "plattformverbot", "inhaltsmoderation",
        "vpn-verbot", "online-zensur",
        "verschlüsselung", "verschlüsselungsverbot",
        "algorithmische diskriminierung", "ki-diskriminierung",
        "automatisierte entscheidung", "diskriminierender algorithmus",
        "deepfake", "nicht-konsensuelles bildmaterial",
        "cyber-belästigung", "online-gewalt", "digitale gewalt",
        "doxing",
        "digitale rechte", "datenschutz", "datensicherheit",
        "künstliche intelligenz", "ki-regulierung",
    ],

    "Culture, Media & Narrative Power": [
        "pressefreiheit", "journalist verhaftet", "medienfreiheit",
        "reporter inhaftiert", "journalist getötet",
        "bücherzensur", "verbotene bücher", "lehrplan",
        "akademische freiheit", "bildungsrechte", "schulpolitik",
        "repräsentation", "sichtbarkeit", "storytelling",
        "indigene medien", "sprachrechte", "kulturelle rechte",
        "film", "dokumentarfilm", "buch", "roman", "autorin",
        "kunst", "künstlerin", "museum", "aufführung", "theater",
        "drag", "dragshow", "drag queen",
        "musik", "preis", "oscar", "grammy",
        "podcast", "interview", "soziale medien", "influencer",
        "zensur", "abgesagt", "platzsturm",
    ],
}


# Default fallback topics when no keyword matches
# Used for always-include sources to ensure every article gets at least one tag
SOURCE_DEFAULT_TOPIC = {
    # LGBTQIA+ sources → Culture by default (community content)
    "Gay Times":     "Culture, Media & Narrative Power",
    "PinkNews":      "Culture, Media & Narrative Power",
    "Out Magazine":  "Culture, Media & Narrative Power",
    "LGBTQ Nation":  "Culture, Media & Narrative Power",
    "Advocate":      "Culture, Media & Narrative Power",
    "Autostraddle":  "Culture, Media & Narrative Power",
    "Them":          "Culture, Media & Narrative Power",
    "Queerty":       "Culture, Media & Narrative Power",
    "Xtra Magazine": "Culture, Media & Narrative Power",
    # Feminist sources → Bodily Autonomy by default
    "Ms. Magazine":        "Bodily Autonomy & Reproductive Justice",
    "Feministing":         "Bodily Autonomy & Reproductive Justice",
    "Jezebel":             "Bodily Autonomy & Reproductive Justice",
    "Refinery29 Feminism": "Bodily Autonomy & Reproductive Justice",
    "The Guardian Women":  "Bodily Autonomy & Reproductive Justice",
    "The Funambulist":     "State Power, Law & Governance",
}

SOURCE_DEFAULT_TOPIC_DE = {
    # German LGBTQIA+ specialist
    "queer.de":       "Culture, Media & Narrative Power",
    # German feminist specialist
    "Missy Magazine": "Bodily Autonomy & Reproductive Justice",
    # Investigative / digital rights — fallback to most representative category
    "CORRECTIV":      "State Power, Law & Governance",
    "netzpolitik.org":"Technology & Digital Power",
}


# ─────────────────────────────────────────────────────────────────────────────
#  DATABASE SETUP
# ─────────────────────────────────────────────────────────────────────────────
def setup_database():
    conn   = get_connection()
    cursor = conn.cursor()
    ph     = "%s" if USE_POSTGRES else "?"

    if USE_POSTGRES:
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS articles (
                id               SERIAL PRIMARY KEY,
                url_hash         TEXT UNIQUE,
                title            TEXT,
                link             TEXT,
                summary          TEXT,
                source           TEXT,
                country          TEXT    DEFAULT '',
                category         TEXT,
                tags             TEXT,
                topics           TEXT    DEFAULT '',
                scraped_at       TEXT,
                published_at     TEXT    DEFAULT '',
                is_paywalled     BOOLEAN DEFAULT FALSE,
                locale           TEXT    DEFAULT 'en',
                paywall_override BOOLEAN DEFAULT NULL
            )
        """)
        conn.commit()
        for col_sql in [
            "ALTER TABLE articles ADD COLUMN IF NOT EXISTS country TEXT DEFAULT ''",
            "ALTER TABLE articles ADD COLUMN IF NOT EXISTS topics TEXT DEFAULT ''",
            "ALTER TABLE articles ADD COLUMN IF NOT EXISTS published_at TEXT DEFAULT ''",
            "ALTER TABLE articles ADD COLUMN IF NOT EXISTS is_paywalled BOOLEAN DEFAULT FALSE",
            "ALTER TABLE articles ADD COLUMN IF NOT EXISTS locale TEXT DEFAULT 'en'",
            "ALTER TABLE articles ADD COLUMN IF NOT EXISTS paywall_override BOOLEAN DEFAULT NULL",
        ]:
            try:
                cursor.execute(col_sql)
                conn.commit()
            except Exception:
                conn.rollback()
        cursor.execute("UPDATE articles SET locale = 'en' WHERE locale IS NULL")
        conn.commit()
    else:
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS articles (
                id               INTEGER PRIMARY KEY AUTOINCREMENT,
                url_hash         TEXT UNIQUE,
                title            TEXT,
                link             TEXT,
                summary          TEXT,
                source           TEXT,
                country          TEXT    DEFAULT '',
                category         TEXT,
                tags             TEXT,
                topics           TEXT    DEFAULT '',
                scraped_at       TEXT,
                published_at     TEXT    DEFAULT '',
                is_paywalled     INTEGER DEFAULT 0,
                locale           TEXT    DEFAULT 'en',
                paywall_override INTEGER DEFAULT NULL
            )
        """)
        for col, default in [
            ("country",          "''"),
            ("topics",           "''"),
            ("published_at",     "''"),
            ("is_paywalled",     "0"),
            ("locale",           "'en'"),
            ("paywall_override", "NULL"),
        ]:
            try:
                cursor.execute(f"ALTER TABLE articles ADD COLUMN {col} TEXT DEFAULT {default}")
            except sqlite3.OperationalError:
                pass
        conn.commit()

    # Purge articles older than 30 days
    cutoff = (datetime.now() - timedelta(days=30)).isoformat()
    cursor.execute(f"DELETE FROM articles WHERE scraped_at < {ph}", [cutoff])
    conn.commit()
    conn.close()
    print("✅ Database ready.", flush=True)


# ─────────────────────────────────────────────────────────────────────────────
#  HELPERS
# ─────────────────────────────────────────────────────────────────────────────
def url_hash(url):
    return hashlib.md5(url.encode()).hexdigest()


def strip_html(text):
    return re.sub(r'<[^>]+>', '', text or '').strip()


def extract_published_at(entry) -> str:
    for attr in ("published_parsed", "updated_parsed"):
        parsed = getattr(entry, attr, None)
        if parsed:
            try:
                return datetime(*parsed[:6]).isoformat()
            except Exception:
                pass
    return ""


# ─────────────────────────────────────────────────────────────────────────────
#  PAYWALL DETECTION
# ─────────────────────────────────────────────────────────────────────────────
def detect_paywall(entry, source: str, locale: str = "en") -> bool:
    if source in PAYWALLED_SOURCES:
        return True
    title   = strip_html(entry.get("title",   "") or "").lower()
    summary = strip_html(entry.get("summary", "") or "")
    combined = title + " " + summary.lower()

    # Check locale-appropriate paywall phrases
    phrases = PAYWALL_SIGNAL_PHRASES_DE if locale == "de" else PAYWALL_SIGNAL_PHRASES
    for phrase in phrases:
        if phrase in combined:
            return True

    # Short-content heuristic (likely truncated behind paywall)
    all_always_include = ALWAYS_INCLUDE_SOURCES | DE_ALWAYS_INCLUDE_SOURCES
    if source not in all_always_include and 0 < len(summary.strip()) < 120:
        return True

    return False


# ─────────────────────────────────────────────────────────────────────────────
#  KEYWORD MATCHING
# ─────────────────────────────────────────────────────────────────────────────
def matches_keywords(title, summary, locale: str = "en"):
    """Gate check: return True if this article is relevant to the feed."""
    combined = (title + " " + summary).lower()
    kw_list = KEYWORDS_DE if locale == "de" else KEYWORDS
    return any(kw in combined for kw in kw_list)


def get_identity_tags(text, source, locale: str = "en"):
    """Return identity tags (women / lgbtqia+) based on text + source type."""
    text_lower = text.lower()
    tags = set()

    if locale == "de":
        women_terms = [
            "frauen", "frau", "mädchen", "weiblich", "feminismus", "feministisch",
            "frauenrechte", "gleichstellung", "reproduktiv", "abtreibung",
            "mutterschaft", "sexismus", "misogynie", "patriarchat",
            "periodenarmut", "menstruation", "häusliche gewalt",
            "sexuelle belästigung", "femizid", "geschlechtsspezifisch",
        ]
        lgbtq_terms = [
            "lgbt", "lgbtq", "lgbtqia", "queer", "schwul", "lesbisch",
            "bisexuell", "transgender", "trans ", "nichtbinär", "nicht-binär",
            "intergeschlechtlich", "asexuell", "pansexuell", "pride", "drag",
            "gleichgeschlechtlich", "homophobie", "transphobie",
            "konversionstherapie", "geschlechtsangleichung", "pronomen",
        ]
        feminist_set  = DE_FEMINIST_SOURCES
        lgbtqia_set   = DE_LGBTQIA_SOURCES
    else:
        women_terms = [
            "women", "woman", "girl", "girls", "female", "feminine", "feminism",
            "feminist", "gender", "reproductive", "abortion", "maternity",
            "maternal", "sexism", "misogyny", "patriarchy", "period poverty",
            "menstrual", "domestic violence", "sexual harassment", "metoo",
            "me too", "femicide",
        ]
        lgbtq_terms = [
            "lgbt", "lgbtq", "lgbtqia", "queer", "gay", "lesbian", "bisexual",
            "transgender", "trans ", "nonbinary", "non-binary", "intersex",
            "asexual", "pansexual", "pride", "drag", "same-sex", "homophobia",
            "transphobia", "biphobia", "conversion therapy", "gender affirming",
            "pronouns", "two-spirit", "marriage equality",
        ]
        feminist_set  = FEMINIST_SOURCES
        lgbtqia_set   = LGBTQIA_SOURCES

    if source in feminist_set or any(t in text_lower for t in women_terms):
        tags.add("women")
    if source in lgbtqia_set or any(t in text_lower for t in lgbtq_terms):
        tags.add("lgbtqia+")

    return sorted(tags)


def get_system_topics(text, source, locale: str = "en"):
    """
    Assign 1–3 primary system topic tags to an article.
    Returns an ordered list: strongest match first.
    Falls back to SOURCE_DEFAULT_TOPIC(_DE) if no keywords match.
    """
    text_lower = text.lower()
    matched = []

    kw_map = TOPIC_KEYWORDS_DE if locale == "de" else TOPIC_KEYWORDS
    for topic_name, keywords in kw_map.items():
        if any(kw in text_lower for kw in keywords):
            matched.append(topic_name)

    # Deduplicate while preserving order
    seen = set()
    unique = []
    for t in matched:
        if t not in seen:
            seen.add(t)
            unique.append(t)
    matched = unique[:3]  # cap at 3 system tags

    # Fallback for always-include sources that matched no keyword
    if not matched:
        fallback_map = SOURCE_DEFAULT_TOPIC_DE if locale == "de" else SOURCE_DEFAULT_TOPIC
        if source in fallback_map:
            matched = [fallback_map[source]]

    return matched


# ─────────────────────────────────────────────────────────────────────────────
#  SCRAPING
# ─────────────────────────────────────────────────────────────────────────────
def scrape_all_feeds():
    total_new = 0
    ph = "%s" if USE_POSTGRES else "?"

    for source_name, feed_info in FEEDS.items():
        feed_url = feed_info["url"]
        country  = feed_info["country"]
        locale   = feed_info.get("locale", "en")   # ← new: read locale from feed config
        print(f"  📡 Scraping [{locale.upper()}]: {source_name}...", flush=True)

        conn   = get_connection()
        cursor = conn.cursor()
        new_count = 0

        try:
            feed    = feedparser.parse(feed_url)
            entries = feed.entries[:MAX_ARTICLES_PER_SOURCE]

            for entry in entries:
                link    = entry.get("link", "")
                title   = strip_html(entry.get("title", "No title"))
                summary = strip_html(entry.get("summary", ""))
                hash_id = url_hash(link)

                # Inclusion gate — locale-aware, skip for always-include sources
                all_always_include = ALWAYS_INCLUDE_SOURCES | DE_ALWAYS_INCLUDE_SOURCES
                always_keep = source_name in all_always_include
                if not always_keep and not matches_keywords(title, summary, locale):
                    continue

                combined_text = title + " " + summary

                # Identity tags (women / lgbtqia+) — locale-aware
                identity_tags = get_identity_tags(combined_text, source_name, locale)
                tags_str = ", ".join(identity_tags) if identity_tags else "general"

                # Category field (legacy — kept for backward compat)
                category = "lgbtqia+" if "lgbtqia+" in identity_tags else "women"

                # System topics (new taxonomy) — locale-aware
                system_topics = get_system_topics(combined_text, source_name, locale)
                topics_str = ", ".join(system_topics) if system_topics else ""

                # Publication date + paywall — locale-aware
                published_at = extract_published_at(entry)
                is_paywalled = detect_paywall(entry, source_name, locale)
                scraped_at   = datetime.now().isoformat()

                try:
                    cursor.execute(f"""
                        INSERT INTO articles
                          (url_hash, title, link, summary, source, country,
                           category, tags, topics, scraped_at, published_at,
                           is_paywalled, locale)
                        VALUES ({ph},{ph},{ph},{ph},{ph},{ph},{ph},{ph},{ph},{ph},{ph},{ph},{ph})
                    """, (
                        hash_id, title, link, summary, source_name, country,
                        category, tags_str, topics_str, scraped_at, published_at,
                        is_paywalled,
                        locale,
                    ))
                    new_count += 1
                except Exception:
                    if USE_POSTGRES:
                        conn.rollback()

            conn.commit()
            print(f"     ✔  {new_count} new articles from {source_name}", flush=True)
            total_new += new_count

        except Exception as e:
            print(f"     ❌  Error scraping {source_name}: {e}", flush=True)
        finally:
            conn.close()

    print(f"\n🎉 Done! {total_new} new articles saved in total.", flush=True)


# ─────────────────────────────────────────────────────────────────────────────
#  RECATEGORIZE  — re-tag all existing articles with the new taxonomy
# ─────────────────────────────────────────────────────────────────────────────
def recategorize_all_articles():
    """Re-run system topic + identity tag detection on every existing article."""
    conn   = get_connection()
    cursor = conn.cursor()
    ph     = "%s" if USE_POSTGRES else "?"

    cursor.execute("SELECT id, title, summary, source, locale FROM articles")
    rows    = cursor.fetchall()
    updated = 0

    for row in rows:
        article_id, title, summary, source = row[0], row[1], row[2], row[3]
        locale = row[4] if len(row) > 4 and row[4] else "en"
        text = (title or "") + " " + (summary or "")

        # New system topics — locale-aware
        system_topics = get_system_topics(text, source, locale)
        topics_str = ", ".join(system_topics) if system_topics else ""

        # Identity tags — locale-aware
        identity_tags = get_identity_tags(text, source, locale)
        tags_str = ", ".join(identity_tags) if identity_tags else "general"

        cursor.execute(
            f"UPDATE articles SET topics = {ph}, tags = {ph} WHERE id = {ph}",
            (topics_str, tags_str, article_id)
        )
        updated += 1

    conn.commit()
    conn.close()
    print(f"✅ Recategorized {updated} articles with new taxonomy.", flush=True)


# ─────────────────────────────────────────────────────────────────────────────
#  QUERY (kept for backward compatibility / standalone use)
# ─────────────────────────────────────────────────────────────────────────────
def get_all_articles(category=None, source=None, search=None, topic=None,
                     country=None, time_range=None, date_to=None,
                     limit=200, free_only=False):
    conn   = get_connection()
    ph     = "%s" if USE_POSTGRES else "?"

    if not USE_POSTGRES:
        conn.row_factory = sqlite3.Row

    cursor = conn.cursor()
    query  = "SELECT * FROM articles WHERE 1=1"
    params = []

    if category:
        query += f" AND (category = {ph} OR tags LIKE {ph})"
        params += [category, f"%{category}%"]
    if source:
        query += f" AND source = {ph}"
        params.append(source)
    if country:
        query += f" AND country = {ph}"
        params.append(country)
    if search:
        query += f" AND (title LIKE {ph} OR summary LIKE {ph})"
        params += [f"%{search}%", f"%{search}%"]
    if topic:
        topic_list    = [t.strip() for t in topic.split(",")]
        topic_clauses = " OR ".join([f"topics LIKE {ph}" for _ in topic_list])
        query        += f" AND ({topic_clauses})"
        params       += [f"%{t}%" for t in topic_list]
    if time_range:
        query += f" AND scraped_at >= {ph}"
        params.append(time_range)
    if date_to:
        query += f" AND scraped_at <= {ph}"
        params.append(date_to)
    if free_only:
        query += f" AND COALESCE(paywall_override, is_paywalled) = {ph}"
        params.append(False if USE_POSTGRES else 0)

    query += f" ORDER BY scraped_at DESC LIMIT {ph}"
    params.append(limit)

    cursor.execute(query, params)

    if USE_POSTGRES:
        cols = [desc[0] for desc in cursor.description]
        rows = [dict(zip(cols, row)) for row in cursor.fetchall()]
    else:
        rows = [dict(row) for row in cursor.fetchall()]

    conn.close()
    return rows


if __name__ == "__main__":
    print("🗞️  News Scraper Starting...\n")
    setup_database()
    scrape_all_feeds()
