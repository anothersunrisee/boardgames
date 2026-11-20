import type { GameRuleConfig } from './types';

// ============================================================================
// GAME SCORING RULES CONFIGURATION (DIFFICULTY-BASED + / - POINTS)
// ============================================================================
export const GAME_RULES: GameRuleConfig[] = [
  {
    id: 'same-brain',
    name: 'Same Brain? NO!',
    mode: 'Individu',
    difficulty: 'Medium',
    color: '#158467',
    summary: 'Jawaban unik sendirian dapat +15, streak unik +10, jawaban kembar kena -5.',
    actions: [
      { id: 'sb-unique', label: 'Unik (+15)', points: 15, target: 'player', variant: 'emerald' },
      { id: 'sb-streak', label: 'Bonus Streak (+10)', points: 10, target: 'player', variant: 'sunny' },
      { id: 'sb-dup', label: 'Kembar / Salah (-5)', points: -5, target: 'player', variant: 'danger' },
    ],
  },
  {
    id: 'beauty-expert',
    name: 'Beauty Expert?!',
    mode: 'Kelompok/Tim',
    difficulty: 'Hard',
    color: '#C82373',
    summary: 'Menang tim +30 poin kelompok & +20 poin individu per anggota. Salah tebak -10.',
    actions: [
      { id: 'be-teamwin', label: 'Menang Tim (+30 Tim / +20 Orang)', points: 30, teamBonusPerMember: 20, target: 'team', variant: 'berry' },
      { id: 'be-guess', label: 'Tebak Benar (+20)', points: 20, target: 'player', variant: 'emerald' },
      { id: 'be-wrong', label: 'Salah Tebak (-10)', points: -10, target: 'player', variant: 'danger' },
    ],
  },
  {
    id: 'boys-stuff',
    name: 'Boys Stuff, Girls Guess!',
    mode: 'Kelompok/Tim',
    difficulty: 'Hard',
    color: '#2568EF',
    summary: 'Menang tim +30 poin kelompok & +20 poin individu per anggota. Salah tebak -10.',
    actions: [
      { id: 'bs-teamwin', label: 'Menang Tim (+30 Tim / +20 Orang)', points: 30, teamBonusPerMember: 20, target: 'team', variant: 'cobalt' },
      { id: 'bs-guess', label: 'Tebak Benar (+20)', points: 20, target: 'player', variant: 'emerald' },
      { id: 'bs-wrong', label: 'Salah Tebak (-10)', points: -10, target: 'player', variant: 'danger' },
    ],
  },
  {
    id: 'devils-advocate',
    name: "The Devil's Advocate",
    mode: 'Individu 1v1',
    difficulty: 'Chaos',
    color: '#EC5A29',
    summary: 'Debat absurd 1v1! Menang debat +40, Best Performance +15, kalah debat -10.',
    actions: [
      { id: 'da-win', label: 'Menang Debat (+40)', points: 40, target: 'player', variant: 'tangerine' },
      { id: 'da-best', label: 'Best Perf (+15)', points: 15, target: 'player', variant: 'sunny' },
      { id: 'da-lose', label: 'Kalah Debat (-10)', points: -10, target: 'player', variant: 'danger' },
    ],
  },
  {
    id: 'uny-geozoom',
    name: 'UNY GeoZoom!',
    mode: 'Individu / Tim',
    difficulty: 'Easy-Hard',
    color: '#8C6D46',
    summary: 'Extreme Zoom 5.5x (+35), Medium Zoom (+20), Menang Tim (+25/+15), Salah (-5).',
    actions: [
      { id: 'gz-extreme', label: 'Extreme Zoom (+35)', points: 35, target: 'player', variant: 'sunny' },
      { id: 'gz-med', label: 'Medium Zoom (+20)', points: 20, target: 'player', variant: 'emerald' },
      { id: 'gz-team', label: 'Bonus Kubu (+25 Tim / +15 Orang)', points: 25, teamBonusPerMember: 15, target: 'team', variant: 'cobalt' },
      { id: 'gz-wrong', label: 'Salah Lokasi (-5)', points: -5, target: 'player', variant: 'danger' },
    ],
  },
];
