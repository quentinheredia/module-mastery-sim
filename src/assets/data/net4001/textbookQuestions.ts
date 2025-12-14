// src/assets/data/net4001/textbookQuestions.ts

export type TextbookQuestion = {
  id: string;
  chapter: number;
  exercise: number;
  title: string;
  prompt: string;
  latex?: string; // optional math block (render with <Math />)
  tags: string[];
  sourceNote: string; // where it came from (slides/chapter reference)
  solution?: string | null; // toggle will show this later (null = not added yet)
};

export type TextbookChapterGroup = {
  id: string;
  title: string;
  subtitle?: string;
  questions: TextbookQuestion[];
};

export const NET4001_TEXTBOOK_CHAPTERS: TextbookChapterGroup[] = [
  {
    id: "ch6",
    title: "Chapter 6 — Queueing Models",
    subtitle: "Banks et al. (DES Simulation) recommended exercises from slides",
    questions: [
      {
        id: "ch6-q23",
        chapter: 6,
        exercise: 23,
        title: "Copy shop: add a 2nd self-service copier?",
        prompt:
          "A copy shop has one self-service copier. The shop can only hold 4 people in the system at once (including the person currently using the machine). If more than 4 people show up, the extra customers must wait outside. Customers arrive at 24 per hour, and average service time is 2 minutes. Assess the impact of adding a second copier, and clearly state any assumptions/approximations you use.",
        tags: ["queueing", "mm1", "mmk", "modeling", "assumptions"],
        sourceNote:
          "Slides: Queueing Models → recommended textbook exercises (Ch.6 #23)",
        solution: null,
      },
      {
        id: "ch6-q26",
        chapter: 6,
        exercise: 26,
        title: "Pooling servers: two M/M/1 vs one M/M/2",
        prompt:
          "Compare the performance of (i) two separate M/M/1 queues (each with arrival rate λ and service rate μ) versus (ii) a single pooled M/M/2 queue with total arrival rate 2λ and service rate μ per server. Use performance measures (e.g., W, Wq, L, Lq, P(wait)) to explain the effect of pooling.",
        latex: String.raw`\text{Compare: }2\times M/M/1(\lambda,\mu)\ \ \text{vs}\ \ M/M/2(2\lambda,\mu)`,
        tags: ["queueing", "mm1", "mm2", "pooling", "comparison"],
        sourceNote:
          "Slides: Queueing Models → recommended textbook exercises (Ch.6 #26)",
        solution: null,
      },
    ],
  },

  {
    id: "ch7",
    title: "Chapter 7 — Random Number Generation",
    subtitle: "LCG/MCG + basic RNG testing (K-S, Chi-square)",
    questions: [
      {
        id: "ch7-q4",
        chapter: 7,
        exercise: 4,
        title: "LCG: generate 3 values (two-digit integers + U[0,1))",
        prompt:
          "Using the linear congruential generator (LCG), generate a sequence of three 2-digit random integers and their corresponding U(0,1) values. Use: X0=27, a=8, c=47, m=100.",
        latex: String.raw`X_{i+1}=(aX_i+c)\bmod m,\ \ U_i=\frac{X_i}{m}`,
        tags: ["rng", "lcg", "implementation"],
        sourceNote: "Slides: RNG → recommended textbook exercises (Ch.7 #4)",
        solution: null,
      },
      {
        id: "ch7-q5",
        chapter: 7,
        exercise: 5,
        title: "LCG edge case: what if X0=0?",
        prompt:
          "In the LCG exercise above, would anything go wrong if the seed were X0=0? Explain what happens and why (based on the recurrence).",
        tags: ["rng", "lcg", "seeds", "period"],
        sourceNote: "Slides: RNG → recommended textbook exercises (Ch.7 #5)",
        solution: null,
      },
      {
        id: "ch7-q6",
        chapter: 7,
        exercise: 6,
        title: "Multiplicative congruential method: 4 values (three-digit + U)",
        prompt:
          "Using the multiplicative congruential generator (MCG), generate a sequence of four 3-digit random integers and their corresponding U(0,1) values. Use: X0=117, a=43, m=1000.",
        latex: String.raw`X_{i+1}=(aX_i)\bmod m,\ \ U_i=\frac{X_i}{m}`,
        tags: ["rng", "mcg", "implementation"],
        sourceNote: "Slides: RNG → recommended textbook exercises (Ch.7 #6)",
        solution: null,
      },
      {
        id: "ch7-q7",
        chapter: 7,
        exercise: 7,
        title: "K-S test for uniformity (α=0.05)",
        prompt:
          "Given the generated sequence: 0.54, 0.73, 0.98, 0.11, 0.68, use the Kolmogorov–Smirnov test with α=0.05 to decide whether you can reject the hypothesis that the numbers are Uniform(0,1).",
        tags: ["rng", "ks-test", "hypothesis-testing"],
        sourceNote: "Slides: RNG → recommended textbook exercises (Ch.7 #7)",
        solution: null,
      },
      {
        id: "ch7-q8",
        chapter: 7,
        exercise: 8,
        title: "Chi-square uniformity test (α=0.05) on reversed list",
        prompt:
          "Reverse the 100 two-digit random numbers from the referenced example to create a new list (so the new first value becomes 0.43). Using α=0.05, apply the chi-square test to decide whether Uniform(0,1) can be rejected.",
        tags: ["rng", "chi-square", "uniformity", "testing"],
        sourceNote: "Slides: RNG → recommended textbook exercises (Ch.7 #8)",
        solution: null,
      },
      {
        id: "ch7-q15",
        chapter: 7,
        exercise: 15,
        title: "MCG cycles + maximum period check (4 parameter sets)",
        prompt:
          "For each multiplicative congruential generator (MCG) case below, generate enough values to complete one full cycle. Then answer: what patterns/inferences do you see, and does the generator achieve the maximum possible period?\n\n(a) X0=7, a=11, m=16\n(b) X0=8, a=11, m=16\n(c) X0=7, a=7,  m=16\n(d) X0=8, a=7,  m=16",
        tags: ["rng", "mcg", "period", "cycle"],
        sourceNote: "Slides: RNG → recommended textbook exercises (Ch.7 #15)",
        solution: null,
      },
    ],
  },

  {
    id: "ch8",
    title: "Chapter 8 — Random Variate Generation",
    subtitle:
      "Inverse transform + generators from CDF/PDF + exponential sampling",
    questions: [
      {
        id: "ch8-q5",
        chapter: 8,
        exercise: 5,
        title: "Generator from piecewise CDF + histogram (1000 samples)",
        prompt:
          "A continuous random variable has support from -3 to 4 with the piecewise CDF shown below. Build a generator for this variable, generate 1000 values, and plot a histogram.",
        latex: String.raw`F(x)=
\begin{cases}
0, & x\le -3\\
\frac{1}{2}+\frac{x}{6}, & -3<x\le 0\\
\frac{1}{2}+\frac{x^2}{32}, & 0<x\le 4\\
1, & x>4
\end{cases}`,
        tags: ["rvg", "inverse-transform", "piecewise-cdf", "histogram"],
        sourceNote:
          "Slides: Random Variate Generation → recommended textbook exercises (Ch.8 #5)",
        solution: null,
      },
      {
        id: "ch8-q6",
        chapter: 8,
        exercise: 6,
        title: "Generator from CDF F(x)=x^4/16 on [0,2] + mean check",
        prompt:
          "Given the CDF F(x)=x^4/16 for 0 ≤ x ≤ 2, build a generator, generate 1000 samples, compute the sample mean, and compare it to the true mean.",
        latex: String.raw`F(x)=\frac{x^4}{16},\ \ 0\le x\le 2`,
        tags: ["rvg", "inverse-transform", "cdf", "mean"],
        sourceNote:
          "Slides: Random Variate Generation → recommended textbook exercises (Ch.8 #6)",
        solution: null,
      },
      {
        id: "ch8-q7",
        chapter: 8,
        exercise: 7,
        title: "Generator from PDF f(x)=x^2/9 on [0,3] + mean check",
        prompt:
          "Given the PDF f(x)=x^2/9 for 0 ≤ x ≤ 3, build a generator, generate 1000 samples, compute the sample mean, and compare it to the true mean.",
        latex: String.raw`f(x)=\frac{x^2}{9},\ \ 0\le x\le 3`,
        tags: ["rvg", "pdf", "cdf", "sampling", "mean"],
        sourceNote:
          "Slides: Random Variate Generation → recommended textbook exercises (Ch.8 #7)",
        solution: null,
      },
      {
        id: "ch8-q8",
        chapter: 8,
        exercise: 8,
        title: "Generator from piecewise PDF + histogram (1000 samples)",
        prompt:
          "Build a generator for a random variable with the piecewise PDF shown below. Generate 1000 values and plot a histogram.",
        latex: String.raw`f(x)=
\begin{cases}
\frac{1}{3}, & 0\le x\le 2\\
\frac{1}{24}, & 2<x\le 10\\
0, & \text{otherwise}
\end{cases}`,
        tags: ["rvg", "piecewise-pdf", "histogram"],
        sourceNote:
          "Slides: Random Variate Generation → recommended textbook exercises (Ch.8 #8)",
        solution: null,
      },
      {
        id: "ch8-q17",
        chapter: 8,
        exercise: 17,
        title: "Exponential lead times (mean 3.7 days) — generate 5 samples",
        prompt:
          "Lead times follow an exponential distribution with mean 3.7 days. Generate five random lead times from this distribution.",
        latex: String.raw`\text{Mean}=\frac{1}{\lambda}=3.7\ \Rightarrow\ \lambda=\frac{1}{3.7}`,
        tags: ["rvg", "exponential", "inverse-transform"],
        sourceNote:
          "Slides: Random Variate Generation → recommended textbook exercises (Ch.8 #17)",
        solution: null,
      },
    ],
  },
  {
    id: "ch9",
    title: "Chapter 9 — Input Modeling",
    subtitle:
      "Distribution fitting + goodness-of-fit (recommended exercises from slides)",
    questions: [
      {
        id: "ch9-q14",
        chapter: 9,
        exercise: 14,
        title: "Accident locations along a 100 km highway: uniform or not?",
        prompt:
          "A 100 km highway segment between two cities has frequent accidents. Officials claim accident locations are uniformly distributed along the highway, but the media disagrees. For one month, the distances (km) from the Atlanta city limit where 30 serious accidents occurred are listed below. Use an appropriate input-modeling approach to assess whether the accident locations are consistent with a Uniform(0,100) model (or propose a better model). Clearly state assumptions and justify your test/model choice.",
        latex: String.raw`\text{Test candidate: }X \sim \mathrm{Uniform}(0,100)\quad(\text{or propose alternative})`,
        tags: [
          "input-modeling",
          "uniform",
          "ks-test",
          "chi-square",
          "hypothesis-testing",
        ],
        sourceNote:
          "Slides: Input Modeling → recommended textbook exercises (Ch.9 #14)",
        // Data included so you can use it in the quiz UI
        solution: null,
      },

      {
        id: "ch9-q14-data",
        chapter: 9,
        exercise: 14,
        title: "Dataset — Accident locations (km)",
        prompt:
          "Accident locations (km from Atlanta city limits):\n" +
          "88.3, 40.7, 36.3, 27.3, 36.8,\n" +
          "91.7, 67.3, 7.0, 45.2, 23.3,\n" +
          "98.8, 90.1, 17.2, 23.7, 97.4,\n" +
          "32.4, 87.8, 69.8, 62.6, 99.7,\n" +
          "20.6, 73.1, 21.6, 6.0, 45.3,\n" +
          "76.6, 73.2, 27.3, 87.6, 87.2",
        tags: ["dataset"],
        sourceNote: "Ch.9 #14 dataset (from screenshot)",
        solution: null,
      },

      {
        id: "ch9-q16",
        chapter: 9,
        exercise: 16,
        title: "Monthly injuries: Chi-square GOF vs Poisson",
        prompt:
          "A dataset records the number of job-related injuries per month at a mine over 100 months (frequency table shown below). (a) Use a chi-square goodness-of-fit test to check whether a Poisson distribution is plausible at α=0.05, estimating the Poisson mean from the data. (b) Repeat the test assuming the Poisson mean is fixed at 1.0 (α=0.05). (c) Explain the difference between (a) and (b), and when each situation occurs in practice.",
        latex: String.raw`\text{GOF test: }H_0:\ X\sim \mathrm{Poisson}(\lambda)\ \ \text{vs}\ \ H_1:\ \text{not Poisson}`,
        tags: [
          "input-modeling",
          "poisson",
          "chi-square",
          "gof",
          "hypothesis-testing",
        ],
        sourceNote:
          "Slides: Input Modeling → recommended textbook exercises (Ch.9 #16)",
        solution: null,
      },

      {
        id: "ch9-q16-data",
        chapter: 9,
        exercise: 16,
        title: "Dataset — Injuries per month (frequency over 100 months)",
        prompt:
          "Frequency table (Injuries → Count):\n" +
          "0 → 35\n" +
          "1 → 40\n" +
          "2 → 13\n" +
          "3 → 6\n" +
          "4 → 4\n" +
          "5 → 1\n" +
          "6 → 1",
        tags: ["dataset"],
        sourceNote: "Ch.9 #16 frequency table (from screenshot)",
        solution: null,
      },

      {
        id: "ch9-q22",
        chapter: 9,
        exercise: 22,
        title: "Daily demand modeling: develop + test a distribution",
        prompt:
          "Daily demand values were recorded for a part kit (50 days total; data listed below). Determine how the daily demands are distributed. Propose an appropriate distribution/model and perform an appropriate test to support your choice.",
        tags: [
          "input-modeling",
          "distribution-fitting",
          "gof",
          "model-selection",
        ],
        sourceNote:
          "Slides: Input Modeling → recommended textbook exercises (Ch.9 #22)",
        solution: null,
      },

      {
        id: "ch9-q22-data",
        chapter: 9,
        exercise: 22,
        title: "Dataset — Daily demands (50 values)",
        prompt:
          "Daily demands (50 days):\n" +
          "0, 2, 0, 0, 0,\n" +
          "1, 0, 1, 1, 1,\n" +
          "0, 1, 0, 0, 0,\n" +
          "2, 0, 1, 0, 1,\n" +
          "0, 1, 0, 0, 2,\n" +
          "1, 0, 1, 0, 0,\n" +
          "0, 0, 0, 0, 0,\n" +
          "1, 0, 1, 0, 1,\n" +
          "0, 0, 3, 0, 1,\n" +
          "1, 0, 0, 0, 0",
        tags: ["dataset"],
        sourceNote: "Ch.9 #22 dataset (from screenshot)",
        solution: null,
      },
    ],
  },
  {
    id: "ch10",
    title: "Chapter 10 — Verification & Validation",
    subtitle:
      "Model vs system comparisons + hypothesis tests (recommended from slides)",
    questions: [
      {
        id: "ch10-q2",
        chapter: 10,
        exercise: 2,
        title: "Job shop: validate model mean time in system (α = 0.01)",
        prompt:
          "A real job shop has an average time-in-system of about 4 working days. A simulation model produced the following mean time-in-system results from 7 independent replications:\n\n" +
          "3.70, 4.21, 4.35, 4.13, 3.83, 4.32, 4.05\n\n" +
          "(a) Is the model output consistent with the real system behavior? Perform an appropriate statistical test using significance level α = 0.01.\n" +
          "(b) If it is important to detect a mean difference of 0.5 day with power 0.90, what sample size is required? Interpret what your results imply about model validity/invalidity (use α = 0.01).",
        latex: String.raw`H_0:\ \mu = 4\ \text{days}\quad\text{vs}\quad H_1:\ \mu \ne 4\ \text{days}\quad (\alpha=0.01)`,
        tags: [
          "verification-validation",
          "hypothesis-testing",
          "t-test",
          "power",
          "sample-size",
        ],
        sourceNote:
          "Slides: Verification & Validation → recommended textbook exercises (Ch.10 #2)",
        solution: null,
      },
    ],
  },
  {
    id: "ch11",
    title: "Chapter 11 — Output Analysis",
    subtitle:
      "Confidence intervals + sample size planning (recommended from slides)",
    questions: [
      {
        id: "ch11-q4",
        chapter: 11,
        exercise: 4,
        title: "Sample size for 95% CI with error tolerance ε = 0.05 hours",
        prompt:
          "In a referenced example, management wants a 95% confidence interval for the mean cycle time estimate, with allowable absolute error ε = 0.05 hours (≈ 3 minutes). Using the same initial data from the referenced table, estimate the required total sample size. If the error tolerance is cut in half, by what factor does the required sample size increase?",
        latex: String.raw`\bar{X}\pm t_{\alpha/2,n-1}\frac{s}{\sqrt{n}},\quad \text{require } t_{\alpha/2,n-1}\frac{s}{\sqrt{n}}\le \varepsilon`,
        tags: [
          "output-analysis",
          "confidence-interval",
          "half-width",
          "sample-size",
        ],
        sourceNote:
          "Slides: Output Analysis → recommended textbook exercises (Ch.11 #4)",
        solution: null,
      },
    ],
  },
];
