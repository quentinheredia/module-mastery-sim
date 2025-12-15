// src/assets/data/net4001/formulas.ts
// Source: 4001_Exam_Queueing_Formulas.pdf (4 pages)

export type FormulaSource = {
  pdf: string; // e.g., "4001_Exam_Queueing_Formulas.pdf"
  slide: string; // e.g., "1/4"
  section?: string;
};

export type FormulaVar = {
  symbol: string;
  meaning: string;
};

export type FormulaItem = {
  id: string;
  name: string;
  latex: string;
  explanation: string;
  purpose: string[];
  assumptions: string[];
  variables: FormulaVar[];
  exampleTypes: string[];
  dependencies?: string[];
  relatedTopics?: string[];
  source: FormulaSource;
  tags?: string[];
};

export type FormulaSection = {
  id: string;
  group: string; // ✅ NEW: lets you display Queueing → Model → Formulas
  title: string; // e.g., "M/M/1"
  description?: string;
  formulas: FormulaItem[];
};

const PDF = "4001_Exam_Queueing_Formulas.pdf";
const Queue = "Queueing";

export const NET4001_FORMULA_SECTIONS: FormulaSection[] = [
  // =========================
  // Queueing → M/M/1
  // =========================
  {
    id: "mm1",
    group: Queue,
    title: "M/M/1",
    description: "Single server, Poisson arrivals, exponential service.",
    formulas: [
      {
        id: "mm1-pn",
        name: "Steady-state probability",
        latex: String.raw`P[N=n]=P_n=(1-\rho)\rho^n,\quad n=0,1,2,\dots`,
        explanation:
          "Steady-state probability that there are n customers/packets in the system.",
        purpose: ["Compute P0, Pn, tail probabilities"],
        assumptions: [
          "Poisson arrivals (rate λ)",
          "Exponential service (rate μ)",
          "Single server",
          "Stable (ρ<1)",
        ],
        variables: [
          { symbol: "P_n", meaning: "P{N=n} at steady state" },
          { symbol: "N", meaning: "number in system" },
          { symbol: "n", meaning: "state index (0,1,2,...)" },
          { symbol: "ρ", meaning: "traffic intensity (typically ρ=λ/μ)" },
          { symbol: "λ", meaning: "arrival rate" },
          { symbol: "μ", meaning: "service rate" },
        ],
        exampleTypes: ["Find P0, P(N≥k)", "Compute congestion probability"],
        source: {
          pdf: PDF,
          slide: "1/4",
          section: "Probability Formulas — M/M/1",
        },
        tags: ["exam", "core"],
      },
    ],
  },

  // =========================
  // Queueing → M/M/1/K
  // =========================
  {
    id: "mm1k",
    group: Queue,
    title: "M/M/1/K",
    description:
      "Finite capacity K (includes the one in service). Blocking/loss at full state.",
    formulas: [
      {
        id: "mm1k-p0",
        name: "Empty probability",
        latex: String.raw`P_0=\frac{1-\rho}{1-\rho^{K+1}}`,
        explanation: "Empty-system probability for finite-capacity M/M/1/K.",
        purpose: ["Compute P0 quickly", "Base for all Pn via Pn=ρ^n P0"],
        assumptions: [
          "Poisson arrivals",
          "Exponential service",
          "Single server",
          "Finite capacity K (includes service)",
        ],
        variables: [
          { symbol: "P_0", meaning: "probability system is empty" },
          { symbol: "ρ", meaning: "traffic intensity (commonly ρ=λ/μ)" },
          { symbol: "K", meaning: "system capacity (max # in system)" },
        ],
        exampleTypes: ["Router buffer problems: find P0"],
        source: { pdf: PDF, slide: "1/4", section: "M/M/1/k" },
        tags: ["exam", "core"],
      },
      {
        id: "mm1k-pn",
        name: "State probability",
        latex: String.raw`P_n=\rho^nP_0,\quad n=0,1,\dots,K`,
        explanation: "Probability of n in system for M/M/1/K.",
        purpose: ["Compute PK (loss)", "Compute any Pn"],
        assumptions: ["Same as M/M/1/K", "n ∈ {0..K}"],
        variables: [
          { symbol: "P_n", meaning: "probability of n in system" },
          { symbol: "n", meaning: "state index (0..K)" },
          { symbol: "ρ", meaning: "traffic intensity (commonly ρ=λ/μ)" },
          { symbol: "P_0", meaning: "empty probability" },
        ],
        exampleTypes: ["Compute PK (loss), P0, any Pn"],
        dependencies: ["mm1k-p0"],
        source: { pdf: PDF, slide: "1/4", section: "M/M/1/k" },
        tags: ["exam"],
      },
      {
        id: "packet-loss-ratio",
        name: "Packet loss probability (full state) — sheet form",
        latex: String.raw`P_{K=p+1}=\frac{(\lambda/\mu)^{p+1}(1-\lambda/\mu)}{1-(\lambda/\mu)^{p+2}}`,
        explanation:
          "Loss probability shown on the sheet as the probability of the full state using K=p+1 (buffer p plus 1 in service).",
        purpose: [
          "Directly compute loss probability in finite-buffer router questions",
        ],
        assumptions: [
          "M/M/1/K with K=p+1",
          "Interpret ratio as λ/μ as on the sheet",
        ],
        variables: [
          {
            symbol: "p",
            meaning: "buffer size (excluding the one in service)",
          },
          { symbol: "K", meaning: "system capacity; on sheet K=p+1" },
          { symbol: "λ", meaning: "arrival rate" },
          { symbol: "μ", meaning: "service rate" },
        ],
        exampleTypes: ["Fraction lost", "Probability system is full"],
        dependencies: ["mm1k-p0", "mm1k-pn"],
        source: { pdf: PDF, slide: "4/4", section: "Packet Loss Ratio" },
        tags: ["exam", "core"],
      },
    ],
  },

  // =========================
  // Queueing → M/M/k (infinite buffer)
  // =========================
  {
    id: "mmk",
    group: Queue,
    title: "M/M/k",
    description: "k servers, FCFS, unlimited queue capacity.",
    formulas: [
      {
        id: "mmk-balance",
        name: "Balance equations (birth–death style)",
        latex: String.raw`
\mathrm{State}\; j:\quad
\begin{cases}
\lambda P_0 = \mu P_1 & (j=0)\\
(\lambda + j\mu)P_j = \lambda P_{j-1} + (j+1)\mu P_{j+1} & (0<j<k)\\
(\lambda + k\mu)P_k = \lambda P_{k-1} + k\mu P_{k+1} & (j=k)\\
(\lambda + k\mu)P_n = \lambda P_{n-1} + k\mu P_{n+1} & (n>k)
\end{cases}
        `.trim(),
        explanation:
          "State balance equations capturing the piecewise service completion rate.",
        purpose: [
          "Set up state probabilities",
          "Derive recursion + normalization",
        ],
        assumptions: [
          "Poisson arrivals (λ)",
          "Exponential service (μ per server)",
          "k identical servers",
        ],
        variables: [
          {
            symbol: "P_j",
            meaning: "steady-state probability of being in state j",
          },
          { symbol: "λ", meaning: "arrival rate" },
          { symbol: "μ", meaning: "service rate per server" },
          { symbol: "k", meaning: "number of servers" },
          { symbol: "j,n", meaning: "state index (# in system)" },
        ],
        exampleTypes: [
          "Write balance equations",
          "Solve for probabilities using recursion",
        ],
        source: {
          pdf: PDF,
          slide: "1/4",
          section: "Probability Formulas — M/M/k (table)",
        },
        tags: ["exam", "markov"],
      },
      {
        id: "mmk-pn",
        name: "Steady-state Pn (piecewise)",
        latex: String.raw`
P_n=
\begin{cases}
\dfrac{\rho^n}{n!}P_0, & 0\le n\le k\\[6pt]
\dfrac{\rho^n}{k^{\,n-k}k!}P_0, & n>k
\end{cases}
        `.trim(),
        explanation: "Piecewise formula for Pn in M/M/k in terms of P0.",
        purpose: ["Compute Pn once P0 is known"],
        assumptions: [
          "M/M/k assumptions",
          "P0 found by normalization (sum Pn = 1)",
        ],
        variables: [
          { symbol: "P_n", meaning: "P{N=n} at steady state" },
          {
            symbol: "P_0",
            meaning: "empty-system probability (normalization constant)",
          },
          { symbol: "k", meaning: "number of servers" },
          { symbol: "n", meaning: "number in system" },
          { symbol: "ρ", meaning: "load term as used on the sheet" },
        ],
        exampleTypes: ["Compute probabilities for n≤k and n>k"],
        dependencies: ["mmk-balance"],
        source: {
          pdf: PDF,
          slide: "1/4",
          section: "Probability Formulas — M/M/k (Pn)",
        },
        tags: ["exam", "core"],
      },
      {
        id: "mm-infty-poisson",
        name: "Limit k → ∞ (sheet form)",
        latex: String.raw`P_0=e^{-\lambda/\mu},\qquad P_n=\frac{\rho^n}{n!}e^{-\lambda/\mu}`,
        explanation:
          "As shown on the sheet for the k→∞ case (Poisson-like form with mean λ/μ).",
        purpose: [
          "Quick probability calculations in the infinite-server limit",
        ],
        assumptions: [
          "Interpreted as the k→∞ limiting form shown on the sheet",
        ],
        variables: [
          { symbol: "P_0", meaning: "probability of zero in system" },
          { symbol: "P_n", meaning: "probability of n in system" },
          {
            symbol: "λ/μ",
            meaning: "mean parameter used in the sheet exponent",
          },
          { symbol: "ρ", meaning: "used on sheet inside ρ^n/n!" },
        ],
        exampleTypes: ["Compute P0, Pn in the k→∞ limit"],
        source: { pdf: PDF, slide: "1/4", section: "When k → ∞" },
        tags: ["exam"],
      },
    ],
  },

  // =========================
  // Queueing → M/M/k/k (Erlang Loss)
  // =========================
  {
    id: "mmkk",
    group: Queue,
    title: "M/M/k/k (Erlang Loss)",
    description:
      "k servers, no waiting room. Arrivals blocked if all servers busy.",
    formulas: [
      {
        id: "mmkk-p0",
        name: "Empty probability",
        latex: String.raw`P_0=\left(\sum_{n=0}^{k}\frac{\rho^n}{n!}\right)^{-1}`,
        explanation: "Normalization constant for M/M/k/k (loss system).",
        purpose: ["Compute all pn and blocking probability"],
        assumptions: [
          "Poisson arrivals",
          "Exponential service",
          "No queue (capacity=k)",
        ],
        variables: [
          { symbol: "P_0", meaning: "probability of zero busy servers" },
          { symbol: "k", meaning: "number of servers (also capacity)" },
          { symbol: "ρ", meaning: "offered load term used on the sheet" },
        ],
        exampleTypes: ["Compute Erlang B blocking given k and load"],
        source: { pdf: PDF, slide: "2/4", section: "M/M/k/k" },
        tags: ["exam", "erlang"],
      },
      {
        id: "mmkk-pn",
        name: "State probability",
        latex: String.raw`p_n=P_0\frac{\rho^n}{n!},\quad n=1,2,\dots,k`,
        explanation: "Probability of n busy servers in the loss system.",
        purpose: ["Compute pk (blocking) or occupancy probabilities"],
        assumptions: ["Same as M/M/k/k"],
        variables: [
          { symbol: "p_n", meaning: "probability of n busy servers" },
          { symbol: "P_0", meaning: "empty probability" },
          { symbol: "ρ", meaning: "offered load term used on the sheet" },
          { symbol: "n", meaning: "busy servers (1..k)" },
        ],
        exampleTypes: ["Compute probability all servers busy"],
        dependencies: ["mmkk-p0"],
        source: { pdf: PDF, slide: "2/4", section: "M/M/k/k" },
        tags: ["exam", "erlang"],
      },
      {
        id: "erlang-b",
        name: "Erlang B (blocking probability)",
        latex: String.raw`B=P_k=\frac{(\lambda/\mu)^k/k!}{\sum_{n=0}^{k}(\lambda/\mu)^n/n!}`,
        explanation:
          "Blocking probability in an Erlang loss system (no queue).",
        purpose: [
          "Compute blocking probability from offered load and # of channels",
        ],
        assumptions: ["M/M/k/k (no queue)", "Offered load A=λ/μ in Erlangs"],
        variables: [
          { symbol: "B", meaning: "blocking probability (all k busy)" },
          { symbol: "k", meaning: "number of channels/servers" },
          { symbol: "λ", meaning: "arrival rate" },
          { symbol: "μ", meaning: "service rate" },
        ],
        exampleTypes: ["Dimensioning channels so blocking ≤ target"],
        dependencies: ["mmkk-p0"],
        source: { pdf: PDF, slide: "2/4", section: "M/M/k/k — Pk=B" },
        tags: ["exam", "core"],
      },
      {
        id: "erlang-b-alt",
        name: "Erlang B (alternate notation)",
        latex: String.raw`B=\frac{A^c/c!}{\sum_{n=0}^{c}A^n/n!},\quad A=\lambda/\mu`,
        explanation:
          "Same Erlang B formula using A (Erlangs) and c (channels).",
        purpose: ["Recognize equivalent notation in problems"],
        assumptions: ["Same as Erlang B"],
        variables: [
          { symbol: "A", meaning: "offered traffic in Erlangs (λ/μ)" },
          { symbol: "c", meaning: "number of channels/servers" },
        ],
        exampleTypes: ["Convert between (k) and (c), (A) and (λ/μ)"],
        dependencies: ["erlang-b"],
        source: { pdf: PDF, slide: "3/4", section: "Blocking" },
        tags: ["exam"],
      },
    ],
  },

  // =========================
  // Queueing → Helpers (waiting/util/delay)
  // =========================
  {
    id: "helpers",
    group: Queue,
    title: "Helpers (waiting / utilization / delay)",
    description:
      "Erlang C, utilization, mean service time, and the sheet’s delay-style computation.",
    formulas: [
      {
        id: "erlang-c-wait",
        name: "Erlang C (probability of waiting) — sheet form",
        latex: String.raw`P_B=\frac{k\rho^k P_0}{k!(k-\rho)}\;(=C)`,
        explanation:
          "Probability an arrival must wait in M/M/k (Erlang C), as written on the sheet.",
        purpose: ["Compute probability of waiting once P0 is known"],
        assumptions: [
          "M/M/k with infinite buffer",
          "Stable",
          "Uses sheet’s ρ notation",
        ],
        variables: [
          {
            symbol: "P_B",
            meaning: "probability an arrival waits (all servers busy)",
          },
          {
            symbol: "P_0",
            meaning: "empty probability / normalization constant",
          },
          { symbol: "k", meaning: "number of servers" },
          { symbol: "ρ", meaning: "load term used on the sheet" },
        ],
        exampleTypes: [
          "Probability all servers busy",
          "Waiting probability in M/M/k",
        ],
        dependencies: ["mmk-pn"],
        source: {
          pdf: PDF,
          slide: "3/4",
          section: "Waiting / Little’s Theorem",
        },
        tags: ["exam", "core"],
      },
      {
        id: "server-util",
        name: "Per-server utilization — sheet form",
        latex: String.raw`u=\rho/k=\lambda/(k\mu)`,
        explanation: "Per-server utilization for a k-server system.",
        purpose: [
          "Quick feasibility check",
          "Interpret how busy each server is",
        ],
        assumptions: ["k identical servers"],
        variables: [
          { symbol: "u", meaning: "per-server utilization" },
          { symbol: "λ", meaning: "arrival rate" },
          { symbol: "μ", meaning: "service rate per server" },
          { symbol: "k", meaning: "number of servers" },
          { symbol: "ρ", meaning: "sheet’s load term" },
        ],
        exampleTypes: ["Compute utilization from λ, μ, k"],
        source: { pdf: PDF, slide: "4/4", section: "Server utilization" },
        tags: ["exam", "core"],
      },
      {
        id: "mean-service-time",
        name: "Mean service time",
        latex: String.raw`E[S]=\frac{1}{\mu}`,
        explanation:
          "Average service time for exponential service with rate μ.",
        purpose: ["Convert mean service time ↔ service rate μ"],
        assumptions: ["Exponential service time distribution"],
        variables: [
          { symbol: "E[S]", meaning: "mean service time" },
          { symbol: "μ", meaning: "service rate (1/time)" },
        ],
        exampleTypes: ["Given avg service time, compute μ"],
        source: { pdf: PDF, slide: "4/4", section: "Service Time" },
        tags: ["exam", "core"],
      },
      {
        id: "serialization-delay",
        name: "Delay (sheet-style serialization computation)",
        latex: String.raw`\mathrm{Delay}=\frac{(\mathrm{bytes})\cdot 8\cdot (\mathrm{factor})}{\mathrm{link\ rate\ (bps)}}`,
        explanation:
          "Sheet-style delay computation: convert bytes to bits, multiply by any given factor, divide by link rate.",
        purpose: ["Compute serialization/transmission delay style quantities"],
        assumptions: [
          "Factor is given by the problem (e.g., 0.30 in the sheet example)",
        ],
        variables: [
          { symbol: "bytes", meaning: "packet size in bytes" },
          { symbol: "factor", meaning: "given multiplier" },
          { symbol: "link rate", meaning: "bits per second (bps)" },
        ],
        exampleTypes: ["Convert packet size + link rate into delay"],
        source: { pdf: PDF, slide: "3/4", section: "Delay" },
        tags: ["exam"],
      },
    ],
  },

  // =========================
  // Queueing → Erlang units
  // =========================
  {
    id: "erlang-units",
    group: Queue,
    title: "Erlang units / definitions",
    description: "Teletraffic definitions and unit conversions from the sheet.",
    formulas: [
      {
        id: "erlang-def",
        name: "Erlang (traffic) definition",
        latex: String.raw`\mathrm{Traffic\ (Erlang)}=\mathrm{average\ number\ of\ busy\ channels\ during\ 1\ hour}`,
        explanation: "Interpretation statement from the sheet.",
        purpose: ["Explain what A Erlangs means conceptually"],
        assumptions: ["Teletraffic context (busy channels/calls)"],
        variables: [{ symbol: "A", meaning: "offered traffic in Erlangs" }],
        exampleTypes: ["Conceptual interpretation"],
        source: { pdf: PDF, slide: "3/4", section: "Erlang definition" },
        tags: ["conceptual"],
      },
      {
        id: "erlang-conversions",
        name: "Erlang unit conversions",
        latex: String.raw`1\,\mathrm{Erlang}=60\,\mathrm{CM}=3600\,\mathrm{CS}=36\,\mathrm{CCS}`,
        explanation: "Unit conversions shown on the sheet.",
        purpose: ["Convert between Erlang representations if asked"],
        assumptions: ["Teletraffic unit conventions"],
        variables: [],
        exampleTypes: ["Unit conversion problems"],
        source: { pdf: PDF, slide: "3/4", section: "Erlang units" },
        tags: ["reference"],
      },
    ],
  },
];

