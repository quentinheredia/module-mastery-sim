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
        solution:
          "Model the copy shop as an M/M/c system.\n" +
          "Arrivals: λ = 24/hour.\n" +
          "Mean service time = 2 minutes → μ = 0.5/min = 30/hour.\n" +
          "Current c=1; proposed c=2.\n\n" +
          "‘Outside line’ happens when total in system ≥ 5 (since only 4 spots inside including service).\n" +
          "So p = P(N ≥ 5) = Σ_{n=5..∞} Pn = 1 − Σ_{n=0..4} Pn.\n\n" +
          "From the provided solution results:\n" +
          "For M/M/1: p ≈ 0.33.\n" +
          "For M/M/2: p ≈ 0.01.\n\n" +
          "Impact: adding the second copier massively reduces the probability that the line spills outside.",
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
        solution:
          "Compare two separate M/M/1 queues vs a pooled M/M/2 queue.\n\n" +
          "Two M/M/1 (each λ, μ):\n" +
          "ρ = λ/μ\n" +
          "L_total = 2·ρ/(1−ρ)\n" +
          "W = 1/(μ(1−ρ))\n" +
          "Wq = ρ/(μ(1−ρ))\n" +
          "Lq_total = 2·ρ²/(1−ρ)\n\n" +
          "Pooled M/M/2 (arrival 2λ, each server μ):\n" +
          "Using the table result from the solution, the pooled system gives:\n" +
          "L = 2ρ/(1−ρ²),  W = 1/(μ(1−ρ²)),  Wq = ρ²/(μ(1−ρ²)),  Lq = 2ρ³/(1−ρ²).\n\n" +
          "Conclusion: pooling (M/M/2) yields smaller average queueing and system measures than splitting into two separate M/M/1 lines.",
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
        solution:
          "LCG with X0=27, a=8, c=47, m=100.\n" +
          "X1=(8·27+47) mod 100=63 → U1=63/100=0.63\n" +
          "X2=(8·63+47) mod 100=51 → U2=0.51\n" +
          "X3=(8·51+47) mod 100=55 → U3=0.55",
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
        solution:
          "With a mixed LCG (c ≠ 0), starting at X0=0 does NOT automatically break anything.\n" +
          "A problem with X0=0 mainly happens in the purely multiplicative case (c=0), because 0 becomes an absorbing state.",
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
        solution:
          "MCG with X0=117, a=43, m=1000.\n" +
          "X1=(43·117) mod 1000=31 → U1=0.031\n" +
          "X2=(43·31)  mod 1000=333 → U2=0.333\n" +
          "X3=(43·333) mod 1000=319 → U3=0.319\n" +
          "X4=(43·319) mod 1000=717 → U4=0.717",
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
        solution:
          "Sort the 5 values: R(i) = {0.11, 0.54, 0.68, 0.73, 0.98}, with N=5.\n" +
          "Compute D+ = max(i/N − R(i)) = 0.09 and D− = max(R(i) − (i−1)/N) = 0.34.\n" +
          "So D = max(D+, D−) = 0.34.\n" +
          "At α=0.05, K-S critical value ≈ 1.36/√5 ≈ 0.61.\n" +
          "Since 0.34 < 0.61, fail to reject Uniform(0,1).",
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
        solution:
          "Using 10 equal intervals with expected count Ei=10 each, the computed chi-square statistic is χ² = 14.2.\n" +
          "df = 10−1 = 9. At α=0.05, χ²(0.95,9) ≈ 16.92.\n" +
          "Because 14.2 < 16.92, fail to reject Uniform(0,1).",
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
        solution:
          "Generate until the sequence repeats (m=16):\n" +
          "(a) X0=7,a=11 → 7→13→15→5→7 (period 4)\n" +
          "(b) X0=8,a=11 → 8→8→… (minimal period)\n" +
          "(c) X0=7,a=7  → 7→1→7 (period 2)\n" +
          "(d) X0=8,a=7  → 8→8→… (minimal period)\n\n" +
          "Inference: maximum period p=4 happens when the seed is odd and a matches the form a = 3 + 8k (here a=11). Even seeds collapse to very short periods regardless of a (for this modulus).",
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
        solution:
          "Inverse-transform generator (R ~ U(0,1)):\n" +
          "If 0 ≤ R ≤ 1/2:  X = 6(R − 1/2)\n" +
          "If 1/2 ≤ R ≤ 1:  X = sqrt(32(R − 1/2))\n" +
          "Then generate 1000 samples using this mapping and plot a histogram.",
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
        solution:
          "Given F(x)=x^4/16 on 0≤x≤2, set R=F(X) ⇒ X = 2·R^(1/4), 0≤R≤1.\n" +
          "Generate 1000 samples with X=2R^(1/4).\n" +
          "True mean: E[X]=∫0^2 x·(x^3/4) dx = 1.6 (compare to sample mean).",
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
        solution:
          "Given f(x)=x^2/9 on 0≤x≤3, CDF is F(x)=x^3/27.\n" +
          "Set R=F(X) ⇒ X = 3·R^(1/3), 0≤R≤1.\n" +
          "Generate 1000 samples with X=3R^(1/3).\n" +
          "True mean: E[X]=∫0^3 x·(x^2/9) dx = 2.25 (compare to sample mean).",
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
        solution:
          "Step 1: Compute CDF:\n" +
          "F(x)=x/3 for 0≤x≤2;\n" +
          "F(x)=2/3 + (x−2)/24 for 2<x≤10.\n\n" +
          "Step 2: Set R=F(X), with R~U(0,1).\n\n" +
          "Step 3: Invert:\n" +
          "If 0 ≤ R ≤ 2/3:  X = 3R\n" +
          "If 2/3 < R ≤ 1:  X = 2 + 24(R − 2/3) = 24R − 14\n" +
          "Generate 1000 samples and plot a histogram.",
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
        solution:
          "Exponential with mean 3.7 days: use inverse transform.\n" +
          "If R~U(0,1), then X = −3.7 ln(R).\n" +
          "Generate 5 values by drawing 5 independent R’s.",
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
        solution:
          "K-S test for Uniform along the highway (after scaling to [0,1]).\n" +
          "Computed: D+ = 0.0653, D− = 0.1720, so D = 0.1720.\n" +
          "Critical value: D_(0.05,30) = 0.24.\n" +
          "Since 0.1720 < 0.24, fail to reject H0 → data are consistent with Uniform.",
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
        solution:
          "K-S test for Uniform along the highway (after scaling to [0,1]).\n" +
          "Computed: D+ = 0.0653, D− = 0.1720, so D = 0.1720.\n" +
          "Critical value: D_(0.05,30) = 0.24.\n" +
          "Since 0.1720 < 0.24, fail to reject H0 → data are consistent with Uniform.",
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
        solution:
          "(a) Estimate Poisson mean from data: λ̂ = X̄ = 1.11.\n" +
          "Chi-square statistic: χ0² = 3.404. Critical χ²_(0.05,2)=5.99.\n" +
          "Decision: 3.404 < 5.99 → fail to reject Poisson.\n" +
          "Note: grouped cells {3,4,5,≥6} into one to keep expected counts reasonable.\n\n" +
          "(b) Test Poisson with fixed mean λ=1.\n" +
          "Chi-square statistic: χ0² = 3.910. Critical χ²_(0.05,3)=7.81.\n" +
          "Decision: 3.910 < 7.81 → fail to reject.\n" +
          "Note: grouped {3,4,5,≥6} into one cell again.",
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
        solution:
          "(a) Estimate Poisson mean from data: λ̂ = X̄ = 1.11.\n" +
          "Chi-square statistic: χ0² = 3.404. Critical χ²_(0.05,2)=5.99.\n" +
          "Decision: 3.404 < 5.99 → fail to reject Poisson.\n" +
          "Note: grouped cells {3,4,5,≥6} into one to keep expected counts reasonable.\n\n" +
          "(b) Test Poisson with fixed mean λ=1.\n" +
          "Chi-square statistic: χ0² = 3.910. Critical χ²_(0.05,3)=7.81.\n" +
          "Decision: 3.910 < 7.81 → fail to reject.\n" +
          "Note: grouped {3,4,5,≥6} into one cell again.",
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
        solution:
          "Model: Poisson.\n" +
          "Estimate mean: λ̂ = X̄ = 0.48.\n" +
          "After grouping tail cells to avoid tiny expected counts, χ0² = 0.0120.\n" +
          "Critical value: χ²_(0.05,1)=3.84.\n" +
          "Since 0.0120 < 3.84 → fail to reject H0 → Poisson is a reasonable fit.\n" +
          "Grouping note (as in solution): combine {2,3} into one cell (O=4, E≈4.21).",
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
        solution:
          "Model: Poisson.\n" +
          "Estimate mean: λ̂ = X̄ = 0.48.\n" +
          "After grouping tail cells to avoid tiny expected counts, χ0² = 0.0120.\n" +
          "Critical value: χ²_(0.05,1)=3.84.\n" +
          "Since 0.0120 < 3.84 → fail to reject H0 → Poisson is a reasonable fit.\n" +
          "Grouping note (as in solution): combine {2,3} into one cell (O=4, E≈4.21).",
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
        solution:
          "(a) One-sample t-test vs system mean μ0=4 days.\n" +
          "Ȳ = 4.084, s = 0.2441, n=7.\n" +
          "t0 = (4.084 − 4) / (0.2441/√7) = 0.91.\n" +
          "At α=0.01, t_(0.005,6)=3.71.\n" +
          "Since |0.91| < 3.71, fail to reject H0 → model output is consistent with system mean.\n\n" +
          "(b) Detect difference of 0.5 with power 0.90 (β≤0.10):\n" +
          "δ = 0.5/0.2441 = 2.05. For α=0.01 and δ≈2.05, required n ≈ 7.\n" +
          "So with n=7 and σ≈0.2441, power is about 0.90.",
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
        solution:
          "Half-width requirement for 95% CI: choose R so that\n" +
          "t_(0.025,R−1)·S0/ε ≤ √R  (equivalently R ≥ (t_(0.025,R−1)·S0/ε)^2).\n\n" +
          "Initial lower bound using z≈1.96:\n" +
          "R > ((1.96·0.35236)/0.4)^2 = 2.98 → start with at least 3.\n" +
          "Given initial R0=4, check candidates:\n" +
          "R=4 → 7.86, R=5 → 5.98, R=6 → 5.12.\n" +
          "Smallest R that satisfies the requirement is R=6 (since 6 ≥ 5.12). \n\n" +
          "If ε is cut in half, required R increases by ≈ 4× (since R ∝ 1/ε^2).",
      },
    ],
  },
];
