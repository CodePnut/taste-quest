# 05 · User Flows — TasteQuest
Grounded in the MCP. Use as E2E test guides and onboarding references.

## A. Explore → Detail → Save
1. User opens **Explore** (default ≤500 kcal filter).
2. Adjust filters (diet/health/time); results update.
3. Click a card → **Recipe Detail**.
4. Tap **Save** → toast “Saved” + subtle background pulse.

## B. Pantry → Quest → Cook → Complete
1. Open **Quest Builder**.
2. Add pantry items; set preferences (diet, allergies, time, calories).
3. **Generate Quest** (LLM) → preview XP/difficulty.
4. Start **Cook Mode** → stepper + timers, tips.
5. Finish → optional photo upload → award XP → streak update.

## C. Onboarding (first session)
- Coach marks the healthy filter (≤500 kcal) and explains chips/badges.
- Show Background toggle and reduced motion note.

## D. Error & Empty Paths
- Empty results: show hints to relax calories/time or remove health filters.
- Edamam timeout: toast + retry; if cached results exist, show them.

## E. Auth & Save
- Start Quest or Save prompts sign‑in (Google/email). ReturnTo applied after login.

## ASCII diagrams
```
[Explore] --card--> [Recipe Detail] --save--> [Toast + Pulse]
[Quest Builder] --LLM--> [Quest JSON] --start--> [Cook Mode]
[Cook Mode] --complete--> [XP/Streak + Share]
```
