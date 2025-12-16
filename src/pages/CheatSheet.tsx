import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Printer } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Math } from "@/components/math/Math";

type Formula = { label: string; latex: string };
type Section = { title: string; bullets: string[]; formulas: Formula[] };

const PAGE_1: Section[] = [
  {
    title: "Queueing (M/M/1, M/M/k, M/M/1/K) — Step-by-step",
    bullets: [
      "Goal: compute P0, Pn, L, Lq, W, Wq, loss fraction.",
      "1) Identify model:",
      "   • Infinite buffer + 1 server → M/M/1",
      "   • Infinite buffer + k servers → M/M/k",
      "   • Finite capacity (buffer) → M/M/1/K (or loss system M/M/k/k)",
      "2) Extract givens: λ, μ (if mean service time E[S] given → μ=1/E[S]), k, K (if p waiting + 1 service → K=p+1).",
      "3) Compute utilization/stability:",
      "   • M/M/1: ρ=λ/μ must satisfy ρ<1",
      "   • k servers (per-server): u=λ/(kμ) must be <1",
      "4) Compute what you need (use closed forms if standard; otherwise use balance equations).",
      "5) Link with Little’s Law when jumping between L and W.",
    ],
    formulas: [
      {
        label: "Utilization (M/M/1)",
        latex: String.raw`\rho=\frac{\lambda}{\mu},\quad \rho<1`,
      },
      {
        label: "Per-server utilization",
        latex: String.raw`u=\frac{\lambda}{k\mu},\quad u<1`,
      },
      { label: "Mean service time", latex: String.raw`E[S]=\frac{1}{\mu}` },
      {
        label: "Little’s Law",
        latex: String.raw`L=\lambda W,\quad L_q=\lambda W_q`,
      },
      { label: "System vs queue time", latex: String.raw`W=W_q+\frac{1}{\mu}` },
    ],
  },

  {
    title: "M/M/1 (Infinite buffer) — Direct formulas",
    bullets: ["Steps: compute ρ=λ/μ → plug into P0, Pn, L, Lq, W, Wq."],
    formulas: [
      { label: "P0", latex: String.raw`P_0=1-\rho` },
      {
        label: "Pn",
        latex: String.raw`P_n=(1-\rho)\rho^n,\quad n=0,1,2,\dots`,
      },
      { label: "L", latex: String.raw`L=\frac{\rho}{1-\rho}` },
      { label: "Lq", latex: String.raw`L_q=\frac{\rho^2}{1-\rho}` },
      { label: "W", latex: String.raw`W=\frac{1}{\mu-\lambda}` },
      { label: "Wq", latex: String.raw`W_q=\frac{\lambda}{\mu(\mu-\lambda)}` },
    ],
  },

  {
    title: "M/M/1/K (Finite capacity) — Loss / drop",
    bullets: [
      "Use when: finite capacity K (includes service). If buffer has p waiting + 1 service → K=p+1.",
      "Steps: compute ρ → compute P0 → compute Pn → loss fraction typically PK (system full).",
    ],
    formulas: [
      { label: "P0", latex: String.raw`P_0=\frac{1-\rho}{1-\rho^{K+1}}` },
      { label: "Pn", latex: String.raw`P_n=\rho^nP_0,\quad n=0,1,\dots,K` },
      {
        label: "Loss fraction",
        latex: String.raw`\mathrm{Loss\ fraction}=P_K`,
      },
      {
        label: "Sheet-form loss (K=p+1)",
        latex: String.raw`P_{K=p+1}=\frac{(\lambda/\mu)^{p+1}\left(1-\lambda/\mu\right)}{1-(\lambda/\mu)^{p+2}}`,
      },
    ],
  },

  {
    title: "M/M/k Balance Equations (include these for exams)",
    bullets: [
      "State j = # in system. Write steady-state: rate leaving state j = rate entering state j.",
      "Use when: k servers OR state-dependent arrivals/service OR multi-type clients.",
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
    title: "State-dependent arrivals (multi-type clients) — Procedure",
    bullets: [
      "1) Define states j=0..K (finite) or j≥0 (infinite).",
      "2) For each state j compute λj from the rules (who is allowed to enter).",
      "3) Compute μj with k servers: μj = min(j,k)·μ.",
      "4) Use balance equations + recursion in terms of P0, then normalize ΣPj=1.",
      "5) Answer metrics: E[N]=Σ jPj; P(all servers busy)=Σ_{j≥k} Pj (or PK if finite).",
    ],
    formulas: [
      {
        label: "Departure rate by state",
        latex: String.raw`\mu_j=\min(j,k)\mu`,
      },
      {
        label: "Expected number in system",
        latex: String.raw`E[N]=\sum_j jP_j`,
      },
    ],
  },

  {
    title: "Blocking Probability / Erlang B & C",
    bullets: [
      "Erlang B (loss, no queue): blocked/dropped when all servers busy and no waiting room.",
      "Erlang C (queue allowed): arrivals can wait; compute probability of waiting.",
      "Design: try c=1,2,3… until B ≤ target (e.g., ≤1%).",
    ],
    formulas: [
      { label: "Offered load", latex: String.raw`A=\frac{\lambda}{\mu}` },
      {
        label: "Erlang B",
        latex: String.raw`B=\frac{A^c/c!}{\sum_{n=0}^{c}A^n/n!}`,
      },
      {
        label: "Erlang C (sheet form)",
        latex: String.raw`P_B=\frac{k\rho^kP_0}{k!(k-\rho)}`,
      },
    ],
  },
];

const PAGE_2: Section[] = [
  {
    title: "Chi-Square Goodness-of-Fit — Step-by-step",
    bullets: [
      "Goal: test if sample matches hypothesized distribution.",
      "1) Pick k bins/classes (merge if expected Ei too small).",
      "2) Observed Oi = count in bin i.",
      "3) Expected Ei = n·pi where pi from hypothesized CDF over bin i.",
      "4) Compute χ² and compare to χ² critical value (df from slides if used).",
    ],
    formulas: [
      { label: "Expected count", latex: String.raw`E_i=np_i` },
      {
        label: "Chi-square statistic",
        latex: String.raw`\chi^2=\sum_{i=1}^{k}\frac{(O_i-E_i)^2}{E_i}`,
      },
      { label: "Degrees of freedom (if used)", latex: String.raw`df=k-1-m` },
      {
        label: "Decision",
        latex: String.raw`\mathrm{Reject}\ H_0\ \mathrm{if}\ \chi^2>\chi^2_{\alpha,df}`,
      },
    ],
  },

  {
    title: "Kolmogorov–Smirnov (K–S) — Step-by-step",
    bullets: [
      "Goal: compare empirical CDF Fn to target F.",
      "1) Sort sample: X(1) ≤ … ≤ X(n).",
      "2) General: Dn = supx |Fn(x) − F(x)|.",
      "3) For uniform RNG test: sort U(i), compute D+, D−, then D=max(D+,D−).",
      "4) Reject if D > Dα (from slide/table).",
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
      { label: "Decision", latex: String.raw`\mathrm{Reject\ if}\ D>D_\alpha` },
    ],
  },

  {
    title: "Confidence Interval (Mean output) — Step-by-step",
    bullets: [
      "Goal: mean + uncertainty; choose n for target half-width if asked.",
      "1) Run n replications: Y1,…,Yn.",
      "2) Compute mean Ȳ and sample variance s².",
      "3) CI: Ȳ ± t * s/√n. Half-width h = t*s/√n.",
      "4) If need more runs: increase n until h ≤ target.",
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
    title: "Random Number Generation — LCG & Multiplicative",
    bullets: [
      "LCG steps: choose a,c,m and seed X0 → Xi+1=(aXi+c) mod m → Ui=Xi/m.",
      "Multiplicative generator is the same with c=0.",
    ],
    formulas: [
      { label: "LCG", latex: String.raw`X_{i+1}=(aX_i+c)\bmod m` },
      { label: "Uniform map", latex: String.raw`U_i=\frac{X_i}{m}` },
      { label: "Multiplicative (c=0)", latex: String.raw`X_{i+1}=aX_i\bmod m` },
    ],
  },

  {
    title: "Inverse Transform (PDF/CDF → sampling)",
    bullets: [
      "1) Get CDF F(x)=P(X≤x). If starting from PDF: f(x)=d/dx F(x).",
      "2) Generate U ~ Uniform(0,1).",
      "3) Invert: X = F^{-1}(U).",
      "Common exponential: X = -(1/λ) ln(1−U).",
    ],
    formulas: [
      { label: "CDF", latex: String.raw`F(x)=P(X\le x)` },
      { label: "PDF", latex: String.raw`f(x)=\frac{d}{dx}F(x)` },
      { label: "Inverse transform", latex: String.raw`X=F^{-1}(U)` },
      {
        label: "Exponential sample",
        latex: String.raw`X=-\frac{1}{\lambda}\ln(1-U)`,
      },
    ],
  },
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
            <PrintPage label="Page 1 (Front)" sections={PAGE_1} />
            <div className="page-break" />
            <PrintPage label="Page 2 (Back)" sections={PAGE_2} />
          </div>
        </div>
      </main>

      <style>{`
        @media print {
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
