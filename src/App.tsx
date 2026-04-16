import { HashRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ModeSelect from './pages/ModeSelect';
import PreTripGuide from './pages/PreTripGuide';
import OnSiteGuide from './pages/OnSiteGuide';
import ExploreMode from './pages/ExploreMode';
import SmartRoute from './pages/SmartRoute';

export default function App() {
  return (
    <HashRouter>
      {/* Landscape orientation warning */}
      <div className="landscape-warning">
        <span className="text-5xl mb-4">📱</span>
        <h2 className="font-serif text-xl font-bold text-brown mb-2">请旋转手机</h2>
        <p className="text-sm text-brown-muted leading-relaxed">
          博物馆漫步需要竖屏使用<br/>以获得最佳体验
        </p>
      </div>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/:museumId" element={<ModeSelect />} />
        <Route path="/:museumId/pre-trip" element={<PreTripGuide />} />
        <Route path="/:museumId/on-site" element={<OnSiteGuide />} />
        <Route path="/:museumId/on-site/explore" element={<ExploreMode />} />
        <Route path="/:museumId/on-site/route" element={<SmartRoute />} />
      </Routes>
    </HashRouter>
  );
}
