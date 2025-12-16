import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Printer } from "lucide-react";
import { Math } from "@/components/math/Math";

type Formula = { label: string; latex: string };
type Section = { title: string; bullets: string[]; formulas: Formula[] };

// ----------------------------
// Pages (Letter: 8.5" x 11")
// Keep it dense: small fonts + 2-col grid.
// ----------------------------

const PAGE_1: Section[] = [
  {
    title: "Queueing — Identify model + givens",
    bullets: [
      "Goal: compute P0, Pn, L, Lq, W, Wq, loss fraction.",
      "Identify model:",
      "• Infinite buffer + 1 server → M/M/1",
      "• Infinite buffer + k servers → M/M/k",
      "• Finite capacity K (includes service) → M/M/1/K",
      "• Pure loss (no queue) with k servers → M/M/k/k (Erlang B)",
      "Extract givens: λ, μ (if mean service time E[S] → μ=1/E[S]), k, K.",
      "Stability: M/M/1 needs ρ<1; M/M/k needs u<1.",
    ],
    formulas: [
      { label: "Mean service time", latex: String.raw`E[S]=\frac{1}{\mu}` },
      { label: "Traffic / load", latex: String.raw`\rho=\frac{\lambda}{\mu}` },
      {
        label: "Per-server utilization (M/M/k)",
        latex: String.raw`u=\frac{\lambda}{k\mu}`,
      },
      {
        label: "Little’s Law",
        latex: String.raw`L=\lambda W,\quad L_q=\lambda W_q`,
      },
      { label: "System vs queue time", latex: String.raw`W=W_q+\frac{1}{\mu}` },
    ],
  },
  {
    title: "Queueing — M/M/1 (infinite buffer)",
    bullets: [
      "Steps: compute ρ=λ/μ → plug into P0, Pn, L, Lq, W, Wq.",
      "State recursion (steady-state): Pn = ρ^n P0.",
    ],
    formulas: [
      { label: "P0", latex: String.raw`P_0=1-\rho` },
      { label: "Pn", latex: String.raw`P_n=(1-\rho)\rho^n` },
      {
        label: "L",
        latex: String.raw`L=\frac{\rho}{1-\rho}=\frac{\lambda}{\mu-\lambda}`,
      },
      {
        label: "W",
        latex: String.raw`W=\frac{L}{\lambda}=\frac{1}{\mu-\lambda}`,
      },
      {
        label: "Wq",
        latex: String.raw`W_q=W-\frac{1}{\mu}=\frac{\rho}{\mu-\lambda}`,
      },
      { label: "Lq", latex: String.raw`L_q=\lambda W_q=\frac{\rho^2}{1-\rho}` },
    ],
  },
  {
    title: "Queueing — M/M/1 balance equations (exam)",
    bullets: [
      "Write: rate leaving state j = rate entering state j.",
      "Used to derive Pn and check reasoning.",
    ],
    formulas: [
      { label: "State 0", latex: String.raw`\lambda P_0=\mu P_1` },
      {
        label: "State 1",
        latex: String.raw`(\lambda+\mu)P_1=\lambda P_0+\mu P_2`,
      },
      {
        label: "State n≥1",
        latex: String.raw`(\lambda+\mu)P_n=\lambda P_{n-1}+\mu P_{n+1}`,
      },
      { label: "Recursion", latex: String.raw`P_n=\rho^n P_0` },
    ],
  },
  {
    title: "Queueing — M/M/1/K (finite capacity → loss)",
    bullets: [
      "K = system capacity (includes service).",
      "If buffer has p waiting + 1 in service → K=p+1.",
      "Loss fraction is typically P(K) (system full).",
    ],
    formulas: [
      { label: "P0", latex: String.raw`P_0=\frac{1-\rho}{1-\rho^{K+1}}` },
      { label: "Pn", latex: String.raw`P_n=\rho^n P_0,\quad n=0,1,\dots,K` },
      { label: "Loss fraction", latex: String.raw`\mathrm{Loss}=P_K` },
      {
        label: "Sheet form (K=p+1)",
        latex: String.raw`P_{K=p+1}=\frac{(\lambda/\mu)^{p+1}(1-\lambda/\mu)}{1-(\lambda/\mu)^{p+2}}`,
      },
    ],
  },
  {
    title: "Queueing — Networking delay (slide)",
    bullets: [
      "Queue delay example uses queue length (bytes), link rate (bps), and utilization u.",
      "Upper bound assumes u=1 (100%).",
    ],
    formulas: [
      {
        label: "Delay (as shown)",
        latex: String.raw`\mathrm{Delay}=\frac{Q_{\text{bytes}}\cdot 8\cdot u}{C_{\text{bps}}}`,
      },
      {
        label: "Upper bound (u=1)",
        latex: String.raw`\mathrm{Upper\ Bound}=\frac{Q_{\text{bytes}}\cdot 8}{C_{\text{bps}}}`,
      },
    ],
  },
];

