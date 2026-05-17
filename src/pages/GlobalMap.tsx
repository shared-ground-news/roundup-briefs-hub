import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { X, ExternalLink, Loader2, Clock } from "lucide-react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

import { useCountryArticles } from "@/hooks/useArticles";
import { ISO_TO_COUNTRY, PLACEHOLDER_IMG } from "@/lib/api";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface ArticlePreview {
  thumbnail: string;
  source: string;
  headline: string;
  link?: string;
}

interface CountryMeta {
  name: string;
  isoCode: string;
  coords: [number, number];
  live: boolean; // true = real API data available
  mockArticles?: ArticlePreview[];
}

// ─── DACH: live data via API ──────────────────────────────────────────────────
const DACH: CountryMeta[] = [
  { name: "Deutschland", isoCode: "DEU", coords: [10, 51],   live: true },
  { name: "Österreich",  isoCode: "AUT", coords: [14, 47.5], live: true },
  { name: "Schweiz",     isoCode: "CHE", coords: [8, 46.8],  live: true },
];

// ─── Planned countries (coming soon) ─────────────────────────────────────────
const COMING_SOON: CountryMeta[] = [
  { name: "France",       isoCode: "FRA", coords: [2, 47],    live: false },
  { name: "United Kingdom", isoCode: "GBR", coords: [-2, 54], live: false },
  { name: "Spain",        isoCode: "ESP", coords: [-3, 40],   live: false },
  { name: "Italy",        isoCode: "ITA", coords: [12, 42],   live: false },
  { name: "United States", isoCode: "USA", coords: [-98, 39], live: false },
  { name: "Brazil",       isoCode: "BRA", coords: [-53, -10], live: false },
  { name: "India",        isoCode: "IND", coords: [79, 22],   live: false },
  { name: "South Africa", isoCode: "ZAF", coords: [25, -29],  live: false },
  { name: "Kenya",        isoCode: "KEN", coords: [37, 0],    live: false },
  { name: "Japan",        isoCode: "JPN", coords: [138, 36],  live: false },
];

const ALL_COUNTRIES = [...DACH, ...COMING_SOON];
const countryLookup = new Map(ALL_COUNTRIES.map((c) => [c.isoCode, c]));

