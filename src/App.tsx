import { Booking, Footer } from "./components/Booking";
import { Credits } from "./components/Credits";
import { Dossiers } from "./components/Dossiers";
import { Fitting } from "./components/Fitting";
import { Hero } from "./components/Hero";
import { Numbers } from "./components/Numbers";
import { PointerAtmosphere } from "./components/PointerAtmosphere";
import { Voice } from "./components/Voice";
import { Wardrobe } from "./components/Wardrobe";

export default function App() {
  return (
    <div className="overflow-x-hidden">
      <PointerAtmosphere />
      <main>
        <Hero />
        <Voice />
        <Numbers />
        <Credits />
        <Wardrobe />
        <Fitting />
        <Dossiers />
        <Booking />
      </main>
      <Footer />
    </div>
  );
}
