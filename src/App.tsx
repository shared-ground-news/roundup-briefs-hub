import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import MapPage from "./pages/MapPage";
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
            {/* Redirect bare root to English */}
            <Route path="/" element={<Navigate to="/en" replace />} />

            {/* Locale feed routes */}
            <Route path="/en" element={<Index locale={"en" as Locale} />} />
            <Route path="/de" element={<Index locale={"de" as Locale} />} />

            {/* World map */}
            <Route path="/map" element={<MapPage />} />

            {/* Saved articles */}
            <Route path="/saved" element={<Navigate to="/en/saved" replace />} />
            <Route path="/en/saved" element={<SavedPage locale={"en" as Locale} />} />
            <Route path="/de/saved" element={<SavedPage locale={"de" as Locale} />} />

            {/* Profile */}
            <Route path="/profile" element={<Navigate to="/en/profile" replace />} />
            <Route path="/en/profile" element={<ProfilePage locale={"en" as Locale} />} />
            <Route path="/de/profile" element={<ProfilePage locale={"de" as Locale} />} />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
