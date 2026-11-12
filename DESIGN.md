---
version: alpha
name: party-boardgames
description: Design tokens and UI language for casual party games web application
colors:
  bg: "#1E1050"
  bg-deep: "#150C3A"
  card: "#FFF8E7"
  card-border: "#E8C97A"
  gold: "#F5C842"
  gold-dark: "#C49B10"
  game1: "#E84C4C"
  game1-dark: "#B53030"
  game2: "#E84CA0"
  game2-dark: "#B53075"
  game3: "#4CA0E8"
  game3-dark: "#2970B5"
  game4: "#FF5722"
  game4-dark: "#C43000"
  correct: "#4CE87A"
  wrong: "#E84C4C"
  neutral: "#A0A0C0"
typography:
  display:
    fontFamily: Fredoka One
  body:
    fontFamily: Nunito
rounded:
  base: 14px
  card: 20px
  pill: 9999px
---

## Overview
Visual system for casual offline party games designed for shared screen play on mobile and desktop devices. The interface emphasizes tactile cartoon game elements, legible typography, and clear pass-the-device privacy states.

## Colors
- Deep indigo (`#1E1050`) provides high contrast against card elements without using harsh pure black or standard developer tech gradients.
- Warm cream card background (`#FFF8E7`) with golden rim borders (`#E8C97A`) gives game boards a tactile physical token appearance.
- Distinct game identity accents:
  - Game 01 (Same Brain? NO!): Coral Red (`#E84C4C`)
  - Game 02 (Beauty Expert?!): Vibrant Magenta (`#E84CA0`)
  - Game 03 (Boys Stuff, Girls Guess!): Sky Blue (`#4CA0E8`)
  - Game 04 (The Devil's Advocate): Fiery Crimson Orange (`#FF5722`)

## Typography
- Display font: `Fredoka One` for headings, scores, badges, and primary action buttons.
- Body font: `Nunito` for input fields, clues, category descriptions, and secondary metadata.

## Elevation & Depth
- Cards use a solid offset shadow `0 6px 0 rgba(0,0,0,0.35)` to simulate chunky physical game tiles.
- Buttons utilize tactile bottom bevels (`box-shadow: 0 4px 0 [dark-accent]`) and depress 3px on click (`:active`).

