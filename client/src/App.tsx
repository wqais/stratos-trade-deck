import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TradingLayout } from "./components/TradingLayout";
import Dashboard from "./pages/Dashboard";
import Trading from "./pages/Trading";
import Portfolio from "./pages/Portfolio";
import Charts from "./pages/Charts";
import Analytics from "./pages/Analytics";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <div className="dark">
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<TradingLayout><Dashboard /></TradingLayout>} />
            <Route path="/dashboard" element={<TradingLayout><Dashboard /></TradingLayout>} />
            <Route path="/trading" element={<TradingLayout><Trading /></TradingLayout>} />
            <Route path="/portfolio" element={<TradingLayout><Portfolio /></TradingLayout>} />
            <Route path="/charts" element={<TradingLayout><Charts /></TradingLayout>} />
            <Route path="/analytics" element={<TradingLayout><Analytics /></TradingLayout>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
