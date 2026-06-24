import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import NotificationPrompt from "@/components/NotificationPrompt";

// Main feed
import Index from "./pages/Index";

// Pages
import Podcasts from "./pages/Podcasts";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Datenschutz from "./pages/Datenschutz";
import Newsletter from "./pages/Newsletter";
import NotFound from "./pages/NotFound";

import type { Locale } from "@/lib/constants";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <NotificationPrompt />
        <Routes>
          {/* Redirect bare root to German (default) */}
          <Route path="/" element={<Navigate to="/de" replace />} />

          {/* Locale feed routes */}
          <Route path="/de" element={<Index locale={"de" as Locale} />} />
          <Route path="/en" element={<Index locale={"en" as Locale} />} />

          {/* Static pages */}
          <Route path="/podcasts"    element={<Podcasts />} />
          <Route path="/about"       element={<About />} />
          <Route path="/contact"     element={<Contact />} />
          <Route path="/impressum"   element={<Navigate to="/contact" replace />} />
          <Route path="/datenschutz" element={<Datenschutz />} />
          <Route path="/newsletter"  element={<Newsletter />} />

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
