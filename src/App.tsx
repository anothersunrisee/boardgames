import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CustomGameCursor } from './components/ui/CustomGameCursor';
import { ScrollToTop } from './components/navigation/ScrollToTop';

// ── Lazy-loaded Core & Outgame Pages ─────────────────────────────────────────
const Onboarding = lazy(() => import('./pages/Onboarding'));
const Home = lazy(() => import('./pages/Home'));
const RoomSetup = lazy(() => import('./pages/RoomSetup'));
const RoomPodium = lazy(() => import('./pages/RoomPodium'));
const StudioAssetPack = lazy(() => import('./pages/StudioAssetPack'));
const PlayerJoin = lazy(() => import('./pages/PlayerJoin'));
const PlayerController = lazy(() => import('./pages/PlayerController'));

// ── Game 1: Same Brain? NO! ──────────────────────────────────────────────────
const G1Setup = lazy(() => import('./pages/game1/G1Setup'));
const G1Round = lazy(() => import('./pages/game1/G1Round'));
const G1Reveal = lazy(() => import('./pages/game1/G1Reveal'));
const G1Results = lazy(() => import('./pages/game1/G1Results'));

// ── Game 2: Beauty Expert?! ──────────────────────────────────────────────────
const G2Setup = lazy(() => import('./pages/game2/G2Setup'));
const G2Secret = lazy(() => import('./pages/game2/G2Secret'));
const G2QnA = lazy(() => import('./pages/game2/G2QnA'));
const G2Guess = lazy(() => import('./pages/game2/G2Guess'));
const G2Reveal = lazy(() => import('./pages/game2/G2Reveal'));
const G2Results = lazy(() => import('./pages/game2/G2Results'));

// ── Game 3: Boys Stuff, Girls Guess! ─────────────────────────────────────────
const G3Setup = lazy(() => import('./pages/game3/G3Setup'));
const G3Secret = lazy(() => import('./pages/game3/G3Secret'));
const G3QnA = lazy(() => import('./pages/game3/G3QnA'));
const G3Guess = lazy(() => import('./pages/game3/G3Guess'));
const G3Reveal = lazy(() => import('./pages/game3/G3Reveal'));
const G3Results = lazy(() => import('./pages/game3/G3Results'));

// ── Game 4: The Devil's Advocate (2v2) ───────────────────────────────────────
const G4Setup = lazy(() => import('./pages/game4/G4Setup'));
const G4Match = lazy(() => import('./pages/game4/G4Match'));
const G4RoundResult = lazy(() => import('./pages/game4/G4RoundResult'));
const G4Results = lazy(() => import('./pages/game4/G4Results'));

// ── Game 5: Cerdas Cermat Berantai ───────────────────────────────────────────
const G5Setup = lazy(() => import('./pages/game5/G5Setup'));
const G5Play = lazy(() => import('./pages/game5/G5Play'));
const G5Results = lazy(() => import('./pages/game5/G5Results'));

// ── Game 6: Sell Me This Trash! (2v2) ────────────────────────────────────────
const G6Match = lazy(() => import('./pages/game6/G6Match'));
const G6Results = lazy(() => import('./pages/game6/G6Results'));

// ── Lightweight Suspense Loading Screen ──────────────────────────────────────
const RouteLoadingSpinner: React.FC = () => (
  <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center p-6 text-center select-none">
    <div className="w-14 h-14 rounded-full border-4 border-[#1E1E24]/10 border-t-[#D8317E] animate-spin mb-4" />
    <p className="font-display text-base font-bold text-[#1E1E24] tracking-wide">
      Memuat Arena Permainan...
    </p>
    <p className="text-xs text-[#64616C] font-semibold mt-1">
      PartyHub Indonesia • Siapkan senyum terbaikmu!
    </p>
  </div>
);

export default function App() {
  return (
    <>
      <ScrollToTop />
      <CustomGameCursor />
      <Suspense fallback={<RouteLoadingSpinner />}>
        <Routes>
          {/* 1. Onboarding Screen */}
          <Route path="/" element={<Onboarding />} />
          <Route path="/onboarding" element={<Onboarding />} />

          {/* Player Controller Mobile Routes */}
          <Route path="/join" element={<PlayerJoin />} />
          <Route path="/play" element={<PlayerController />} />
          <Route path="/controller" element={<PlayerController />} />

          {/* 2. Room Setup & Podium */}
          <Route path="/room" element={<RoomSetup />} />
          <Route path="/room/podium" element={<RoomPodium />} />

          {/* 3. Game Selection Hub */}
          <Route path="/hub" element={<Home />} />
          <Route path="/games" element={<Home />} />

          {/* Studio Asset Showcase */}
          <Route path="/studio" element={<StudioAssetPack />} />

          {/* Game 1: Same Brain? NO! */}
          <Route path="/game1/setup" element={<G1Setup />} />
          <Route path="/game1/round" element={<G1Round />} />
          <Route path="/game1/reveal" element={<G1Reveal />} />
          <Route path="/game1/results" element={<G1Results />} />

          {/* Game 2: Beauty Expert?! */}
          <Route path="/game2/setup" element={<G2Setup />} />
          <Route path="/game2/secret" element={<G2Secret />} />
          <Route path="/game2/qna" element={<G2QnA />} />
          <Route path="/game2/guess" element={<G2Guess />} />
          <Route path="/game2/reveal" element={<G2Reveal />} />
          <Route path="/game2/results" element={<G2Results />} />

          {/* Game 3: Boys Stuff, Girls Guess! */}
          <Route path="/game3/setup" element={<G3Setup />} />
          <Route path="/game3/secret" element={<G3Secret />} />
          <Route path="/game3/qna" element={<G3QnA />} />
          <Route path="/game3/guess" element={<G3Guess />} />
          <Route path="/game3/reveal" element={<G3Reveal />} />
          <Route path="/game3/results" element={<G3Results />} />

          {/* Game 4: The Devil's Advocate (2v2) */}
          <Route path="/game4/setup" element={<G4Setup />} />
          <Route path="/game4/match" element={<G4Match />} />
          <Route path="/game4/round-result" element={<G4RoundResult />} />
          <Route path="/game4/results" element={<G4Results />} />

          {/* Game 5: Cerdas Cermat Berantai */}
          <Route path="/game5/setup" element={<G5Setup />} />
          <Route path="/game5/play" element={<G5Play />} />
          <Route path="/game5/results" element={<G5Results />} />

          {/* Game 6: Sell Me This Trash! (2v2) */}
          <Route path="/game6/match" element={<G6Match />} />
          <Route path="/game6/results" element={<G6Results />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  );
}
