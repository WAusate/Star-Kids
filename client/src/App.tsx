import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { AppProvider } from "./lib/store";
import LoginPage from "./pages/login";
import KidsDashboard from "./pages/kids-dashboard";
import ParentSettings from "./pages/parent-settings";
import CategoryPage from "./pages/category";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LoginPage} />
      <Route path="/kids" component={KidsDashboard} />
      <Route path="/category/:id" component={CategoryPage} />
      <Route path="/parent" component={ParentSettings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppProvider>
          <Toaster />
          <Router />
        </AppProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
