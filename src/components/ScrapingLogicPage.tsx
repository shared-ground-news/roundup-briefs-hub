import { TOPICS, TOPIC_COLORS } from "@/lib/constants";

// ── Inclusion gate keywords ────────────────────────────────────────────────────

const GATE_A_KEYWORDS = {
  "Women & gender": [
    "feminist", "feminism", "women's rights", "gender pay gap", "equal pay",
    "reproductive rights", "abortion", "maternal health", "maternal mortality",
    "gynecolog", "obstetric", "sexism", "misogyny", "patriarchy", "period poverty",
    "menstrual", "domestic violence", "gender-based violence", "sexual harassment",
    "sexual assault", "rape", "femicide", "honour killing", "fgm",
    "female genital mutilation", "forced marriage", "bodily autonomy",
    "surrogacy", "reproductive justice",
  ],
  "LGBTQIA+": [
    "lgbtq", "lgbtqia", "queer", "gay", "lesbian", "bisexual", "transgender",
    "nonbinary", "non-binary", "intersex", "asexual", "pansexual", "pride",
    "same-sex", "gay rights", "trans rights", "marriage equality", "homophobia",
    "transphobia", "biphobia", "conversion therapy", "gender affirming",
    "gender identity", "pronouns", "deadnaming", "two-spirit",
  ],
  "Migration & displacement": [
    "refugee", "asylum", "asylum seeker", "migrant", "migration", "deportation",
    "undocumented", "detention", "displacement", "diaspora", "stateless",
    "forced displacement",
  ],
  "Rights & justice": [
    "human rights", "civil rights", "civil liberties", "discrimination",
    "minority rights", "indigenous", "racial justice", "racism",
  ],
};

const GATE_B_KEYWORDS = [
  "bodily autonomy", "fgm", "forced sterilisation", "obstetric violence",
  "care economy", "unpaid care", "domestic workers", "garment workers",
  "labour rights", "pay equity",
  "land dispossession", "climate displacement", "environmental racism",
  "climate justice", "indigenous land",
  "surveillance", "facial recognition", "algorithmic discrimination",
  "internet shutdown", "digital rights", "spyware", "deepfake",
  "gender ideology", "anti-trans", "book ban", "don't say gay", "bathroom bill",
  "trafficking", "forced marriage", "extrajudicial killing", "impunity",
  "press freedom", "journalist arrested", "academic freedom",
];

const SYSTEM_KEYWORDS: Record<string, string[]> = {
  "Anti-Rights & Backlash Movements": [
    "gender ideology", "traditional values", "anti-trans", "book ban",
    "don't say gay", "bathroom bill", "conversion therapy",
    "parents rights", "religious freedom exemption", "rights rollback",
    "far-right", "backlash", "anti-lgbtq", "culture war",
  ],
  "Bodily Autonomy & Reproductive Justice": [
    "abortion", "reproductive rights", "bodily autonomy", "contraception",
    "maternal mortality", "fgm", "female genital mutilation",
    "forced sterilisation", "obstetric violence", "period poverty",
    "gender affirming care", "puberty blocker", "surrogacy",
  ],
  "Violence, Safety & Criminal Justice": [
    "femicide", "domestic violence", "gender-based violence", "sexual assault",
    "rape", "honour killing", "forced marriage", "trafficking",
    "police brutality", "extrajudicial killing", "forced disappearance",
    "torture", "hate crime", "impunity",
  ],
  "State Power, Law & Governance": [
    "supreme court", "constitutional court", "landmark ruling",
    "criminalised", "decriminalised", "legislation", "signed into law",
    "anti-discrimination law", "equality act", "treaty", "un resolution",
    "election", "parliament",
  ],
  "Economic & Labour Justice": [
    "gender pay gap", "pay equity", "care economy", "unpaid care",
    "domestic workers", "garment workers", "labour rights", "union",
    "maternity leave", "pension", "motherhood penalty", "glass ceiling",
    "poverty", "food insecurity", "land rights",
  ],
  "Migration, Borders & Citizenship": [
    "refugee", "asylum seeker", "stateless", "deportation",
    "detention centre", "border violence", "forced return",
    "xenophobia", "kafala", "rohingya", "mediterranean crossing",
  ],
  "Climate & Environmental Justice": [
    "climate displacement", "land dispossession", "indigenous land",
    "environmental racism", "sacrifice zone", "climate justice",
    "deforestation", "dam construction", "water rights",
    "loss and damage", "just transition",
  ],
  "Technology & Digital Power": [
    "facial recognition", "mass surveillance", "spyware", "pegasus",
    "internet shutdown", "content moderation", "algorithmic discrimination",
    "deepfake", "non-consensual imagery", "digital rights",
    "data privacy", "biometric", "predictive policing",
  ],
  "Culture, Media & Narrative Power": [
    "press freedom", "journalist arrested", "book ban",
    "academic freedom", "representation", "indigenous media",
    "language rights", "censorship", "drag",
  ],
};

