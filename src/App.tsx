import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages — Alex's visual design
import MapPage        from "./pages/MapPage";
import FeedPage       from "./pages/FeedPage";
import ThemenPage     from "./pages/ThemenPage";
import AnalysisPage   from "./pages/AnalysisPage";
import NewsletterPage from "./pages/NewsletterPage";
import UeberUnsPage   from "./pages/UeberUnsPage";
import NotFound       from "./pages/NotFound";

// Auth-protected pages — Valeria's originals (kept unchanged)
// Uncomment once the Supabase auth files are present:
// import { AuthProvider } from "./hooks/useAuth";
// import SavedPage   from "./pages/SavedPage";
// import ProfilePage from "./pages/ProfilePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        {/* <AuthProvider> */}
        <Routes>

          {/* ── Landing: interactive world map ── */}
          <Route path="/" element={<MapPage />} />

          {/* ── Country feeds ── */}
          {/* DACH → German locale feed */}
          <Route path="/de" element={<FeedPage country="Germany"       countryName="Deutschland" />} />
          <Route path="/at" element={<FeedPage country="Austria"       countryName="Österreich" />} />
          <Route path="/ch" element={<FeedPage country="Switzerland"   countryName="Schweiz" />} />

          {/* International → English locale feed */}
          <Route path="/es" element={<FeedPage country="Spain"         countryName="Spanien" />} />
          <Route path="/it" element={<FeedPage country="Italy"         countryName="Italien" />} />
          <Route path="/us" element={<FeedPage country="United States" countryName="USA" />} />
          <Route path="/cn" element={<FeedPage country="China"         countryName="China" />} />
          <Route path="/ug" element={<FeedPage country="Uganda"        countryName="Uganda" />} />
          <Route path="/fi" element={<FeedPage country="Finland"       countryName="Finnland" />} />
          <Route path="/tr" element={<FeedPage country="Turkey"        countryName="Türkei" />} />
          <Route path="/ir" element={<FeedPage country="Iran"          countryName="Iran" />} />
          <Route path="/za" element={<FeedPage country="South Africa"  countryName="Südafrika" />} />
          <Route path="/in" element={<FeedPage country="India"         countryName="Indien" />} />

          {/* ── Static pages ── */}
          <Route path="/themen"     element={<ThemenPage />} />
          <Route path="/analyse"    element={<AnalysisPage />} />
          <Route path="/newsletter" element={<NewsletterPage />} />
          <Route path="/ueber-uns"  element={<UeberUnsPage />} />

          {/* ── Auth-protected pages (Valeria's) ── */}
          {/* Uncomment once useAuth / SavedPage / ProfilePage are present: */}
          {/* <Route path="/de/saved"      element={<SavedPage locale="de" />} /> */}
          {/* <Route path="/en/saved"      element={<SavedPage locale="en" />} /> */}
          {/* <Route path="/de/profile"    element={<ProfilePage locale="de" />} /> */}
          {/* <Route path="/en/profile"    element={<ProfilePage locale="en" />} /> */}

          {/* ── 404 ── */}
          <Route path="*" element={<NotFound />} />

        </Routes>
        {/* </AuthProvider> */}
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