// Minimal “Survival Kit” = IDs featured in the Survival tab
export const NET4001_SURVIVAL_KIT_IDS: string[] = [
  "mm1-pn",
  "mm1k-p0",
  "mm1k-pn",
  "packet-loss-ratio",
  "erlang-b",
  "erlang-c-wait",
  "server-util",
  "mean-service-time",
  "mmk-pn",
];

// Consistency audit items rendered in UI
export const NET4001_AUDIT_FINDINGS: Array<{
  severity: "info" | "warn" | "high";
  title: string;
  detail: string;
  suggestion: string;
}> = [
  {
    severity: "warn",
    title: "Sheet uses ρ in multiple contexts",
    detail:
      "On the exam sheet, ρ appears in several places where many textbooks would use A=λ/μ (offered load) and reserve ρ=λ/(kμ) for utilization.",
    suggestion:
      "In solutions, compute both A=λ/μ and u=λ/(kμ), then plug into formulas exactly as the sheet writes them.",
  },
  {
    severity: "info",
    title: "KaTeX rendering tip",
    detail:
      "If a formula ever fails to render, remove \\text{...} and use \\mathrm{...} or move the sentence into explanation text.",
    suggestion:
      "Render formulas with <Math latex={f.latex} block /> instead of showing raw LaTeX.",
  },
];
