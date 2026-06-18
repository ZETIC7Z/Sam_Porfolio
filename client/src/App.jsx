import { useState } from "react";
import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Home } from "./pages/Home";
import { Admin } from "./pages/Admin";
import { Dashboard } from "./pages/Dashboard";
import { NotFound } from "./pages/NotFound";
import { Toaster } from "@/components/ui/toaster";
import WelcomeScreen from "@/components/WelcomeScreen";
import { Analytics } from "@vercel/analytics/react";

const DashboardGuard = () => {
  const token = localStorage.getItem("admin_token");
  return token ? <Dashboard /> : <Navigate to="/admin" replace />;
};

const RouterContent = () => {
  const [welcomeComplete, setWelcomeComplete] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === "/";

  if (isHome && !welcomeComplete) {
    return (
      <WelcomeScreen onWelcomeComplete={() => setWelcomeComplete(true)} />
    );
  }

  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/dashboard" element={<DashboardGuard />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Toaster />
      <BrowserRouter>
        <RouterContent />
        <Analytics />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
