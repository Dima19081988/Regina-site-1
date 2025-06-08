import { Routes, Route } from "react-router-dom";
import { Header } from "./components/header";
import { Footer } from "./components/footer";
import { TrendSection } from "./components/trendSection";
import { PriceList } from "./pages/priceList";
import { Home } from "./pages/home";


function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={
            <>
              <Home />
              <TrendSection />
            </>
          } />
          <Route path="/pricelist" element={<PriceList />}/>
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App
