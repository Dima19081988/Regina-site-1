import React from "react";
import { useState, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Header } from "./components/header";
import { Footer } from "./components/footer";
import { TrendSection } from "./components/trendSection";
import { PriceList } from "./pages/priceList";
import { Home } from "./pages/home";
import { TrendDetail } from "./pages/trendDetail";
import AppointmentsPage from "./pages/admin/appointments/appointmentPage";
import NotesPage from "./pages/admin/notes";

const AdminDashboard = React.lazy(() => import('./pages/admin/adminDashboard'));

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => setIsAuthenticated(false);
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
  };

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
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute>
                  <Suspense fallback={<div>Загрузка...</div>}>
                    <AdminDashboard />
                  </Suspense>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/notes" 
              element={
                <ProtectedRoute>
                  <Suspense fallback={<div>Загрузка...</div>}>
                    <NotesPage />
                  </Suspense>
                </ProtectedRoute>
              } 
            />
            <Route
              path="/admin/appointments"
              element={
                <ProtectedRoute>
                  <AppointmentsPage />
                </ProtectedRoute>
              }
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
