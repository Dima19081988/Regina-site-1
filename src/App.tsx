import { Routes, Route, Navigate } from "react-router-dom";
import { Header } from "./components/header";
import { Footer } from "./components/footer";
import { TrendSection } from "./components/trendSection";
import { PriceList } from "./pages/priceList";
import { Home } from "./pages/home";
import { TrendDetail } from "./pages/trendDetail";
import { AdminDashboard } from "./pages/admin/adminDashboard";
import { useState } from "react";



function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const handleLogin = () => {
    setIsAuthenticated(true);
  };
  const handleLogout = () => {
    setIsAuthenticated(false);
  } 

  return (
    <>
      <div className={isAuthenticated ? "admin-mode" : "user-mode"}>
        <Header 
          isAdmin={isAuthenticated} 
          onLogout={handleLogout}
          onLogin={handleLogin}
          isAuthenticated={isAuthenticated}
          />
        <main>
          <Routes>
          {/* Публичные маршруты */}
            <Route path="/" element={
             <>
                <Home />
                {!isAuthenticated && <TrendSection />}
             </>
           } />
            <Route path="/pricelist" element={<PriceList />}/>
            <Route path="/trend/:id" element={<TrendDetail/>}/>
           {/* Админские маршруты */}
            <Route path="/admin/dashboard" 
           element={
             isAuthenticated ? (<AdminDashboard />) : (<Navigate to="/admin/login" replace/>)}
           />
            <Route path="*" element={<Navigate to={"/"}/>}/>
          </Routes>
        </main>
      </div>
      <Footer />
    </>
  );
}

export default App;
