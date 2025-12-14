// src/data/net4001/formulas.ts

export type FormulaSource = {
  pdf: string; // e.g., "Queueing models - 2025.pdf"
  slide: string; // e.g., "12/69"
  section?: string; // e.g., "Little's theorem"
};

export type FormulaVar = {
  symbol: string; // e.g., "λ"
  meaning: string; // e.g., "arrival rate (jobs/time)"
};

export type FormulaItem = {
  id: string;
  name: string;
  latex: string; // LaTeX string (render as text unless you later add KaTeX/MathJax)
  explanation: string;
  purpose: string[];
  assumptions: string[];
  variables: FormulaVar[];
  exampleTypes: string[];
  dependencies?: string[]; // other formula IDs
  relatedTopics?: string[];
  source: FormulaSource;
  tags?: string[];
};

export type FormulaSection = {
  id: string;
  title: string;
  description?: string;
  formulas: FormulaItem[];
};

export const NET4001_FORMULA_SECTIONS: FormulaSection[] = [
  {
    id: "queueing",
    title: "Queueing Models",
    description:
      "Core relationships + M/M/1 essentials used everywhere in NET simulations.",
    formulas: [
      {
        id: "little-law",
        name: "Little’s Law (Little’s Theorem)",
        latex: String.raw`L = \lambda W`,
        explanation:
          "Average number in system equals arrival rate times average time in system.",
        purpose: [
          "Convert between average queue length and average delay",
          "Sanity-check results (simulation vs theory)",
        ],
        assumptions: [
          "System is stable (long-run averages exist)",
          "Consistent units: λ in jobs/time, W in time/job",
        ],
        variables: [
          {
            symbol: "L",
            meaning: "mean number in system (in service + in queue)",
          },
          { symbol: "λ", meaning: "arrival rate into the system (jobs/time)" },
          { symbol: "W", meaning: "mean time in system (time/job)" },
        ],
        exampleTypes: ["Given L and λ, compute W", "Given W and λ, compute L"],
        relatedTopics: ["utilization", "throughput", "Wq/Lq versions"],
        source: {
          pdf: "Queueing models - 2025.pdf",
          slide: "12/69",
          section: "Little's theorem",
        },
        tags: ["core", "exam"],
      },
      {
        id: "little-law-queue",
        name: "Little’s Law (Queue-only form)",
        latex: String.raw`L_q = \lambda W_q`,
        explanation:
          "Same idea as Little’s Law, but only for the waiting line (excluding service).",
        purpose: [
          "Find average queue length from average waiting time (or vice versa)",
        ],
        assumptions: [
          "Stable system",
          "Wq is waiting time only (not including service time)",
        ],
        variables: [
          { symbol: "Lq", meaning: "mean number waiting in queue" },
          { symbol: "λ", meaning: "arrival rate (jobs/time)" },
          { symbol: "Wq", meaning: "mean waiting time in queue (time/job)" },
        ],
        exampleTypes: ["Compute Lq from λ and Wq", "Compute Wq from Lq and λ"],
        dependencies: ["little-law"],
        source: {
          pdf: "Queueing models - 2025.pdf",
          slide: "12/69",
          section: "Little's theorem",
        },
        tags: ["core"],
      },
      {
        id: "system-time-sum",
        name: "Time in System Decomposition",
        latex: String.raw`W = W_q + \frac{1}{\mu}`,
        explanation:
          "Total response time equals waiting time plus mean service time (for exponential service).",
        purpose: ["Move between W and Wq when μ is known"],
        assumptions: [
          "Service times are exponential with rate μ (mean service time = 1/μ)",
        ],
        variables: [
          { symbol: "W", meaning: "mean time in system" },
          { symbol: "Wq", meaning: "mean time waiting in queue" },
          { symbol: "μ", meaning: "service rate (jobs/time)" },
        ],
        exampleTypes: ["Compute Wq from W and μ", "Compute W from Wq and μ"],
        dependencies: ["little-law"],
        source: {
          pdf: "Queueing models - 2025.pdf",
          slide: "12/69",
          section: "Little's theorem",
        },
        tags: ["core", "exam"],
      },
      {
        id: "mm1-pn",
        name: "M/M/1 Steady-State Probability",
        latex: String.raw`P_n = (1-\rho)\rho^n,\quad n=0,1,2,\dots`,
        explanation:
          "Probability that there are n customers in the system at steady state.",
        purpose: [
          "Compute probabilities like P(N≥k), P0, etc.",
          "Reason about long-run congestion",
        ],
        assumptions: [
          "Poisson arrivals (rate λ)",
          "Exponential service (rate μ)",
          "Single server, FCFS",
          "Stability: ρ < 1",
        ],
        variables: [
          { symbol: "Pn", meaning: "P{N = n} in steady state" },
          { symbol: "ρ", meaning: "utilization (typically λ/μ for M/M/1)" },
          { symbol: "n", meaning: "number in system" },
        ],
        exampleTypes: ["Compute P0 or P(N≥k) for thresholds"],
        relatedTopics: ["utilization", "stability"],
        source: {
          pdf: "Queueing models - 2025.pdf",
          slide: "11/69",
          section: "Steady state probabilities",
        },
        tags: ["mm1", "exam"],
      },
      {
        id: "mm1-rho",
        name: "Utilization (M/M/1)",
        latex: String.raw`\rho = \frac{\lambda}{\mu}`,
        explanation: "Fraction of time the single server is busy (long-run).",
        purpose: ["Stability check", "Quick congestion intuition"],
        assumptions: ["M/M/1 assumptions", "ρ < 1 for steady state"],
        variables: [
          { symbol: "ρ", meaning: "utilization" },
          { symbol: "λ", meaning: "arrival rate" },
          { symbol: "μ", meaning: "service rate" },
        ],
        exampleTypes: ["Check if system is stable (ρ < 1)"],
        dependencies: ["mm1-pn"],
        source: {
          pdf: "Queueing models - 2025.pdf",
          slide: "11/69",
          section: "Steady state probabilities",
        },
        tags: ["core", "mm1"],
      },
      {
        id: "mmk-rho",
        name: "Utilization (M/M/k)",
        latex: String.raw`\rho = \frac{\lambda}{k\mu}`,
        explanation: "Traffic intensity per system with k identical servers.",
        purpose: ["Stability/feasibility check for multi-server systems"],
        assumptions: [
          "Poisson arrivals",
          "Exponential service",
          "k identical servers",
        ],
        variables: [
          { symbol: "ρ", meaning: "system utilization" },
          { symbol: "λ", meaning: "arrival rate" },
          { symbol: "k", meaning: "number of servers" },
          { symbol: "μ", meaning: "service rate per server" },
        ],
        exampleTypes: ["Given λ, μ, choose k so ρ is acceptable"],
        source: {
          pdf: "Queueing models - 2025.pdf",
          slide: "13/69",
          section: "M/M/k setup",
        },
        tags: ["mmk"],
      },
      // --- ADD THESE inside the "queueing" section formulas: [ ... ]

      {
        id: "mm1-L",
        name: "M/M/1 Mean Number in System",
        latex: String.raw`L=\frac{\rho}{1-\rho}`,
        explanation:
          "Average number of customers in the system (queue + service) for M/M/1.",
        purpose: [
          "Compute congestion level",
          "Convert to delay via Little’s Law",
        ],
        assumptions: [
          "M/M/1 (Poisson arrivals λ, exponential service μ, 1 server)",
          "Steady state",
          "Stability: ρ < 1",
        ],
        variables: [
          { symbol: "L", meaning: "mean number in system" },
          { symbol: "ρ", meaning: "utilization (ρ=λ/μ)" },
        ],
        exampleTypes: ["Find average number of packets/jobs in system"],
        dependencies: ["mm1-rho"],
        source: {
          pdf: "Queueing models - 2025.pdf",
          slide: "31/69 (deck slide 26)",
          section: "M/M/1 – Equations",
        },
        tags: ["mm1", "core", "exam"],
      },
      {
        id: "mm1-W",
        name: "M/M/1 Mean Time in System",
        latex: String.raw`W=\frac{L}{\lambda}=\frac{1}{\mu-\lambda}`,
        explanation: "Average response time in system for M/M/1.",
        purpose: ["Compute end-to-end delay (queueing + service)"],
        assumptions: ["M/M/1 assumptions", "Steady state", "λ < μ"],
        variables: [
          { symbol: "W", meaning: "mean time in system" },
          { symbol: "L", meaning: "mean number in system" },
          { symbol: "λ", meaning: "arrival rate" },
          { symbol: "μ", meaning: "service rate" },
        ],
        exampleTypes: ["Compute mean delay given λ and μ"],
        dependencies: ["mm1-L", "little-law"],
        source: {
          pdf: "Queueing models - 2025.pdf",
          slide: "31/69 (deck slide 26)",
          section: "M/M/1 – Equations",
        },
        tags: ["mm1", "core", "exam"],
      },
      {
        id: "mm1-Wq",
        name: "M/M/1 Mean Waiting Time in Queue",
        latex: String.raw`W_q=\frac{1}{\mu-\lambda}-\frac{1}{\mu}=\frac{\rho}{\mu-\lambda}`,
        explanation: "Average waiting time before service begins in M/M/1.",
        purpose: ["Separate queueing delay from service time"],
        assumptions: ["M/M/1 assumptions", "Steady state", "λ < μ"],
        variables: [
          { symbol: "Wq", meaning: "mean waiting time in queue" },
          { symbol: "λ", meaning: "arrival rate" },
          { symbol: "μ", meaning: "service rate" },
          { symbol: "ρ", meaning: "utilization (λ/μ)" },
        ],
        exampleTypes: ["Compute waiting time in queue for packets/jobs"],
        dependencies: ["mm1-W", "mm1-rho"],
        source: {
          pdf: "Queueing models - 2025.pdf",
          slide: "31/69 (deck slide 26)",
          section: "M/M/1 – Equations",
        },
        tags: ["mm1", "core", "exam"],
      },
      {
        id: "mm1-Lq",
        name: "M/M/1 Mean Number in Queue",
        latex: String.raw`L_q=\lambda W_q=\frac{\rho^2}{1-\rho}`,
        explanation:
          "Average number waiting (excluding the one in service) for M/M/1.",
        purpose: ["Predict queue length/buffer pressure"],
        assumptions: ["M/M/1 assumptions", "Steady state", "ρ < 1"],
        variables: [
          { symbol: "Lq", meaning: "mean number in queue" },
          { symbol: "λ", meaning: "arrival rate" },
          { symbol: "Wq", meaning: "mean waiting time in queue" },
          { symbol: "ρ", meaning: "utilization" },
        ],
        exampleTypes: ["Compute expected queue length"],
        dependencies: ["mm1-Wq", "little-law-queue"],
        source: {
          pdf: "Queueing models - 2025.pdf",
          slide: "31/69 (deck slide 26)",
          section: "M/M/1 – Equations",
        },
        tags: ["mm1", "core", "exam"],
      },
      {
        id: "mm1-Ls",
        name: "M/M/1 Mean Number in Service",
        latex: String.raw`L_s=\frac{\lambda}{\mu}`,
        explanation: "Average number being served (busy fraction) in M/M/1.",
        purpose: ["Split system population into service + queue components"],
        assumptions: ["M/M/1 assumptions", "Steady state"],
        variables: [
          { symbol: "Ls", meaning: "mean number in service" },
          { symbol: "λ", meaning: "arrival rate" },
          { symbol: "μ", meaning: "service rate" },
        ],
        exampleTypes: ["Compute service occupancy"],
        dependencies: ["mm1-rho"],
        source: {
          pdf: "Queueing models - 2025.pdf",
          slide: "32/69 (deck slide 27)",
          section: "Decomposition",
        },
        tags: ["mm1"],
      },
      {
        id: "mm1-decompose-L",
        name: "M/M/1 Decomposition of Mean Number in System",
        latex: String.raw`L=L_s+L_q`,
        explanation:
          "Total mean number in system equals mean in service plus mean in queue.",
        purpose: ["Sanity-check values; connect L, Lq, Ls"],
        assumptions: ["M/M/1 assumptions", "Steady state"],
        variables: [
          { symbol: "L", meaning: "mean number in system" },
          { symbol: "Ls", meaning: "mean number in service" },
          { symbol: "Lq", meaning: "mean number in queue" },
        ],
        exampleTypes: ["Given L and Ls, compute Lq"],
        dependencies: ["mm1-Ls", "mm1-Lq"],
        source: {
          pdf: "Queueing models - 2025.pdf",
          slide: "32/69 (deck slide 27)",
          section: "Decomposition",
        },
        tags: ["mm1"],
      },
      {
        id: "link-queue-packets",
        name: "Packets in a Link Queue (Flow vs Capacity)",
        latex: String.raw`N_{ij}=\frac{F_{ij}}{C_{ij}-F_{ij}}`,
        explanation:
          "Model relationship for average packets at link (i,j) based on flow and capacity (captures blow-up as F→C).",
        purpose: ["Back-of-the-envelope congestion estimation on a link"],
        assumptions: [
          "Applies under the slide’s link-model assumptions",
          "Requires Fij < Cij",
        ],
        variables: [
          { symbol: "Nij", meaning: "avg packets associated with link (i,j)" },
          { symbol: "Fij", meaning: "flow on link (i,j)" },
          { symbol: "Cij", meaning: "capacity of link (i,j)" },
        ],
        exampleTypes: ["Estimate queue growth as utilization increases"],
        source: {
          pdf: "Queueing models - 2025.pdf",
          slide: "30/69 (deck slide 25)",
          section: "Link model",
        },
        tags: ["networks", "exam"],
      },
      {
        id: "link-prop-processing-packets",
        name: "Extra Packets Due to Propagation + Processing Delay",
        latex: String.raw`N^{(delay)}_{ij}=(p_{ij}+t_i)\frac{F_{ij}}{L}`,
        explanation:
          "Estimates additional packets ‘in flight / in processing’ due to propagation delay pij and processing delay ti.",
        purpose: ["Relate delays to how many packets exist in the system"],
        assumptions: [
          "Uses slide’s link-delay model",
          "Requires consistent units",
        ],
        variables: [
          { symbol: "pij", meaning: "propagation delay on link (i,j)" },
          { symbol: "ti", meaning: "processing delay at node i" },
          { symbol: "Fij", meaning: "flow on link (i,j)" },
          { symbol: "L", meaning: "packet length (bits)" },
        ],
        exampleTypes: ["Estimate in-flight packets from RTT-ish parameters"],
        source: {
          pdf: "Queueing models - 2025.pdf",
          slide: "30/69 (deck slide 25)",
          section: "Link model",
        },
        tags: ["networks"],
      },
      {
        id: "mmk-P0",
        name: "M/M/k Normalization Constant (P0)",
        latex: String.raw`P_0=\left[\sum_{n=0}^{k-1}\frac{\rho^n}{n!}+\frac{\rho^k}{k!}\frac{1}{1-\rho/k}\right]^{-1}`,
        explanation:
          "Probability the M/M/k system is empty (used to compute all steady-state probabilities).",
        purpose: ["Compute waiting probability / queue metrics in M/M/k"],
        assumptions: [
          "Poisson arrivals, exponential service, k identical servers",
          "Steady state",
          "Stability: ρ/k < 1 (equivalently λ < kμ)",
        ],
        variables: [
          { symbol: "P0", meaning: "probability system is empty" },
          {
            symbol: "ρ",
            meaning: "offered load (commonly ρ=λ/μ in the slides)",
          },
          { symbol: "k", meaning: "number of servers" },
        ],
        exampleTypes: ["Compute P0 then compute P(wait) or Pn"],
        source: {
          pdf: "Queueing models - 2025.pdf",
          slide: "41/69 (deck slide 35)",
          section: "M/M/k – Probability of blocking/waiting",
        },
        tags: ["mmk", "exam"],
      },
      {
        id: "erlang-c",
        name: "Erlang C (Probability of Waiting in M/M/k)",
        latex: String.raw`P(\text{wait})=\frac{\frac{\rho^k}{k!}\frac{1}{1-\rho/k}}{\sum_{n=0}^{k-1}\frac{\rho^n}{n!}+\frac{\rho^k}{k!}\frac{1}{1-\rho/k}}`,
        explanation:
          "Probability an arrival must wait because all k servers are busy (classic Erlang C).",
        purpose: ["Sizing k to meet delay / waiting probability targets"],
        assumptions: ["M/M/k with infinite queue", "Steady state", "ρ/k < 1"],
        variables: [
          {
            symbol: "ρ",
            meaning: "offered load (commonly λ/μ form per slides)",
          },
          { symbol: "k", meaning: "number of servers" },
        ],
        exampleTypes: ["Choose k so P(wait) ≤ threshold"],
        dependencies: ["mmk-P0"],
        source: {
          pdf: "Queueing models - 2025.pdf",
          slide: "41/69 (deck slide 35)",
          section: "M/M/k – Probability of blocking/waiting",
        },
        tags: ["mmk", "exam"],
      },
      {
        id: "erlang-b",
        name: "Erlang B (Blocking Probability for M/M/k/k)",
        latex: String.raw`B(A,C)=\frac{\frac{A^C}{C!}}{\sum_{n=0}^{C}\frac{A^n}{n!}}\quad\text{where }A=\frac{\lambda}{\mu}`,
        explanation:
          "Loss system (no queue). Probability an arrival is blocked because all C channels are busy.",
        purpose: [
          "Call admission / trunk sizing",
          "Loss probability constraints",
        ],
        assumptions: [
          "M/M/C/C (Poisson arrivals, exponential holding times)",
          "No waiting room (blocked calls are lost)",
        ],
        variables: [
          { symbol: "B(A,C)", meaning: "blocking probability" },
          { symbol: "A", meaning: "offered traffic in Erlangs (λ/μ)" },
          { symbol: "C", meaning: "number of channels/servers" },
          { symbol: "λ", meaning: "arrival rate" },
          { symbol: "μ", meaning: "service rate" },
        ],
        exampleTypes: ["Find C such that B(A,C) ≤ 0.01"],
        source: {
          pdf: "Queueing models - 2025.pdf",
          slide: "59/69 (deck slide 48)",
          section: "M/M/k/k – Erlang Example 2",
        },
        tags: ["erlang", "exam"],
      },
      {
        id: "erlang-units",
        name: "Erlang Unit Conversions",
        latex: String.raw`1\ \text{Erlang}=60\ \text{CM}=3600\ \text{CS}=36\ \text{CCS}`,
        explanation:
          "Traffic units: call-minutes (CM), call-seconds (CS), centum call-seconds (CCS).",
        purpose: ["Convert measured traffic to Erlangs and vice-versa"],
        assumptions: [
          "Traffic measured over a 1-hour window (as defined in the slides)",
        ],
        variables: [],
        exampleTypes: [
          "Convert call seconds to Erlangs",
          "Compute Erlangs from usage",
        ],
        source: {
          pdf: "Queueing models - 2025.pdf",
          slide: "57/69 (deck slide 46)",
          section: "Erlang Definition",
        },
        tags: ["erlang"],
      },
    ],
  },

  {
    id: "rng",
    title: "Random Number Generation (RNG) + Randomness Tests",
    description:
      "Uniform(0,1) generation + sanity tests (frequency/independence).",
    formulas: [
      {
        id: "lcg",
        name: "Linear Congruential Generator (LCG)",
        latex: String.raw`X_{i+1} = (aX_i + c)\bmod m,\quad U_i = \frac{X_i}{m}`,
        explanation:
          "Generates pseudo-random integers Xi, then maps to uniforms Ui in [0,1).",
        purpose: ["Core RNG for simulations", "Seeded reproducibility"],
        assumptions: ["Choose a, c, m to avoid short cycles / patterns"],
        variables: [
          { symbol: "m", meaning: "modulus" },
          { symbol: "a", meaning: "multiplier" },
          { symbol: "c", meaning: "increment" },
          { symbol: "X_i", meaning: "state (integer)" },
          { symbol: "U_i", meaning: "uniform in [0,1)" },
        ],
        exampleTypes: ["Implement RNG in code", "Explain period/seed effects"],
        source: {
          pdf: "Random number generation - 2025.pdf",
          slide: "10/54",
          section: "LCG",
        },
        tags: ["core", "implementation"],
      },
      {
        id: "hulldobell",
        name: "Hull–Dobell Full-Period Conditions (for Mixed LCG)",
        latex: String.raw`(1)\ \gcd(c,m)=1,\quad (2)\ a-1\ \text{divisible by all prime factors of }m,\quad (3)\ \text{if }4|m\Rightarrow 4|(a-1)`,
        explanation:
          "Conditions that guarantee the LCG cycles through all m states (full period).",
        purpose: ["Pick good RNG parameters", "Avoid broken generators"],
        assumptions: ["Applies to mixed LCG (c ≠ 0)"],
        variables: [{ symbol: "a,c,m", meaning: "LCG parameters" }],
        exampleTypes: ["Given (a,c,m), check if full period holds"],
        dependencies: ["lcg"],
        source: {
          pdf: "Random number generation - 2025.pdf",
          slide: "14/54",
          section: "Full period",
        },
        tags: ["exam"],
      },
      {
        id: "chi-square-uniformity",
        name: "Chi-Square Test Statistic (Uniformity / Frequency Test)",
        latex: String.raw`\chi^2 = \sum_{i=1}^{k}\frac{(O_i-E_i)^2}{E_i}`,
        explanation:
          "Compares observed counts in bins to expected counts under Uniform(0,1).",
        purpose: ["Detect non-uniform RNG output"],
        assumptions: [
          "Expected counts Ei should be sufficiently large (common rule: Ei ≥ 5)",
          "Bins are pre-defined",
        ],
        variables: [
          { symbol: "k", meaning: "number of bins" },
          { symbol: "O_i", meaning: "observed count in bin i" },
          { symbol: "E_i", meaning: "expected count in bin i" },
        ],
        exampleTypes: ["RNG passes/fails frequency test"],
        source: {
          pdf: "Random number generation - 2025.pdf",
          slide: "27/54",
          section: "Chi-square test",
        },
        tags: ["validation"],
      },
    ],
  },

  {
    id: "rvg",
    title: "Random Variate Generation (from Uniforms)",
    description: "Turn U~Uniform(0,1) into samples from target distributions.",
    formulas: [
      {
        id: "inverse-transform",
        name: "Inverse Transform Method",
        latex: String.raw`X = F^{-1}(U),\quad U\sim \text{Unif}(0,1)`,
        explanation:
          "Generate U uniform, then map through inverse CDF to get X.",
        purpose: [
          "Generate exponential, custom distributions, empirical distributions",
        ],
        assumptions: ["Need invertible/usable CDF (or piecewise inverse)"],
        variables: [
          { symbol: "F", meaning: "CDF of target distribution" },
          { symbol: "U", meaning: "Uniform(0,1)" },
          { symbol: "X", meaning: "target random variate" },
        ],
        exampleTypes: [
          "Derive X from a given CDF",
          "Implement sampling in code",
        ],
        source: {
          pdf: "Random Variate generation - 2025.pdf",
          slide: "14/86",
          section: "Inverse transformation",
        },
        tags: ["core", "implementation"],
      },
      {
        id: "poisson-process-pmf",
        name: "Poisson Process Count Distribution",
        latex: String.raw`P(N(t)=k)=e^{-\lambda t}\frac{(\lambda t)^k}{k!}`,
        explanation:
          "Probability of k arrivals in time interval length t when arrivals follow a Poisson process.",
        purpose: [
          "Traffic/packet arrivals modeling",
          "Count of events per interval",
        ],
        assumptions: [
          "Stationary independent increments",
          "Rate λ is constant",
        ],
        variables: [
          { symbol: "N(t)", meaning: "number of arrivals by time t" },
          { symbol: "λ", meaning: "arrival rate" },
          { symbol: "t", meaning: "time interval length" },
          { symbol: "k", meaning: "nonnegative integer count" },
        ],
        exampleTypes: ["Compute probability of k arrivals in a window"],
        source: {
          pdf: "Random Variate generation - 2025.pdf",
          slide: "9/86",
          section: "Poisson process",
        },
        tags: ["exam"],
      },
      {
        id: "exp-cdf",
        name: "Exponential CDF (Interarrival / Service time)",
        latex: String.raw`F(t)=P(T\le t)=1-e^{-\lambda t},\quad t\ge 0`,
        explanation:
          "Time between Poisson arrivals is exponential; also common for service times.",
        purpose: ["Queueing (M/M/1)", "Interarrival/service sampling"],
        assumptions: ["Memoryless property", "t ≥ 0"],
        variables: [
          { symbol: "λ", meaning: "rate parameter" },
          { symbol: "t", meaning: "time" },
        ],
        exampleTypes: ["Find P(T>t)", "Generate exponential samples"],
        source: {
          pdf: "Random Variate generation - 2025.pdf",
          slide: "9/86",
          section: "Exponential distribution",
        },
        tags: ["core"],
      },
      {
        id: "exp-inv-sample",
        name: "Exponential Sampling (Inverse Transform)",
        latex: String.raw`T = -\frac{1}{\lambda}\ln(1-U)\ \equiv\ -\frac{1}{\lambda}\ln(U)`,
        explanation:
          "Closed-form inverse transform for exponential. Using ln(U) is fine since U and 1-U are both uniform.",
        purpose: ["Generate interarrival/service times in simulations"],
        assumptions: ["U ~ Uniform(0,1), λ>0"],
        variables: [
          { symbol: "U", meaning: "Uniform(0,1)" },
          { symbol: "λ", meaning: "rate" },
          { symbol: "T", meaning: "exponential sample" },
        ],
        exampleTypes: ["Implement exp sampling in code"],
        dependencies: ["inverse-transform", "exp-cdf"],
        source: {
          pdf: "Random Variate generation - 2025.pdf",
          slide: "14/86",
          section: "Inverse transform examples",
        },
        tags: ["implementation", "core"],
      },
    ],
  },

  {
    id: "output-analysis",
    title: "Output Analysis (Estimators + Confidence Intervals)",
    description: "How to report simulation results with statistical validity.",
    formulas: [
      {
        id: "sample-mean",
        name: "Sample Mean",
        latex: String.raw`\bar{X}=\frac{1}{n}\sum_{i=1}^{n}X_i`,
        explanation: "Average of n observed outputs (replications or batches).",
        purpose: ["Point estimate of expected performance"],
        assumptions: [
          "Xi are i.i.d. (or approximately independent via batching)",
        ],
        variables: [
          { symbol: "n", meaning: "number of observations/replications" },
          { symbol: "X_i", meaning: "observed performance metric" },
          { symbol: "X̄", meaning: "sample mean" },
        ],
        exampleTypes: ["Compute mean delay/throughput from runs"],
        source: {
          pdf: "Output Analysis - 2025.pdf",
          slide: "10/55",
          section: "Point estimation",
        },
        tags: ["core"],
      },
      {
        id: "sample-variance",
        name: "Unbiased Sample Variance",
        latex: String.raw`s^2=\frac{1}{n-1}\sum_{i=1}^{n}(X_i-\bar{X})^2`,
        explanation: "Measures variability of outputs around the sample mean.",
        purpose: ["Confidence intervals", "Compare alternatives"],
        assumptions: ["Xi are i.i.d. (or batched to reduce correlation)"],
        variables: [
          { symbol: "s^2", meaning: "sample variance" },
          { symbol: "n", meaning: "sample size" },
          { symbol: "X_i", meaning: "observations" },
          { symbol: "X̄", meaning: "sample mean" },
        ],
        exampleTypes: ["Compute CI half-width"],
        dependencies: ["sample-mean"],
        source: {
          pdf: "Output Analysis - 2025.pdf",
          slide: "10/55",
          section: "Point estimation",
        },
        tags: ["core"],
      },
      {
        id: "t-ci-mean",
        name: "t-Confidence Interval for the Mean",
        latex: String.raw`\bar{X}\ \pm\ t_{\alpha/2,\ n-1}\frac{s}{\sqrt{n}}`,
        explanation:
          "A (1-α) CI for the true mean performance using the t distribution.",
        purpose: ["Report simulation results with uncertainty"],
        assumptions: [
          "Approximately i.i.d. sample (replications or batch means)",
          "n not too small, or underlying distribution not too skewed",
        ],
        variables: [
          { symbol: "α", meaning: "significance level (e.g., 0.05)" },
          { symbol: "t_{α/2,n-1}", meaning: "t critical value with n-1 df" },
          { symbol: "s", meaning: "sample standard deviation" },
          { symbol: "n", meaning: "sample size" },
          { symbol: "X̄", meaning: "sample mean" },
        ],
        exampleTypes: ["Compute 95% CI of mean delay"],
        dependencies: ["sample-mean", "sample-variance"],
        source: {
          pdf: "Output Analysis - 2025.pdf",
          slide: "12/55",
          section: "Confidence intervals",
        },
        tags: ["core", "exam"],
      },
      {
        id: "ci-halfwidth",
        name: "Confidence Interval Half-Width",
        latex: String.raw`h = t_{\alpha/2,\ n-1}\frac{s}{\sqrt{n}}`,
        explanation:
          "The ± term in the mean CI; smaller h means more precision.",
        purpose: ["Stopping rules", "Decide more replications needed"],
        assumptions: ["Same as t CI for mean"],
        variables: [
          { symbol: "h", meaning: "half-width" },
          { symbol: "t", meaning: "t critical value" },
          { symbol: "s", meaning: "std dev" },
          { symbol: "n", meaning: "sample size" },
        ],
        exampleTypes: ["Stop when h <= target precision"],
        dependencies: ["t-ci-mean"],
        source: {
          pdf: "Output Analysis - 2025.pdf",
          slide: "12/55",
          section: "Confidence intervals",
        },
        tags: ["implementation"],
      },
      // --- ADD THESE inside the "output-analysis" section formulas: [ ... ]

      {
        id: "replication-variance",
        name: "Replication Variance Estimate",
        latex: String.raw`S^2=\frac{1}{R-1}\sum_{i=1}^{R}(Y_i-\bar{Y})^2`,
        explanation:
          "Sample variance across R independent replications (each replication outputs Yi).",
        purpose: ["Build confidence intervals", "Measure output variability"],
        assumptions: ["Replications are independent (different seeds)"],
        variables: [
          { symbol: "R", meaning: "number of replications" },
          { symbol: "Y_i", meaning: "output from replication i" },
          { symbol: "Ȳ", meaning: "mean output across replications" },
          { symbol: "S^2", meaning: "sample variance across replications" },
        ],
        exampleTypes: ["Compute variance of mean delay over replications"],
        source: {
          pdf: "Output Analysis - 2025.pdf",
          slide: "8/15 (deck slide 8)",
          section: "Confidence intervals",
        },
        tags: ["core"],
      },
      {
        id: "prediction-interval",
        name: "Prediction Interval (Single Future Replication Output)",
        latex: String.raw`\bar{Y}\ \pm\ t_{\alpha/2,\ R-1}\ S\sqrt{1+\frac{1}{R}}`,
        explanation:
          "Interval that predicts the output of ONE additional replication (wider than the mean CI).",
        purpose: [
          "Forecast what the next run might produce",
          "Communicate run-to-run variability",
        ],
        assumptions: [
          "Independent replications",
          "Approx. normality of estimator (or R reasonably large)",
        ],
        variables: [
          { symbol: "Ȳ", meaning: "mean across replications" },
          { symbol: "t_{α/2,R-1}", meaning: "t critical value with R-1 df" },
          {
            symbol: "S",
            meaning: "sample standard deviation across replications",
          },
          { symbol: "R", meaning: "number of replications" },
        ],
        exampleTypes: ["Predict next-run delay range from replication stats"],
        dependencies: ["replication-variance"],
        source: {
          pdf: "Output Analysis - 2025.pdf",
          slide: "8/15 (deck slide 8)",
          section: "Prediction interval",
        },
        tags: ["exam"],
      },
    ],
  },

  {
    id: "input-modeling",
    title: "Input Modeling (Distribution Fitting + Goodness-of-Fit)",
    description: "Fit distributions to observed data and test the fit.",
    formulas: [
      {
        id: "edf",
        name: "Empirical Distribution Function (EDF)",
        latex: String.raw`F_n(x)=\frac{1}{n}\sum_{i=1}^{n}\mathbf{1}\{X_i\le x\}`,
        explanation: "Step function estimate of the CDF from observed data.",
        purpose: ["K-S test", "Empirical modeling", "Visual fit checks"],
        assumptions: ["Data are a sample from a fixed distribution"],
        variables: [
          { symbol: "n", meaning: "sample size" },
          { symbol: "1{Xi ≤ x}", meaning: "indicator function" },
        ],
        exampleTypes: ["Build EDF then compare to candidate CDF"],
        source: {
          pdf: "Input modeling - 2025.pdf",
          slide: "15/73",
          section: "EDF",
        },
        tags: ["core"],
      },
      {
        id: "ks-stat",
        name: "Kolmogorov–Smirnov (K-S) Test Statistic",
        latex: String.raw`D_n=\sup_x|F_n(x)-F(x)|`,
        explanation:
          "Maximum vertical distance between EDF and the hypothesized CDF.",
        purpose: [
          "Goodness-of-fit test (often stronger than chi-square for small n)",
        ],
        assumptions: ["Continuous distribution (classic K-S)"],
        variables: [
          { symbol: "F_n(x)", meaning: "empirical CDF" },
          { symbol: "F(x)", meaning: "hypothesized CDF" },
          { symbol: "D_n", meaning: "K-S statistic" },
        ],
        exampleTypes: [
          "Decide whether exponential model fits interarrival data",
        ],
        dependencies: ["edf"],
        source: {
          pdf: "Input modeling - 2025.pdf",
          slide: "22/73",
          section: "K-S test",
        },
        tags: ["exam"],
      },
      {
        id: "chisq-gof",
        name: "Chi-Square Goodness-of-Fit Test Statistic",
        latex: String.raw`\chi^2=\sum_{i=1}^{k}\frac{(O_i-E_i)^2}{E_i}`,
        explanation:
          "Compares observed bin counts to expected bin counts from a candidate distribution.",
        purpose: ["Goodness-of-fit for discrete or binned continuous data"],
        assumptions: [
          "Expected counts per bin are sufficiently large (rule-of-thumb: Ei ≥ 5)",
        ],
        variables: [
          { symbol: "k", meaning: "number of bins/classes" },
          { symbol: "O_i", meaning: "observed count" },
          { symbol: "E_i", meaning: "expected count" },
        ],
        exampleTypes: ["Fit Poisson to packet arrival counts"],
        source: {
          pdf: "Input modeling - 2025.pdf",
          slide: "28/73",
          section: "Chi-square GOF",
        },
        tags: ["validation"],
      },
    ],
  },

  {
    id: "vnv",
    title: "Verification & Validation (V&V)",
    description:
      "Make sure the model is built right (verification) and is the right model (validation).",
    formulas: [
      {
        id: "hypothesis-test",
        name: "Hypothesis Testing (Template)",
        latex: String.raw`H_0:\ \text{(no difference / acceptable)}\quad\text{vs}\quad H_1:\ \text{(difference / not acceptable)}`,
        explanation:
          "Formal structure to compare model vs real system or two model configurations.",
        purpose: ["Model validation with data", "Comparing alternatives"],
        assumptions: ["Need clearly defined metric + significance α"],
        variables: [
          { symbol: "H0", meaning: "null hypothesis" },
          { symbol: "H1", meaning: "alternative hypothesis" },
          { symbol: "α", meaning: "Type I error probability (significance)" },
        ],
        exampleTypes: ["Validate mean delay difference within tolerance"],
        source: {
          pdf: "Verification and validation - 2025.pdf",
          slide: "18/43",
          section: "Hypothesis tests",
        },
        tags: ["conceptual"],
      },
      {
        id: "type-errors",
        name: "Type I and Type II Errors",
        latex: String.raw`\alpha=P(\text{reject }H_0\mid H_0\text{ true}),\quad \beta=P(\text{fail to reject }H_0\mid H_1\text{ true})`,
        explanation: "α is false alarm; β is miss. Power is 1−β.",
        purpose: ["Interpret validation test outcomes", "Choose α tradeoff"],
        assumptions: ["Standard hypothesis testing setup"],
        variables: [
          { symbol: "α", meaning: "Type I error probability" },
          { symbol: "β", meaning: "Type II error probability" },
        ],
        exampleTypes: ["Explain why a test might miss real differences"],
        dependencies: ["hypothesis-test"],
        source: {
          pdf: "Verification and validation - 2025.pdf",
          slide: "20/43",
          section: "Errors",
        },
        tags: ["exam"],
      },
    ],
  },
];

