

## Add Scenarios Tab for NET4011

### Overview
Add a "Scenarios" tab alongside Practice/Exam modes on the NET4011 home page. Scenarios are study-oriented case questions with structured data, rendered as expandable cards with markdown support. The data lives in a single local file, making it easy to add more scenarios later.

### Changes

**1. Create scenario data file: `src/assets/data/net4011/scenarios.ts`**

Define a `Scenario` type and export an array of scenarios. Each scenario has:
- `id` (string)
- `title` (string, e.g. "Scenario 1: The Coffee Shop")
- `subtitle` (string, e.g. "Layers of Security & Threats")
- `caseDescription` (string -- the "The Case" section)
- `questions` (string[] -- the numbered questions)
- `keyConcepts` (array of `{ title: string; content: string }` -- the bullet points under "Key Textbook Concepts")

Initial data: the 3 scenarios you provided.

**2. Create scenario display component: `src/components/scenarios/ScenarioCard.tsx`**

A glass-morphism card (matching the existing design) for each scenario:
- Collapsible/accordion style -- title visible, click to expand
- Shows the case description, questions, and key concepts with markdown rendering
- Uses the existing `Accordion` component from `@radix-ui/react-accordion`

**3. Create scenarios list component: `src/components/scenarios/ScenariosList.tsx`**

Loads scenarios from the data file and renders a list of `ScenarioCard` components.

**4. Update `src/pages/Home.tsx` for NET4011**

Currently NET4011 falls into the generic `else` branch (line 384). Add a dedicated `if (activeCourse?.id === "net4011")` block that uses `Tabs` (already available) with three tabs:
- **Practice** -- the existing Practice/Exam mode cards
- **Midterm** -- the Exam mode card
- **Scenarios** -- renders `ScenariosList`

This keeps the existing functionality intact while adding the new tab.

### Technical Details

| Aspect | Detail |
|--------|--------|
| New files | `src/assets/data/net4011/scenarios.ts`, `src/components/scenarios/ScenarioCard.tsx`, `src/components/scenarios/ScenariosList.tsx` |
| Modified files | `src/pages/Home.tsx` |
| Dependencies | None new -- uses existing `Tabs`, `Accordion`, `Card` components |
| Data format | TypeScript file with typed array, easy to extend |

