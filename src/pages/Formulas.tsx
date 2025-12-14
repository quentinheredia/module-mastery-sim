import { Link } from "react-router-dom";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { ArrowLeft, Search } from "lucide-react";
import { Header } from "@/components/layout/Header";

import {
  NET4001_FORMULA_SECTIONS,
  NET4001_SURVIVAL_KIT_IDS,
  NET4001_AUDIT_FINDINGS,
  type FormulaItem,
} from "@/assets/data/net4001/formulas";

const normalize = (s: string) => s.toLowerCase().trim();

const Formulas = () => {
  const [q, setQ] = useState("");

  const allFormulas = useMemo(() => {
    return NET4001_FORMULA_SECTIONS.flatMap((sec) =>
      sec.formulas.map((f) => ({
        sectionId: sec.id,
        sectionTitle: sec.title,
        ...f,
      }))
    );
  }, []);

  const filteredSections = useMemo(() => {
    const query = normalize(q);
    if (!query) return NET4001_FORMULA_SECTIONS;

    return NET4001_FORMULA_SECTIONS.map((sec) => {
      const formulas = sec.formulas.filter((f) => {
        const hay = [
          f.name,
          f.explanation,
          f.latex,
          f.source.pdf,
          f.source.slide,
          ...(f.tags ?? []),
          ...(f.relatedTopics ?? []),
          ...(f.purpose ?? []),
        ]
          .join(" ")
          .toLowerCase();

        return hay.includes(query);
      });

      return { ...sec, formulas };
    }).filter((sec) => sec.formulas.length > 0);
  }, [q]);

  const indexRows = useMemo(() => {
    return allFormulas.map((f) => ({
      id: f.id,
      name: f.name,
      description: f.explanation,
      slide: f.source.slide,
      pdf: f.source.pdf,
      deps: (f.dependencies ?? []).join(", "),
      related: (f.relatedTopics ?? []).join(", "),
    }));
  }, [allFormulas]);

  const survivalKit = useMemo(() => {
    const set = new Set(NET4001_SURVIVAL_KIT_IDS);
    return allFormulas.filter((f) => set.has(f.id));
  }, [allFormulas]);

  return (
    <div className="min-h-screen bg-gradient-surface">
      <Header
        title="Formulas for the Cheat Sheet"
        subtitle="Searchable NET4001 formulas, models, and simulation statistics"
      />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between gap-3">
            <Button variant="ghost" asChild className="gap-2">
              <Link to="/">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>

            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search: Little’s Law, LCG, CI, K-S, M/M/1…"
                className="pl-9"
              />
            </div>
          </div>

          <Tabs defaultValue="cheatsheet" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="cheatsheet">Cheat Sheet</TabsTrigger>
              <TabsTrigger value="index">Index</TabsTrigger>
              <TabsTrigger value="audit">Audit</TabsTrigger>
              <TabsTrigger value="survival">Survival Kit</TabsTrigger>
            </TabsList>

            {/* CHEAT SHEET */}
            <TabsContent value="cheatsheet" className="space-y-4">
              {filteredSections.map((sec) => (
                <Card key={sec.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold">{sec.title}</h2>
                      {sec.description ? (
                        <p className="text-sm text-muted-foreground mt-1">
                          {sec.description}
                        </p>
                      ) : null}
                    </div>
                    <Badge variant="secondary">
                      {sec.formulas.length} item
                      {sec.formulas.length === 1 ? "" : "s"}
                    </Badge>
                  </div>

                  <Separator className="my-4" />

                  <Accordion type="multiple" className="w-full">
                    {sec.formulas.map((f) => (
                      <AccordionItem key={f.id} value={f.id}>
                        <AccordionTrigger className="text-left">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium">{f.name}</span>
                              {(f.tags ?? []).slice(0, 4).map((t) => (
                                <Badge key={t} variant="outline">
                                  {t}
                                </Badge>
                              ))}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {f.source.pdf} • slide {f.source.slide}
                              {f.source.section ? ` • ${f.source.section}` : ""}
                            </div>
                          </div>
                        </AccordionTrigger>

                        <AccordionContent>
                          <FormulaBlock f={f} />
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </Card>
              ))}

              {filteredSections.length === 0 ? (
                <Card className="p-6 text-sm text-muted-foreground">
                  No matches. Try: <span className="font-mono">Little</span>,{" "}
                  <span className="font-mono">LCG</span>,{" "}
                  <span className="font-mono">CI</span>,{" "}
                  <span className="font-mono">K-S</span>.
                </Card>
              ) : null}
            </TabsContent>

            {/* INDEX */}
            <TabsContent value="index">
              <Card className="p-4">
                <h2 className="text-lg font-semibold">Formula Index</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Quick lookup table (name → slide/PDF + dependencies).
                </p>

                <div className="mt-4 overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Formula</TableHead>
                        <TableHead>Slide</TableHead>
                        <TableHead>PDF</TableHead>
                        <TableHead>Dependencies</TableHead>
                        <TableHead>Related</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {indexRows.map((r) => (
                        <TableRow key={r.id}>
                          <TableCell className="font-medium">
                            {r.name}
                          </TableCell>
                          <TableCell>{r.slide}</TableCell>
                          <TableCell className="whitespace-nowrap">
                            {r.pdf}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {r.deps || "—"}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {r.related || "—"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </TabsContent>

            {/* AUDIT */}
            <TabsContent value="audit" className="space-y-4">
              {NET4001_AUDIT_FINDINGS.map((a, idx) => (
                <Card key={idx} className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-semibold">{a.title}</h3>
                    <Badge
                      variant={
                        a.severity === "high"
                          ? "destructive"
                          : a.severity === "warn"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {a.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {a.detail}
                  </p>
                  <p className="text-sm mt-3">
                    <span className="font-medium">Suggestion:</span>{" "}
                    {a.suggestion}
                  </p>
                </Card>
              ))}
            </TabsContent>

            {/* SURVIVAL KIT */}
            <TabsContent value="survival" className="space-y-4">
              <Card className="p-4">
                <h2 className="text-lg font-semibold">Minimal Survival Kit</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  The “if I only memorize one page” set.
                </p>

                <Separator className="my-4" />

                <Accordion type="multiple" className="w-full">
                  {survivalKit.map((f) => (
                    <AccordionItem key={f.id} value={f.id}>
                      <AccordionTrigger className="text-left">
                        <div className="flex flex-col gap-1">
                          <div className="font-medium">{f.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {f.source.pdf} • slide {f.source.slide}
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <FormulaBlock f={f} compact />
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

function FormulaBlock({ f, compact }: { f: FormulaItem; compact?: boolean }) {
  return (
    <div className="space-y-3">
      <div className="rounded-lg border bg-background/60 p-3">
        <div className="text-xs text-muted-foreground mb-2">LaTeX</div>
        <pre className="text-sm font-mono whitespace-pre-wrap break-words">
          {f.latex}
        </pre>
      </div>

      <p className="text-sm">{f.explanation}</p>

      {!compact ? (
        <>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Purpose</Badge>
            <span className="text-sm text-muted-foreground">
              {f.purpose.join(" • ")}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Assumptions</Badge>
            <span className="text-sm text-muted-foreground">
              {f.assumptions.join(" • ")}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">Variables</Badge>
              <span className="text-xs text-muted-foreground">
                ({f.source.pdf} • slide {f.source.slide})
              </span>
            </div>
            <div className="grid gap-2">
              {f.variables.map((v) => (
                <div
                  key={v.symbol}
                  className="flex items-start justify-between gap-3 rounded-md border p-2"
                >
                  <span className="font-mono text-sm">{v.symbol}</span>
                  <span className="text-sm text-muted-foreground flex-1">
                    {v.meaning}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Example problems</Badge>
            <span className="text-sm text-muted-foreground">
              {f.exampleTypes.join(" • ")}
            </span>
          </div>

          {f.dependencies?.length ? (
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Dependencies</Badge>
              <span className="text-sm text-muted-foreground">
                {f.dependencies.join(", ")}
              </span>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}

export default Formulas;
