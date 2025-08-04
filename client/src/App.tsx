import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { Router, Route, Switch } from "wouter";
import { queryClient } from "./lib/queryClient";
import { TradingLayout } from "./components/TradingLayout";
import { AuthForm } from "./components/AuthForm";
import { useAuth } from "./hooks/useAuth";
import Dashboard from "./pages/Dashboard";
import Trading from "./pages/Trading";
import Portfolio from "./pages/Portfolio";
import Charts from "./pages/Charts";
import Analytics from "./pages/Analytics";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthForm />;
  }

  return (
    <Router>
      <Switch>
        <Route path="/login" component={AuthForm} />
        <Route path="/" component={() => <TradingLayout><Dashboard /></TradingLayout>} />
        <Route path="/dashboard" component={() => <TradingLayout><Dashboard /></TradingLayout>} />
        <Route path="/trading" component={() => <TradingLayout><Trading /></TradingLayout>} />
        <Route path="/portfolio" component={() => <TradingLayout><Portfolio /></TradingLayout>} />
        <Route path="/charts" component={() => <TradingLayout><Charts /></TradingLayout>} />
        <Route path="/analytics" component={() => <TradingLayout><Analytics /></TradingLayout>} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <div className="dark">
        <Toaster />
        <Sonner />
        <AppContent />
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