const IDENTITY_TAGS = [
  "Women / Girls", "LGBTQIA+", "Indigenous peoples",
  "Migrants & refugees", "People with disabilities",
  "Racialised minorities", "Religious minorities",
  "Children & youth", "Incarcerated people", "Sex workers",
];

const EN_SOURCES = {
  "General news (keyword-filtered)": [
    "BBC News", "BBC News World", "The Guardian", "Reuters", "Reuters World",
    "Al Jazeera", "NPR News", "The Independent", "HuffPost", "New York Times 🔒",
    "Associated Press", "CNN World", "Washington Post 🔒", "Financial Times 🔒",
    "CBC News World", "ABC News", "SBS News World", "Le Monde", "IPS News Agency",
    "The Conversation", "Global Voices", "Fair Observer",
  ],
  "Women & feminist publications (all articles included)": [
    "The Guardian Women", "Ms. Magazine", "Feministing", "Jezebel",
    "Refinery29 Feminism", "The Funambulist",
  ],
  "LGBTQIA+ publications (all articles included)": [
    "Gay Times", "PinkNews", "Out Magazine", "LGBTQ Nation", "Advocate",
    "Autostraddle", "Them", "Queerty", "Xtra Magazine",
  ],
  "Progressive & investigative (keyword-filtered)": [
    "AlterNet", "Democracy Now", "FSRN", "Jewish Voice for Peace",
    "Le Monde Diplomatique", "The Progressive", "Reveal News",
    "Accuracy in Media", "Media Matters",
  ],
};

const DE_SOURCES = {
  "General / quality news (keyword-filtered)": [
    "tagesschau.de", "Der Spiegel", "Die Zeit", "Süddeutsche Zeitung",
    "taz", "Deutsche Welle Deutsch", "Deutschlandfunk",
  ],
  "Investigative / progressive (all articles included)": [
    "CORRECTIV", "netzpolitik.org",
  ],
  "DACH expansion (keyword-filtered)": [
    "Der Standard", "ORF.at",
  ],
  "LGBTQIA+ specialist (all articles included)": [
    "queer.de",
  ],
  "Feminist specialist (all articles included)": [
    "Missy Magazine",
  ],
};

// ── Components ────────────────────────────────────────────────────────────────

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground border-b border-border pb-2 mb-4 mt-10 font-sans">
    {children}
  </h2>
);

interface ScrapingLogicPageProps {
  onClose: () => void;
}

