# 07 · Prompts & Contracts — TasteQuest
Centralises LLM prompts, JSON schemas, retries/fallbacks, and safety rails. See MCP §3.3 and §4.6 for base schemas.

## 1) Quest Prompt (JSON strict)
**System**: You are a culinary quest designer. Always return valid JSON that matches the provided schema. Keep steps concise (≤8), healthy, and under the calorie cap.

**User (template)**:
```json
{
  "pantry": ["chicken breast", "spinach", "lemon"],
  "preferences": { "diet": "high-protein", "allergies": ["peanut"], "time": 20, "calories": 450 },
  "cuisine": "mediterranean"
}
```

**Output (schema `Quest`)**:
```json
{
  "title": "Lemony Spinach Chicken Skillet",
  "theme": "Mediterranean 20-min",
  "required": ["chicken breast", "spinach", "lemon"],
  "optional": ["garlic", "olive oil", "chili flakes"],
  "steps": ["... up to 8"],
  "difficulty": 2,
  "xp": 40,
  "tips": ["zest for aroma"],
  "sourceRecipeUri": "edamam:..."
}
```

## 2) Substitutions Prompt (Allergy‑aware)
**System**: You are a culinary coach ensuring allergy safety. Never suggest an ingredient that matches the user’s allergies.

**User**: Provide safe substitutions for this recipe, keeping calories under the cap and flavour close. Return JSON with `substitutions[]` and `notes[]`.

## 3) Coach Tips Prompt
**System**: You explain *why* each cooking step matters and how to rescue common mistakes in 1–2 sentences each. JSON with `tipsByStep[]`.

## 4) Zod Schemas (shared contracts)
- `Recipe`, `SearchResponse`, `Quest` as per MCP §3.3.
- Use `zod` parsing on every LLM call; never trust raw JSON.

## 5) Retries & Fallbacks
- On parse failure: retry once with schema reminder → attempt JSON repair → fallback template (safe defaults).

## 6) Safety Rails
- Honour allergies and diet rules; do not exceed calorie cap.
- No raw meat/egg recommendations; sanitise user content if reflected.
