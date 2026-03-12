import { createBrowserRouter } from "react-router";
import { Home } from "./pages/Home";
import { RentalAgreement } from "./pages/RentalAgreement";
import { Receipt } from "./pages/Receipt";
import { CarSale } from "./pages/CarSale";
import { LoanAgreement } from "./pages/LoanAgreement";
import { Prenup } from "./pages/Prenup";
import { PropertyDivision } from "./pages/PropertyDivision";
import { ChildTravel } from "./pages/ChildTravel";
import { Alimony } from "./pages/Alimony";
import { ServiceContract } from "./pages/ServiceContract";
import { WorkContract } from "./pages/WorkContract";
import { SupplyContract } from "./pages/SupplyContract";
import { Employment } from "./pages/Employment";
import { WorkAcceptance } from "./pages/WorkAcceptance";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Dashboard } from "./pages/Dashboard";
import { Pricing } from "./pages/Pricing";
import { Privacy } from "./pages/Privacy";
import { Terms } from "./pages/Terms";

export const router = createBrowserRouter([
  { path: "/", Component: Home },
  { path: "/login", Component: Login },
  { path: "/signup", Component: Signup },
  { path: "/dashboard", Component: Dashboard },
  { path: "/pricing", Component: Pricing },
  { path: "/privacy", Component: Privacy },
  { path: "/terms", Component: Terms },
  
  // Гражданские сделки
  { path: "/dogovor-arendy-kvartiry", Component: RentalAgreement },
  { path: "/raspiska-v-poluchenii-deneg", Component: Receipt },
  { path: "/dogovor-kupli-prodazhi-avto", Component: CarSale },
  { path: "/dogovor-zajma", Component: LoanAgreement },
  
  // Семейные
  { path: "/brachnyj-dogovor", Component: Prenup },
  { path: "/soglashenie-o-razdele-imushhestva", Component: PropertyDivision },
  { path: "/soglasie-na-vyezd-rebenka", Component: ChildTravel },
  { path: "/soglashenie-ob-alimentah", Component: Alimony },
  
  // Для бизнеса
  { path: "/dogovor-okazaniya-uslug", Component: ServiceContract },
  { path: "/dogovor-podryada", Component: WorkContract },
  { path: "/dogovor-postavki", Component: SupplyContract },
  { path: "/trudovoj-dogovor", Component: Employment },
  { path: "/akt-vypolnennyh-rabot", Component: WorkAcceptance },
]);