const ScrapingLogicPage = ({ onClose }: ScrapingLogicPageProps) => {
  const systemTopics = TOPICS.filter((t) => t.label !== "All Topics");

  return (
    <main className="max-w-[700px] mx-auto px-4 py-8 font-sans">

      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onClose}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          ← back
        </button>
        <h1 className="text-lg font-semibold text-foreground">scraping logic</h1>
      </div>

      {/* Intro */}
      <p className="text-[0.95rem] text-foreground leading-relaxed mb-4">
        <strong>shared ground</strong> aggregates feminist, LGBTQIA+, and global rights news
        from RSS feeds, scraped every 12 hours. Articles are organised by systems of power —
        not isolated issue buckets — to surface structural trends, not just incidents.
      </p>
      <p className="text-[0.9rem] text-muted-foreground leading-relaxed">
        Only publicly accessible articles are included. Sources marked 🔒 are paywalled and
        can be filtered out. Articles older than 30 days are automatically removed.
      </p>

      {/* EN Sources */}
      <SectionHeading>anglophone sources — 43 publications</SectionHeading>
      {Object.entries(EN_SOURCES).map(([category, names]) => (
        <div key={category} className="mb-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 font-medium">
            {category}
          </p>
          <p className="text-[0.9rem] text-foreground leading-relaxed">
            {names.join(" · ")}
          </p>
        </div>
      ))}

      {/* DE Sources */}
      <SectionHeading>german-language sources (DACH) — 13 publications</SectionHeading>
      {Object.entries(DE_SOURCES).map(([category, names]) => (
        <div key={category} className="mb-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 font-medium">
            {category}
          </p>
          <p className="text-[0.9rem] text-foreground leading-relaxed">
            {names.join(" · ")}
          </p>
        </div>
      ))}

      {/* How articles are selected */}
      <SectionHeading>how articles are selected</SectionHeading>
      <p className="text-[0.9rem] text-muted-foreground leading-relaxed mb-5">
        Specialist publications (Women &amp; Feminist, LGBTQIA+) include all their articles.
        For all other sources, an article must pass at least one of three inclusion gates:
      </p>

      <div className="space-y-3 mb-6">
        <div className="border border-border rounded-sm p-4 bg-secondary/40">
          <p className="text-xs font-semibold uppercase tracking-wider text-foreground mb-1.5">
            Gate A — direct identity signal
          </p>
          <p className="text-[0.85rem] text-muted-foreground leading-relaxed">
            Article contains an explicit identity keyword <em>and</em> describes a
            rights-affecting context — a legal decision, policy change, documented harm,
            or organised resistance. A celebrity profile that mentions someone's gender does
            not pass this gate; a court ruling on bodily autonomy does.
          </p>
        </div>
        <div className="border border-border rounded-sm p-4 bg-secondary/40">
          <p className="text-xs font-semibold uppercase tracking-wider text-foreground mb-1.5">
            Gate B — structural system signal
          </p>
          <p className="text-[0.85rem] text-muted-foreground leading-relaxed">
            Article describes a structural issue within one of the 9 system categories
            without requiring an explicit identity mention. Terms like{" "}
            <em>care economy</em>, <em>land dispossession</em>,{" "}
            <em>internet shutdown</em>, or <em>algorithmic discrimination</em> trigger
            inclusion on their own — the system itself implies rights relevance. This gate
            catches the stories the old model missed: garment workers, forced displacement,
            surveillance of activists.
          </p>
        </div>
        <div className="border border-border rounded-sm p-4 bg-secondary/40">
          <p className="text-xs font-semibold uppercase tracking-wider text-foreground mb-1.5">
            Gate C — institutional signal
          </p>
          <p className="text-[0.85rem] text-muted-foreground leading-relaxed">
            Article directly involves a rights institution, treaty body, or named rights
            organisation — UN Special Rapporteurs, Amnesty International, Human Rights
            Watch, or regional equivalents.
          </p>
        </div>
      </div>

      {/* Gate A keywords */}
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3 mt-6">
        Gate A keywords by group
      </p>
      {Object.entries(GATE_A_KEYWORDS).map(([group, words]) => (
        <div key={group} className="mb-4">
          <p className="text-xs font-medium text-muted-foreground mb-1">{group}</p>
          <p className="text-[0.8rem] text-muted-foreground leading-relaxed">
            {words.join(", ")}
          </p>
        </div>
      ))}

      {/* Gate B keywords */}
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2 mt-6">
        Gate B structural keywords (no identity mention required)
      </p>
      <p className="text-[0.8rem] text-muted-foreground leading-relaxed">
        {GATE_B_KEYWORDS.join(", ")}
      </p>

      {/* System categories */}
      <SectionHeading>system categories</SectionHeading>
      <p className="text-[0.9rem] text-muted-foreground leading-relaxed mb-5">
        Articles are tagged with 1–3 primary system categories based on the strongest
        structural signals present. Categories reflect systems of power, not isolated
        issues — an article about a pension cut that disproportionately affects women
        belongs in <strong>Economic &amp; Labour Justice</strong>, not a generic gender bucket.
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {systemTopics.map((topic) => {
          const colors = TOPIC_COLORS[topic.label];
          return (
            <span
              key={topic.label}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-sm"
              style={
                colors
                  ? { backgroundColor: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }
                  : { border: "1px solid var(--border)" }
              }
            >
              {topic.emoji} {topic.label}
            </span>
          );
        })}
      </div>

      {/* System keywords */}
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">
        category keywords
      </p>
      {Object.entries(SYSTEM_KEYWORDS).map(([category, words]) => (
        <div key={category} className="mb-4">
          <p className="text-xs font-medium text-muted-foreground mb-1">{category}</p>
          <p className="text-[0.8rem] text-muted-foreground leading-relaxed">
            {words.join(", ")}
          </p>
        </div>
      ))}

      {/* Identity tags */}
      <SectionHeading>identity tags</SectionHeading>
      <p className="text-[0.9rem] text-muted-foreground leading-relaxed mb-4">
        Separately from system categories, articles are tagged with the affected groups
        they describe. Identity tags answer "who is this about", not "what system is at
        work". The same article can carry a system tag of{" "}
        <strong>Violence, Safety &amp; Criminal Justice</strong> and an identity tag of{" "}
        <strong>LGBTQIA+</strong>.
      </p>
      <div className="flex flex-wrap gap-2">
        {IDENTITY_TAGS.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center px-3 py-1 text-xs font-medium border border-border bg-secondary text-muted-foreground rounded-sm"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Anti-rights note */}
      <SectionHeading>a note on Anti-Rights &amp; Backlash</SectionHeading>
      <p className="text-[0.9rem] text-muted-foreground leading-relaxed">
        The <strong>🔥 Anti-Rights &amp; Backlash Movements</strong> category tracks
        organised efforts to roll back existing rights protections or suppress minority
        groups. It is applied when an article describes a named political movement,
        legislative campaign, or coordinated campaign explicitly targeting minority
        rights — not general conservative governance or ordinary partisan disagreement.
        The same standard applies regardless of geography or political tradition.
      </p>

      <p className="mt-12 text-xs text-muted-foreground border-t border-border pt-4">
        shared ground · scrapes every 12 hours · articles kept for 30 days · built for independent readers
      </p>

    </main>
  );
};

export default ScrapingLogicPage;
