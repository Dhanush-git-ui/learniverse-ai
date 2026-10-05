import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React, { Suspense } from "react";
import Index from "./pages/Index";
import TopicsPage from "./pages/TopicsPage";
import AboutPage from "./pages/AboutPage";
import HowItWorksPage from "./pages/HowItWorksPage";

// [FIX M-2] Lazy-load pages that use heavy dependencies (like Monaco Editor)
const PlacementAssessment = React.lazy(() => import("./pages/PlacementAssessment"));
const TopicDetailPage = React.lazy(() => import("./pages/TopicDetailPage"));
const Top100Codes = React.lazy(() => import("./pages/Top100Codes"));
const StudentDashboard = React.lazy(() => import("./pages/StudentDashboard"));


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/topics" element={<TopicsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/dashboard" element={<Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">Loading Dashboard...</div>}>
                                             <StudentDashboard />
                                             </Suspense>
                                            } />

          
          <Route path="/top-100-codes" element={
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">Loading Top 100 Codes...</div>}>
              <Top100Codes />
            </Suspense>
          } />
          
          {/* Lazy loaded routes wrapped in Suspense */}
          <Route path="/topics/:slug" element={
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
              <TopicDetailPage />
            </Suspense>
          } />
          
          <Route path="/assessment" element={
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">Loading Assessment...</div>}>
              <PlacementAssessment />
            </Suspense>
          } />
          
          {/* Redirect all unmatched or non-existent routes to topics page */}
          <Route path="*" element={<Navigate to="/topics" replace />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
