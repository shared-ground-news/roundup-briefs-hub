import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// Main feed
import Index from "./pages/Index";

// New design pages
import Podcasts from "./pages/Podcasts";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Impressum from "./pages/Impressum";
import Datenschutz from "./pages/Datenschutz";
import Newsletter from "./pages/Newsletter";

// Auth-required pages (Valeria's)
import SavedPage from "./pages/SavedPage";
import ProfilePage from "./pages/ProfilePage";

import NotFound from "./pages/NotFound";

import type { Locale } from "@/lib/constants";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Redirect bare root to German (default) */}
            <Route path="/" element={<Navigate to="/de" replace />} />

            {/* Locale feed routes */}
            <Route path="/de" element={<Index locale={"de" as Locale} />} />
            <Route path="/en" element={<Index locale={"en" as Locale} />} />

            {/* Static / design pages */}
            <Route path="/podcasts"   element={<Podcasts />} />
            <Route path="/about"      element={<About />} />
            <Route path="/contact"    element={<Contact />} />
            <Route path="/impressum"  element={<Impressum />} />
            <Route path="/datenschutz" element={<Datenschutz />} />
            <Route path="/newsletter" element={<Newsletter />} />

            {/* Saved articles (auth-aware) */}
            <Route path="/saved"     element={<Navigate to="/de/saved" replace />} />
            <Route path="/de/saved"  element={<SavedPage locale={"de" as Locale} />} />
            <Route path="/en/saved"  element={<SavedPage locale={"en" as Locale} />} />

            {/* Profile */}
            <Route path="/profile"    element={<Navigate to="/de/profile" replace />} />
            <Route path="/de/profile" element={<ProfilePage locale={"de" as Locale} />} />
            <Route path="/en/profile" element={<ProfilePage locale={"en" as Locale} />} />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