const PAGE_2: Section[] = [
  {
    title: "Queueing — M/M/k (waiting allowed)",
    bullets: [
      "Use when: k parallel servers, infinite waiting room.",
      "Compute P0 first → then waiting probability (Erlang C) → then Lq, Wq, W, L.",
    ],
    formulas: [
      {
        label: "P0 (slide form)",
        latex: String.raw`P_0=\left[\sum_{n=0}^{k-1}\frac{(\lambda/\mu)^n}{n!}+\frac{(\lambda/\mu)^k\,k\mu}{k!\,(k\mu-\lambda)}\right]^{-1}`,
      },
      {
        label: "Erlang C (prob. wait / all busy)",
        latex: String.raw`C=P_B=\frac{k\,\rho^k\,P_0}{k!\,(k-\rho)}\quad(\rho=\lambda/\mu)`,
      },
      {
        label: "Lq (slide)",
        latex: String.raw`L_q=\frac{\lambda\,C}{\mu k-\lambda}`,
      },
      { label: "Wq", latex: String.raw`W_q=\frac{L_q}{\lambda}` },
      { label: "W", latex: String.raw`W=W_q+\frac{1}{\mu}` },
      { label: "L", latex: String.raw`L=\lambda W=L_q+\frac{\lambda}{\mu}` },
      {
        label: "Server utilization",
        latex: String.raw`\text{utilization}=\frac{\rho}{k}=\frac{\lambda}{k\mu}`,
      },
    ],
  },
  {
    title: "Queueing — M/M/k balance equations (general form)",
    bullets: [
      "State j = # in system.",
      "Rate leaving state j = rate entering state j.",
      "Use when k servers, finite cap, or state-dependent λj.",
    ],
    formulas: [
      { label: "State 0", latex: String.raw`\lambda P_0=\mu P_1` },
      {
        label: "0<j<k",
        latex: String.raw`(\lambda+j\mu)P_j=\lambda P_{j-1}+(j+1)\mu P_{j+1}`,
      },
      {
        label: "j=k",
        latex: String.raw`(\lambda+k\mu)P_k=\lambda P_{k-1}+k\mu P_{k+1}`,
      },
      {
        label: "n>k",
        latex: String.raw`(\lambda+k\mu)P_n=\lambda P_{n-1}+k\mu P_{n+1}`,
      },
    ],
  },
  {
    title: "Blocking Probability — Erlang B (M/M/k/k, no queue)",
    bullets: [
      "Use when: blocked/dropped if all k servers busy and no waiting room.",
      "Design: try k=1,2,3… until B ≤ target.",
    ],
    formulas: [
      {
        label: "Traffic (Erlang)",
        latex: String.raw`\text{Traffic (Erlang)}=\text{average }\#\text{ of busy channels during 1 hour}`,
      },
      { label: "Offered load", latex: String.raw`A=\frac{\lambda}{\mu}` },
      {
        label: "Erlang B",
        latex: String.raw`B=\frac{A^k/k!}{\sum_{n=0}^{k}A^n/n!}`,
      },
    ],
  },
  {
    title: "Blocking Probability — Erlang C (probability of waiting)",
    bullets: [
      "Use when: k servers, waiting room exists.",
      "Compute P0 then C (=prob wait) then Lq,Wq, etc.",
    ],
    formulas: [
      {
        label: "Erlang C",
        latex: String.raw`C=P_B=\frac{k\,\rho^k\,P_0}{k!\,(k-\rho)}\quad(\rho=\lambda/\mu)`,
      },
      {
        label: "All servers busy",
        latex: String.raw`P\{L(\infty)\ge k\}=\frac{k\rho^k P_0}{k!(k-\rho)}=P_B`,
      },
    ],
  },
  {
    title: "Queueing — State-dependent arrivals (multi-type clients)",
    bullets: [
      "1) Define states j=0..K (or j≥0).",
      "2) For each state j compute λj from the admission rules.",
      "3) With k servers: μj = min(j,k)·μ.",
      "4) Use balance equations + recursion in terms of P0; normalize ΣPj=1.",
      "5) Metrics: E[N]=Σ jPj; P(all busy)=Σ_{j≥k}Pj (or PK if finite).",
    ],
    formulas: [
      { label: "State departure rate", latex: String.raw`\mu_j=\min(j,k)\mu` },
      { label: "Expected # in system", latex: String.raw`E[N]=\sum_j jP_j` },
    ],
  },
];

