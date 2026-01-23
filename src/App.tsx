import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from 'react';
import { i18n, initializeLanguage } from '@/i18n/debug';

import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Advisory from "./pages/Advisory";
import CropPlanning from "./pages/CropPlanning";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import TestSimple from "./components/TestSimple";

const queryClient = new QueryClient();

const App = () => {
  // Initialize language on app load
  useEffect(() => {
    initializeLanguage();
    console.log('App mounted, current language:', i18n.language);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/advisory" element={<Advisory />} />
            <Route path="/planning" element={<CropPlanning />} />
            <Route path="/about" element={<About />} />
            <Route path="/test" element={<TestSimple />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
