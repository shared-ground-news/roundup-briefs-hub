import { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  BarChart, Bar,
} from "recharts";
import Masthead from "@/components/Masthead";
import SiteFooter from "@/components/SiteFooter";
import { API_BASE } from "@/lib/constants";

const COLORS = [
  "#C8003C","#4A1FA8","#006064","#E65100","#1B5E20",
  "#0D47A1","#4A148C","#B71C1C","#2E7D32","#37474F",
  "#C62828","#FF6F00",
];

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground border-b border-border pb-2 mb-6 mt-12 font-sans">
    {children}
  </h2>
);

const AnalysisPage = () => {
  const [sourcesData, setSourcesData] = useState<{source: string; count: number}[]>([]);
  const [dailyData, setDailyData] = useState<{date: string; count: number}[]>([]);
  const [keywordsData, setKeywordsData] = useState<{keyword: string; count: number}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [s, d, k] = await Promise.all([
          fetch(`${API_BASE}/api/analytics/sources`).then(r => r.json()),
          fetch(`${API_BASE}/api/analytics/daily`).then(r => r.json()),
          fetch(`${API_BASE}/api/analytics/keywords`).then(r => r.json()),
        ]);
        setSourcesData(s);
        setDailyData(d);
        setKeywordsData(k.slice(0, 20));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Masthead />
        <main className="max-w-[1100px] mx-auto px-4 py-16 text-center font-sans">
          <p className="text-muted-foreground text-sm">Daten werden geladen...</p>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Masthead />
      <main className="max-w-[1100px] mx-auto px-4 py-10">

        <SectionHeading>Artikel pro Quelle — letzte 7 Tage</SectionHeading>
        <p className="text-[0.85rem] text-muted-foreground font-sans mb-6">
          Wie viele Artikel mit unseren Keywords wurden von welcher Quelle veröffentlicht?
        </p>
        <div className="w-full h-[380px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sourcesData}
                dataKey="count"
                nameKey="source"
                cx="50%"
                cy="50%"
                outerRadius={140}
                label={({ source, percent }: { source: string; percent: number }) =>
                  `${source} ${(percent * 100).toFixed(0)}%`
                }
                labelLine={false}
              >
                {sourcesData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} Artikel`]} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <SectionHeading>Artikel pro Tag — letzte 90 Tage</SectionHeading>
        <p className="text-[0.85rem] text-muted-foreground font-sans mb-6">
          Entwicklung der Berichterstattung über Zeit.
        </p>
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10 }}
                tickFormatter={(v: string) => v.slice(5)}
                interval={6}
              />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip
                labelFormatter={(v) => `Datum: ${v}`}
                formatter={(value) => [`${value} Artikel`]}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#C8003C"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <SectionHeading>Häufigste Keywords</SectionHeading>
        <p className="text-[0.85rem] text-muted-foreground font-sans mb-6">
          Die 20 meistgenannten Keywords in allen Artikeln.
        </p>
        <div className="w-full h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={keywordsData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis
                type="category"
                dataKey="keyword"
                tick={{ fontSize: 10 }}
                width={140}
              />
              <Tooltip formatter={(value) => [`${value}x`]} />
              <Bar dataKey="count" fill="#4A1FA8" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </main>
      <SiteFooter />
    </div>
  );
};

export default AnalysisPage;