const PAGE_3: Section[] = [
  {
    title: "Chi-Square — Goodness-of-Fit",
    bullets: [
      "Goal: test if sample matches hypothesized distribution.",
      "Choose bins/classes; merge so expected Ei is big enough.",
      "Slides note: Chi-square needs larger N (e.g., N>50) and recommend Ei≥5.",
      "Compute χ² and compare to χ² critical.",
    ],
    formulas: [
      { label: "Expected count", latex: String.raw`E_i=np_i` },
      {
        label: "Statistic",
        latex: String.raw`\chi^2=\sum_{i=1}^{k}\frac{(O_i-E_i)^2}{E_i}`,
      },
      { label: "df (if used)", latex: String.raw`df=k-1-m` },
      {
        label: "Decision",
        latex: String.raw`\text{Reject }H_0\text{ if }\chi^2>\chi^2_{\alpha,df}`,
      },
      { label: "Rule (slides)", latex: String.raw`E_i\ge 5` },
    ],
  },
  {
    title: "Input modeling — parameter estimates (slides)",
    bullets: [
      "Used before GOF tests (fit parameters from data).",
      "α is the Poisson mean parameter in slides.",
    ],
    formulas: [
      { label: "Poisson", latex: String.raw`\alpha=\bar{X}` },
      { label: "Exponential", latex: String.raw`\lambda=\frac{1}{\bar{X}}` },
      { label: "Normal", latex: String.raw`\mu=\bar{X},\quad \sigma^2=S^2` },
      {
        label: "Poisson pmf",
        latex: String.raw`P(X=x)=f(x)=\frac{e^{-\lambda}\lambda^x}{x!}`,
      },
    ],
  },
  {
    title: "Kolmogorov–Smirnov (K–S)",
    bullets: [
      "Goal: compare empirical CDF Fn to target F.",
      "Slides: K–S is more powerful and can be applied to smaller instances.",
      "Uniform RNG test: compute D+, D−, then D=max(D+,D−).",
    ],
    formulas: [
      { label: "General KS", latex: String.raw`D_n=\sup_x|F_n(x)-F(x)|` },
      {
        label: "D+",
        latex: String.raw`D^+=\max_i\left(\frac{i}{n}-U_{(i)}\right)`,
      },
      {
        label: "D−",
        latex: String.raw`D^-=\max_i\left(U_{(i)}-\frac{i-1}{n}\right)`,
      },
      { label: "D", latex: String.raw`D=\max(D^+,D^-)` },
      { label: "Decision", latex: String.raw`\text{Reject if }D>D_{\alpha}` },
    ],
  },
  {
    title: "Kolmogorov / Input modeling — Q–Q plot (slides)",
    bullets: [
      "1) Sort data ascending: y1 ≤ y2 ≤ … ≤ yn.",
      "2) j is the rank (j=1 smallest, j=n largest).",
      "3) Compare yj to theoretical quantile F^{-1}((j-1/2)/n).",
    ],
    formulas: [
      {
        label: "Q–Q approx",
        latex: String.raw`y_j\approx F^{-1}\!\left(\frac{j-1/2}{n}\right)`,
      },
    ],
  },
  {
    title: "Random numbers — Uniformity (U[0,1])",
    bullets: ["Used as base RNG assumptions: uniform + independent."],
    formulas: [
      {
        label: "pdf",
        latex: String.raw`f(x)=\begin{cases}1&0\le x\le 1\\0&\text{otherwise}\end{cases}`,
      },
      { label: "Mean", latex: String.raw`E[X]=\frac{1}{2}` },
      { label: "Variance", latex: String.raw`V[X]=\frac{1}{12}` },
    ],
  },
];

