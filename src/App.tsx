
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Sellers from "./pages/Sellers";
import Account from "./pages/Account";
import SupplierProfile from "./pages/SupplierProfile";
import ServicePage from "./pages/ServicePage";
import NotFound from "./pages/NotFound";
import StartPurchase from "./pages/StartPurchase";
import HowItWorks from "./pages/HowItWorks";
import Products from "./pages/Products";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/sellers" element={<Sellers />} />
          <Route path="/supplier/:id" element={<SupplierProfile />} />
          <Route path="/service/:slug" element={<ServicePage />} />
          <Route path="/account" element={<Account />} />
          <Route path="/start-purchase" element={<StartPurchase />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/products" element={<Products />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;