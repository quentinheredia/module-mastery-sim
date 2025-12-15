import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Printer, Info } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Math } from "@/components/math/Math";

type FormulaLine = {
  label: string;
  latex: string;
};

type Block = {
  title: string;
  steps?: string[];
  formulas?: FormulaLine[];
};

const CheatSheet = () => {
  const onPrint = () => window.print();

  const page1: Block[] = [
    {
      title: "Queueing Basics",
      steps: [
        "Identify λ (arrival rate) and μ (service rate).",
        "Compute utilization ρ and confirm stability.",
        "Use Little’s Law to move between L and W.",
      ],
      formulas: [
        { label: "Utilization", latex: String.raw`\rho=\frac{\lambda}{\mu}` },
        { label: "Stability", latex: String.raw`\rho<1` },
        {
          label: "Little’s Law",
          latex: String.raw`L=\lambda W,\quad L_q=\lambda W_q`,
        },
      ],
    },
    {
      title: "M/M/1",
      steps: ["Compute ρ = λ/μ", "Use direct formulas for L, Lq, W, Wq"],
      formulas: [
        { label: "P₀", latex: String.raw`P_0=1-\rho` },
        { label: "Pₙ", latex: String.raw`P_n=(1-\rho)\rho^n` },
        { label: "L", latex: String.raw`L=\frac{\rho}{1-\rho}` },
        { label: "Lq", latex: String.raw`L_q=\frac{\rho^2}{1-\rho}` },
        { label: "W", latex: String.raw`W=\frac{1}{\mu-\lambda}` },
        {
          label: "Wq",
          latex: String.raw`W_q=\frac{\lambda}{\mu(\mu-\lambda)}`,
        },
      ],
    },
    {
      title: "Blocking Probability / Erlang B & C",
      steps: [
        "Compute offered load A = λ/μ in Erlangs.",
        "Erlang B → loss system (no queue).",
        "Erlang C → waiting system (queue allowed).",
      ],
      formulas: [
        {
          label: "Traffic (Erlang)",
          // IMPORTANT: escape # if you ever include it
          latex: String.raw`\text{Traffic (Erlang)}=\text{average number of busy channels during 1 hour}`,
        },
        { label: "Offered load", latex: String.raw`A=\frac{\lambda}{\mu}` },
        {
          label: "Erlang B",
          latex: String.raw`B(k,A)=\frac{\frac{A^k}{k!}}{\sum_{i=0}^{k}\frac{A^i}{i!}}`,
        },
        {
          label: "Erlang C",
          latex: String.raw`C(k,A)=\frac{\frac{A^k}{k!}\frac{k}{k-A}}{\sum_{i=0}^{k-1}\frac{A^i}{i!}+\frac{A^k}{k!}\frac{k}{k-A}}`,
        },
      ],
    },
  ];

  const page2: Block[] = [
    {
      title: "PDF / CDF + Inverse Transform",
      steps: [
        "Start from the CDF F(x)=P(X≤x).",
        "Generate U ~ Uniform(0,1).",
        "Compute X = F⁻¹(U).",
      ],
      formulas: [
        { label: "CDF", latex: String.raw`F(x)=P(X\le x)` },
        { label: "PDF", latex: String.raw`f(x)=\frac{d}{dx}F(x)` },
        { label: "Inverse Transform", latex: String.raw`X=F^{-1}(U)` },
        {
          label: "Exponential sample",
          latex: String.raw`X=-\frac{1}{\lambda}\ln(1-U)`,
        },
      ],
    },
    {
      title: "Linear Congruential / Multiplicative RNG",
      steps: [
        "Pick (a,c,m) + seed X0.",
        "Generate Xi+1 = (aXi + c) mod m.",
        "Convert to Ui = Xi/m.",
      ],
      formulas: [
        { label: "LCG", latex: String.raw`X_{i+1}=(aX_i+c)\bmod m` },
        { label: "Uniform map", latex: String.raw`U_i=\frac{X_i}{m}` },
        {
          label: "Multiplicative (c=0)",
          latex: String.raw`X_{i+1}=aX_i\bmod m`,
        },
      ],
    },
    {
      title: "Chi-Square Goodness-of-Fit",
      steps: [
        "Choose bins/classes.",
        "Compute observed Oi and expected Ei.",
        "Compute χ² and compare to χ² critical value.",
      ],
      formulas: [
        {
          label: "Statistic",
          latex: String.raw`\chi^2=\sum_{i=1}^{k}\frac{(O_i-E_i)^2}{E_i}`,
        },
      ],
    },
    {
      title: "Kolmogorov–Smirnov (K–S)",
      steps: [
        "Sort sample Ui into U(1)…U(n).",
        "Compute D+ and D−.",
        "D = max(D+, D−), compare to Dα.",
      ],
      formulas: [
        { label: "General KS", latex: String.raw`D_n=\sup_x|F_n(x)-F(x)|` },
        {
          label: "RNG KS form",
          latex: String.raw`D^+=\max_i\left(\frac{i}{n}-U_{(i)}\right),\quad D^-=\max_i\left(U_{(i)}-\frac{i-1}{n}\right),\quad D=\max(D^+,D^-)`,
        },
      ],
    },
    {
      title: "Confidence Interval (Mean)",
      steps: [
        "Run n replications → Yi.",
        "Compute mean Ȳ and sample std dev s.",
        "CI: Ȳ ± t*s/√n (half-width h).",
      ],
      formulas: [
        {
          label: "Mean",
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
          label: "Half width",
          latex: String.raw`h=t_{\alpha/2,n-1}\frac{s}{\sqrt{n}}`,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-surface">
      <Header
        title="NET4001 Cheat Sheet"
        subtitle="Printable two-page cheat sheet (double sided)"
      />

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

          <Card className="p-4">
            <div className="flex items-start gap-2 text-xs text-muted-foreground no-print">
              <Info className="h-4 w-4 mt-[1px]" />
              <p>
                If LaTeX includes a <span className="font-mono">#</span>, escape
                it like <span className="font-mono">\\#</span> or KaTeX will
                fail.
              </p>
            </div>

            <Separator className="my-4 no-print" />

            <div className="mx-auto w-full max-w-[8.5in] space-y-6 print:space-y-0">
              <PrintPage pageLabel="Page 1 (Front)" blocks={page1} />
              <div className="page-break" />
              <PrintPage pageLabel="Page 2 (Back)" blocks={page2} />
            </div>
          </Card>
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
};

function PrintPage({
  pageLabel,
  blocks,
}: {
  pageLabel: string;
  blocks: Block[];
}) {
  return (
    <div className="rounded-xl border bg-white p-6 text-black shadow-sm print:shadow-none">
      <div className="flex items-baseline justify-between mb-3">
        <div className="text-sm font-semibold">NET4001 Cheat Sheet</div>
        <div className="text-xs text-muted-foreground print:text-black/70">
          {pageLabel}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-4">
        {blocks.map((b) => (
          <Section key={b.title} block={b} />
        ))}
      </div>
    </div>
  );
}

function Section({ block }: { block: Block }) {
  return (
    <div className="rounded-lg border p-3">
      <div className="font-semibold text-sm">{block.title}</div>

      {block.steps?.length ? (
        <ul className="mt-2 space-y-1 text-xs leading-snug text-black/80">
          {block.steps.map((s) => (
            <li key={s}>• {s}</li>
          ))}
        </ul>
      ) : null}

      {block.formulas?.length ? (
        <>
          <Separator className="my-3" />
          <div className="space-y-2">
            {block.formulas.map((f) => (
              <div key={f.label} className="text-xs">
                <div className="font-medium">{f.label}</div>
                <div className="mt-1">
                  <Math latex={f.latex} />
                </div>
              </div>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

export default CheatSheet;