const PAGE_4: Section[] = [
  {
    title: "Confidence Interval — mean output (simulation)",
    bullets: [
      "Goal: mean + uncertainty.",
      "Steps: run n replications → compute Ȳ, s² → CI = Ȳ ± t·s/√n.",
      "Half-width h = t·s/√n. Increase n until h ≤ target.",
    ],
    formulas: [
      {
        label: "Sample mean",
        latex: String.raw`\bar{Y}=\frac{1}{n}\sum_{i=1}^{n}Y_i`,
      },
      {
        label: "Sample variance",
        latex: String.raw`s^2=\frac{1}{n-1}\sum_{i=1}^{n}(Y_i-\bar{Y})^2`,
      },
      {
        label: "CI",
        latex: String.raw`\bar{Y}\pm t_{\alpha/2,n-1}\frac{s}{\sqrt{n}}`,
      },
      {
        label: "Half-width",
        latex: String.raw`h=t_{\alpha/2,n-1}\frac{s}{\sqrt{n}}`,
      },
    ],
  },
  {
    title: "Linear Congruential (Lehmer) + Multiplicative",
    bullets: [
      "Choose seed X0, modulus m, multiplier a, increment c.",
      "Generates integers in [0,m-1]. Convert to Ui in (0,1) by dividing by m.",
      "Multiplicative congruential is the special case c=0.",
    ],
    formulas: [
      { label: "LCG", latex: String.raw`X_{i+1}=(aX_i+c)\bmod m` },
      { label: "Uniform map", latex: String.raw`U_i=\frac{X_i}{m}` },
      { label: "Multiplicative (c=0)", latex: String.raw`X_{i+1}=aX_i\bmod m` },
    ],
  },
  {
    title: "Inverse Transform — Exponential (slides)",
    bullets: [
      "Given CDF: F(x)=1-e^{-lambda x} (x≥0).",
      "Set F(X)=R and solve for X.",
      "Slides note: ln(1−R) can be replaced by ln(R) since both are U(0,1).",
    ],
    formulas: [
      {
        label: "PDF",
        latex: String.raw`f(x)=\lambda e^{-\lambda x},\quad x\ge 0`,
      },
      { label: "CDF", latex: String.raw`F(x)=1-e^{-\lambda x},\quad x\ge 0` },
      { label: "Set F(X)=R", latex: String.raw`R=1-e^{-\lambda X}` },
      { label: "Solve", latex: String.raw`X=-\frac{1}{\lambda}\ln(1-R)` },
      { label: "Common form", latex: String.raw`X=-\frac{1}{\lambda}\ln(R)` },
    ],
  },
  {
    title: "Poisson variate generation — acceptance / Knuth steps (slides)",
    bullets: [
      "Step 1: compute e^{-lambda}.",
      "Step 2: set n=0 and P=1.",
      "Step 3: generate uniform R_{n+1}; set P := P·R_{n+1}.",
      "Step 4: if P < e^{-lambda}, accept N=n; else n := n+1 and repeat step 3.",
      "Slide note: expected # of RN to generate 1 Poisson variate is λ+1.",
    ],
    formulas: [
      { label: "Threshold", latex: String.raw`T=e^{-\lambda}` },
      { label: "Init", latex: String.raw`n=0,\;P=1` },
      { label: "Update", latex: String.raw`P\leftarrow P\cdot R_{n+1}` },
      { label: "Accept", latex: String.raw`\text{If }P<T\text{ then }N=n` },
      { label: "Expected RN", latex: String.raw`E[\#RN]=\lambda+1` },
    ],
  },
  {
    title: "Autocorrelation test (slides) — independence",
    bullets: [
      "Compute autocorrelation ρ_{i,m} for lag m starting at i:",
      "Use sequence: (R_i, R_{i+m}, R_{i+2m}, …, R_{i+(M+1)m}).",
      "Choose M largest so i+(M+1)m ≤ N.",
      "When M is large, Z0 is approximately N(0,1).",
    ],
    formulas: [
      {
        label: "Test statistic",
        latex: String.raw`Z_0=\frac{\rho_{i,m}}{\sigma_{\rho_{i,m}}}`,
      },
      { label: "Approx dist (large M)", latex: String.raw`Z_0\sim N(0,1)` },
    ],
  },
];