const GlobalMap = () => {
  const [selected, setSelected] = useState<CountryMeta | null>(null);
  const { articles: realArticles, loading: loadingReal, fetchForCountry, reset } =
    useCountryArticles();

  // Only fetch for live countries
  useEffect(() => {
    if (!selected || !selected.live) return;
    const backendName = ISO_TO_COUNTRY[selected.isoCode];
    if (backendName) fetchForCountry(backendName);
  }, [selected, fetchForCountry]);

  const handleSelect = (country: CountryMeta) => {
    if (selected?.isoCode !== country.isoCode) reset();
    setSelected(country);
  };

  const displayArticles: ArticlePreview[] =
    selected?.live && realArticles.length > 0
      ? realArticles.slice(0, 5).map((a) => ({
          thumbnail: a.image_url || PLACEHOLDER_IMG,
          source: a.source,
          headline: a.title,
          link: a.link,
        }))
      : [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container max-w-[1400px] mx-auto px-6 py-8">
        <h2 className="headline-xl mb-2">Weltkarte</h2>
        <p className="body-lg text-muted-foreground mb-2 max-w-2xl">
          Feministische Nachrichten aus dem deutschsprachigen Raum — weitere
          Länder folgen.
        </p>
        <div className="flex items-center gap-4 mb-8 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-[hsl(25,95%,53%)]" />
            Live-Daten
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-[hsl(0,0%,75%)]" />
            Bald verfügbar
          </span>
        </div>

        <div className="grid grid-cols-12 gap-0">
          {/* ── Map ────────────────────────────────────────────────────── */}
          <div className={`${selected ? "col-span-8" : "col-span-12"} transition-all duration-300`}>
            <div className="border border-border rounded-sm overflow-hidden bg-card">
              <ComposableMap
                projectionConfig={{ scale: 155, center: [10, 5] }}
                style={{ width: "100%", height: "auto" }}
              >
                <ZoomableGroup>
                  <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                      geographies.map((geo) => {
                        const iso = geo.properties?.ISO_A3 || geo.id;
                        const country = countryLookup.get(iso);
                        // Guard: features with no valid ISO code (disputed territories, etc.)
                        // must never match — undefined === undefined would be true otherwise
                        const isSelected = !!iso && selected?.isoCode === iso;
                        const isLive = country?.live === true;
                        const isComingSoon = country?.live === false;

                        return (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            onClick={() => { if (country) handleSelect(country); }}
                            data-tooltip-id="map-tooltip"
                            data-tooltip-content={
                              country
                                ? isLive
                                  ? `${country.name} — Live`
                                  : `${country.name} — Bald verfügbar`
                                : ""
                            }
                            style={{
                              default: {
                                fill: isSelected
                                  ? "hsl(217, 91%, 60%)"
                                  : isLive
                                  ? "hsl(25, 95%, 53%)"
                                  : isComingSoon
                                  ? "hsl(0, 0%, 78%)"
                                  : "hsl(0, 0%, 90%)",
                                stroke: "hsl(0, 0%, 100%)",
                                strokeWidth: 0.5,
                                cursor: country ? "pointer" : "default",
                                outline: "none",
                              },
                              hover: {
                                fill: country
                                  ? isLive
                                    ? "hsl(217, 91%, 60%)"
                                    : "hsl(0, 0%, 65%)"
                                  : "hsl(0, 0%, 85%)",
                                stroke: "hsl(0, 0%, 100%)",
                                strokeWidth: 0.5,
                                cursor: country ? "pointer" : "default",
                                outline: "none",
                              },
                              pressed: {
                                fill: "hsl(217, 91%, 50%)",
                                stroke: "hsl(0, 0%, 100%)",
                                strokeWidth: 0.5,
                                outline: "none",
                              },
                            }}
                          />
                        );
                      })
                    }
                  </Geographies>

                  {/* Live markers (orange, pulsing) */}
                  {DACH.map((country) => (
                    <Marker
                      key={country.isoCode}
                      coordinates={country.coords}
                      onClick={() => handleSelect(country)}
                      data-tooltip-id="map-tooltip"
                      data-tooltip-content={`${country.name} — Live`}
                      style={{ cursor: "pointer" }}
                    >
                      <circle r={6} fill="hsl(25, 95%, 53%)" opacity={0.3} className="animate-ping" />
                      <circle r={5} fill="hsl(25, 95%, 53%)" stroke="white" strokeWidth={1.5} />
                    </Marker>
                  ))}

                  {/* Coming soon markers (gray, smaller) */}
                  {COMING_SOON.map((country) => (
                    <Marker
                      key={country.isoCode}
                      coordinates={country.coords}
                      onClick={() => handleSelect(country)}
                      data-tooltip-id="map-tooltip"
                      data-tooltip-content={`${country.name} — Bald verfügbar`}
                      style={{ cursor: "pointer" }}
                    >
                      <circle r={4} fill="hsl(0, 0%, 72%)" stroke="white" strokeWidth={1.5} />
                    </Marker>
                  ))}
                </ZoomableGroup>
              </ComposableMap>
            </div>
          </div>

          {/* ── Side panel ──────────────────────────────────────────────── */}
          {selected && (
            <div className="col-span-4 border border-border border-l-0 rounded-r-sm bg-background animate-fade-in">
              <div className="flex items-center justify-between p-5 border-b border-border">
                <div>
                  <h3 className="font-headline text-xl font-bold">{selected.name}</h3>
                  <span className={`text-[10px] uppercase tracking-wider font-semibold ${
                    selected.live ? "text-accent-orange" : "text-muted-foreground"
                  }`}>
                    {selected.live ? "● Live" : "Bald verfügbar"}
                  </span>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-4 max-h-[500px] overflow-y-auto">
                {!selected.live ? (
                  // Coming soon state
                  <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
                    <Clock size={28} className="text-muted-foreground/40" />
                    <p className="text-sm font-medium text-foreground">Bald verfügbar</p>
                    <p className="text-xs text-muted-foreground max-w-[200px]">
                      Wir arbeiten daran, feministische Nachrichten aus{" "}
                      <strong>{selected.name}</strong> zu integrieren.
                    </p>
                  </div>
                ) : loadingReal ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 size={20} className="animate-spin text-muted-foreground" />
                  </div>
                ) : displayArticles.length > 0 ? (
                  <div className="space-y-4">
                    {displayArticles.map((article, i) => {
                      const inner = (
                        <article className="group flex gap-3 pb-4 border-b border-border last:border-b-0 cursor-pointer">
                          <div className="w-20 h-14 flex-shrink-0 overflow-hidden rounded-sm">
                            <img
                              src={article.thumbnail}
                              alt={article.headline}
                              className="w-full h-full object-cover"
                              onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMG; }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="body-sm text-muted-foreground text-xs">{article.source}</span>
                            <h4 className="headline-sm text-sm leading-snug mt-0.5 group-hover:text-accent-blue transition-colors line-clamp-2">
                              {article.headline}
                            </h4>
                          </div>
                          <ExternalLink size={12} className="text-muted-foreground mt-1 flex-shrink-0" />
                        </article>
                      );
                      return article.link ? (
                        <a key={i} href={article.link} target="_blank" rel="noopener noreferrer" className="block">
                          {inner}
                        </a>
                      ) : (
                        <div key={i}>{inner}</div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground py-6 text-center">
                    Keine Artikel verfügbar.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <Tooltip
          id="map-tooltip"
          className="!bg-foreground !text-primary-foreground !text-xs !font-medium !px-3 !py-1.5 !rounded-sm"
        />

        {/* Country grid */}
        <div className="mt-8">
          <h3 className="font-headline text-sm font-bold uppercase tracking-wide mb-4 text-muted-foreground">
            Live-Länder
          </h3>
          <div className="grid grid-cols-4 gap-3 mb-6">
            {DACH.map((country) => (
              <button
                key={country.name}
                onClick={() => handleSelect(country)}
                className={`text-left p-3 border rounded-sm transition-colors ${
                  selected?.isoCode === country.isoCode
                    ? "border-accent-blue bg-accent-blue/5"
                    : "border-border hover:border-accent-orange/50"
                }`}
              >
                <span className="body-sm font-semibold">{country.name}</span>
                <span className="block text-[10px] text-accent-orange uppercase tracking-wider mt-0.5">
                  Live
                </span>
              </button>
            ))}
          </div>

          <h3 className="font-headline text-sm font-bold uppercase tracking-wide mb-4 text-muted-foreground">
            Bald verfügbar
          </h3>
          <div className="grid grid-cols-4 gap-3">
            {COMING_SOON.map((country) => (
              <button
                key={country.name}
                onClick={() => handleSelect(country)}
                className={`text-left p-3 border rounded-sm transition-colors opacity-60 ${
                  selected?.isoCode === country.isoCode
                    ? "border-border bg-muted/30"
                    : "border-border hover:border-foreground/20"
                }`}
              >
                <span className="body-sm font-semibold">{country.name}</span>
                <span className="block text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">
                  Coming soon
                </span>
              </button>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GlobalMap;
