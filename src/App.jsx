import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SquadPage from './pages/SquadPage';
import PlayerProfilePage from './pages/PlayerProfilePage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-pitch text-text font-sans">
        <Routes>
          <Route path="/" element={<SquadPage />} />
          <Route path="/player/:id" element={<PlayerProfilePage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;