const PAGES: { label: string; sections: Section[] }[] = [
  { label: "Page 1", sections: PAGE_1 },
  { label: "Page 2", sections: PAGE_2 },
  { label: "Page 3", sections: PAGE_3 },
  { label: "Page 4", sections: PAGE_4 },
];

export default function CheatSheet() {
  const onPrint = () => window.print();

  return (
    <div className="min-h-screen bg-gradient-surface">
      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-6xl space-y-4">
          <div className="flex items-center justify-between gap-3 no-print">
            <Button variant="ghost" asChild className="gap-2">
              <Link to="/formulas">
                <ArrowLeft className="h-4 w-4" />
                Back to Formulas
              </Link>
            </Button>

            <Button onClick={onPrint} className="gap-2">
              <Printer className="h-4 w-4" />
              Print / Save PDF
            </Button>
          </div>

          <div className="mx-auto w-full max-w-[8.5in] space-y-4 print:space-y-0">
            {PAGES.map((p, idx) => (
              <div key={p.label}>
                <PrintPage label={p.label} sections={p.sections} />
                {idx < PAGES.length - 1 ? <div className="page-break" /> : null}
              </div>
            ))}
          </div>
        </div>
      </main>

      <style>{`
        @media print {
          @page { size: letter; margin: 0.35in; }
          .no-print { display: none !important; }
          .page-break { break-after: page; page-break-after: always; }
          body { background: white !important; }
        }
      `}</style>
    </div>
  );
}

function PrintPage({
  label,
  sections,
}: {
  label: string;
  sections: Section[];
}) {
  return (
    <Card className="p-4 bg-white text-black print:shadow-none">
      <div className="flex items-baseline justify-between mb-2">
        <div className="text-xs font-semibold">NET4001 Cheat Sheet</div>
        <div className="text-[10px] text-muted-foreground print:text-black/70">
          {label}
        </div>
      </div>

      <Separator className="my-2" />

      <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-2">
        {sections.map((s) => (
          <CheatSection key={s.title} s={s} />
        ))}
      </div>
    </Card>
  );
}

function CheatSection({ s }: { s: Section }) {
  return (
    <div className="rounded-md border p-2">
      <div className="text-[11px] font-semibold leading-tight">{s.title}</div>

      <ul className="mt-1 space-y-0.5 text-[10px] leading-tight text-black/80">
        {s.bullets.map((b) => (
          <li key={b}>• {b}</li>
        ))}
      </ul>

      <Separator className="my-1.5" />

      <div className="space-y-1">
        {s.formulas.map((f) => (
          <div key={f.label} className="text-[10px] leading-tight">
            <div className="font-medium">{f.label}</div>
            <div className="mt-0.5">
              <Math latex={f.latex} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
