import { Navigate, Route, Routes } from "react-router-dom";
import { AthleteLayout, BrandLayout, PublicLayout } from "./components/Layouts";
import { Auth } from "./pages/Auth";
import { Landing } from "./pages/Landing";
import { AthleteDeals } from "./pages/athlete/Deals";
import { AthleteInventory } from "./pages/athlete/Inventory";
import { AthletePhotos } from "./pages/athlete/Photos";
import { AthleteStudio } from "./pages/athlete/Studio";
import { AthletePublic } from "./pages/brand/AthletePublic";
import { BrandHub } from "./pages/brand/BrandHub";
import { CampaignDetail } from "./pages/brand/CampaignDetail";
import { Campaigns } from "./pages/brand/Campaigns";
import { DealRoom } from "./pages/brand/DealRoom";
import { DealRooms } from "./pages/brand/DealRooms";
import { Discover } from "./pages/brand/Discover";
import { Events } from "./pages/brand/Events";
import { Portfolio } from "./pages/brand/Portfolio";
import { Project } from "./pages/brand/Project";
import { useStore } from "./store/StoreContext";

function Gate({ role, children }: { role: "athlete" | "brand"; children: React.ReactNode }) {
  const { currentUser } = useStore();
  if (!currentUser) return <Navigate to={`/auth?role=${role}`} replace />;
  if (currentUser.role !== role) {
    return <Navigate to={currentUser.role === "athlete" ? "/athlete" : "/brand/discover"} replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
      </Route>
      <Route path="/athlete" element={<Gate role="athlete"><AthleteLayout /></Gate>}>
        <Route index element={<AthleteStudio />} />
        <Route path="photos" element={<AthletePhotos />} />
        <Route path="inventory" element={<AthleteInventory />} />
        <Route path="deals" element={<AthleteDeals />} />
        <Route path="deals/:id" element={<DealRoom />} />
      </Route>
      <Route path="/brand" element={<Gate role="brand"><BrandLayout /></Gate>}>
        <Route path="discover" element={<Discover />} />
        <Route path="athlete/:id" element={<AthletePublic />} />
        <Route path="campaigns" element={<Campaigns />} />
        <Route path="campaigns/:id" element={<CampaignDetail />} />
        <Route path="project" element={<Project />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="deals" element={<DealRooms />} />
        <Route path="deals/:id" element={<DealRoom />} />
        <Route path="events" element={<Events />} />
        <Route path="hub" element={<BrandHub />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
