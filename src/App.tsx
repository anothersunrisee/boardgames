import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import RoomSetup from './pages/RoomSetup'
import RoomPodium from './pages/RoomPodium'
import G1Setup from './pages/game1/G1Setup'
import G1Round from './pages/game1/G1Round'
import G1Reveal from './pages/game1/G1Reveal'
import G1Results from './pages/game1/G1Results'
import G2Setup from './pages/game2/G2Setup'
import G2Secret from './pages/game2/G2Secret'
import G2QnA from './pages/game2/G2QnA'
import G2Guess from './pages/game2/G2Guess'
import G2Reveal from './pages/game2/G2Reveal'
import G2Results from './pages/game2/G2Results'
import G3Setup from './pages/game3/G3Setup'
import G3Secret from './pages/game3/G3Secret'
import G3QnA from './pages/game3/G3QnA'
import G3Guess from './pages/game3/G3Guess'
import G3Reveal from './pages/game3/G3Reveal'
import G3Results from './pages/game3/G3Results'
import G4Setup from './pages/game4/G4Setup'
import G4Match from './pages/game4/G4Match'
import G4RoundResult from './pages/game4/G4RoundResult'
import G4Results from './pages/game4/G4Results'
import G5Play from './pages/game5/G5Play'
import G5Results from './pages/game5/G5Results'
import G6Match from './pages/game6/G6Match'
import G6Results from './pages/game6/G6Results'
import StudioAssetPack from './pages/StudioAssetPack'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/studio" element={<StudioAssetPack />} />
      <Route path="/room" element={<RoomSetup />} />
      <Route path="/room/podium" element={<RoomPodium />} />

      {/* Game 1 */}
      <Route path="/game1/setup"   element={<G1Setup />} />
      <Route path="/game1/round"   element={<G1Round />} />
      <Route path="/game1/reveal"  element={<G1Reveal />} />
      <Route path="/game1/results" element={<G1Results />} />

      {/* Game 2 */}
      <Route path="/game2/setup"   element={<G2Setup />} />
      <Route path="/game2/secret"  element={<G2Secret />} />
      <Route path="/game2/qna"     element={<G2QnA />} />
      <Route path="/game2/guess"   element={<G2Guess />} />
      <Route path="/game2/reveal"  element={<G2Reveal />} />
      <Route path="/game2/results" element={<G2Results />} />

      {/* Game 3 */}
      <Route path="/game3/setup"   element={<G3Setup />} />
      <Route path="/game3/secret"  element={<G3Secret />} />
      <Route path="/game3/qna"     element={<G3QnA />} />
      <Route path="/game3/guess"   element={<G3Guess />} />
      <Route path="/game3/reveal"  element={<G3Reveal />} />
      <Route path="/game3/results" element={<G3Results />} />

      {/* Game 4 */}
      <Route path="/game4/setup"        element={<G4Setup />} />
      <Route path="/game4/match"        element={<G4Match />} />
      <Route path="/game4/round-result" element={<G4RoundResult />} />
      <Route path="/game4/results"      element={<G4Results />} />

      {/* Game 5: Cerdas Cermat Berantai */}
      <Route path="/game5/play"    element={<G5Play />} />
      <Route path="/game5/results" element={<G5Results />} />

      {/* Game 6: Sell Me This Trash! */}
      <Route path="/game6/match"   element={<G6Match />} />
      <Route path="/game6/results" element={<G6Results />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