// Minimal “Survival Kit” = IDs you want to feature as one-page essentials
export const NET4001_SURVIVAL_KIT_IDS: string[] = [
  "little-law",
  "little-law-queue",
  "system-time-sum",
  "mm1-pn",
  "mm1-rho",
  "mmk-rho",
  "mm1-L",
  "mm1-W",
  "mm1-Wq",
  "mm1-Lq",
  "mmk-P0",
  "erlang-c",
  "erlang-b",
  "prediction-interval",
  "lcg",
  "inverse-transform",
  "exp-inv-sample",
  "sample-mean",
  "sample-variance",
  "t-ci-mean",
  "ks-stat",
  "chisq-gof",
];

// Consistency audit items you can render in the UI
export const NET4001_AUDIT_FINDINGS: Array<{
  severity: "info" | "warn" | "high";
  title: string;
  detail: string;
  suggestion: string;
}> = [
  {
    severity: "warn",
    title: "LaTeX rendering not enabled by default",
    detail:
      "Your project dependencies don’t currently include KaTeX/MathJax packages, so formulas will display as LaTeX text.",
    suggestion:
      "If you want pretty math, add KaTeX + a renderer (e.g., react-markdown + remark-math + rehype-katex) and render `latex` as math.",
  },
  {
    severity: "info",
    title: "Unit consistency is a common source of errors",
    detail:
      "Queueing formulas mix rates (jobs/sec) and times (sec/job). If λ is per second, W must be seconds/job.",
    suggestion:
      "In your solver UI, show units beside λ, μ, W, Wq, L, Lq and block submission when units are inconsistent.",
  },
];
