import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Bug, CheckCircle2, Calendar } from "lucide-react";
import { Header } from "@/components/layout/Header";

interface BugFix {
  date: string;
  title: string;
  description: string;
  status: "fixed" | "known";
}

const bugFixes: BugFix[] = [
  {
    date: "2025-12-17",
    title: "Fixed EIGRP Auth Question",
    description:
      "Customer enabled EIGRPv4 with authentication between two routers, however neighbor adjacency is not established. Which two authentication parameters need to match in EIGRPv4 authentication configuration? [Key ID, Key String, Key Chain]",
    status: "fixed",
  },
  {
    date: "2025-12-14",
    title: "Fixed Multi-Selection Bug in 4009",
    description:
      "Fixed issue where multiple answer selection questions in 4009 only allowed you to select 1.",
    status: "fixed",
  },
  {
    date: "2025-12-14",
    title:
      "Added formula sheet section to 4001, added search bar for formulas.",
    description:
      "Added formulas sorted by concept by slide deck. Added slide deck references to the formulas. Survial Kit includes what you should know or have written down to pass.",
    status: "fixed",
  },
  {
    date: "2025-12-13",
    title: "Fixed page refresh losing base URL",
    description:
      "Fixed GitHub Pages SPA routing issue where refreshing on any page other than the home page would lose the /module-mastery-sim/ base path.",
    status: "fixed",
  },
  {
    date: "2025-12-13",
    title: "Added 42 new Crypto/TLS questions",
    description:
      "Added comprehensive questions covering TLS 1.3 handshake, IPsec (modes, AH/ESP, SAs, IKE), WiFi/LTE/5G authentication, and firewalls/IDS. NET4005 Crypto module now has 63 total questions.",
    status: "fixed",
  },
  {
    date: "2025-12-13",
    title: "Added 30 Cloud Computing questions",
    description:
      "New questions covering IaaS/PaaS/SaaS, bare metal vs VMs vs containers, container lifecycle, Flask basics, and orchestration concepts.",
    status: "fixed",
  },
  {
    date: "2025-12-13",
    title: "Added 30 SDN questions",
    description:
      "New questions covering traditional vs SDN control planes, OpenFlow messages, controller architecture (OpenDaylight, ONOS), and SDN benefits.",
    status: "fixed",
  },
  {
    date: "2025-12-13",
    title: "Added 15 DNS/Application Layer questions",
    description:
      "New questions covering DNS hierarchy, caching, record types, security (DNSSEC, poisoning, amplification attacks).",
    status: "fixed",
  },
  {
    date: "2025-12-13",
    title: "Fixed matching question correct answers display",
    description:
      "Fixed an issue where some matching questions showed pair descriptions as correct answers instead of the actual options.",
    status: "fixed",
  },
  {
    date: "2024-12-12",
    title: "Matching questions now allow option reuse",
    description:
      "Fixed an issue where matching questions with more pairs than options couldn't be completed because options couldn't be selected more than once.",
    status: "fixed",
  },
  {
    date: "2024-12-12",
    title: "Removed duplicate questions from NET4005",
    description:
      "Removed 11 duplicate or very similar questions across Cloud, SDN, and Crypto modules.",
    status: "fixed",
  },
];

const BugFixes = () => {
  return (
    <div className="min-h-screen bg-gradient-surface">
      <Header
        title="Bug Fixes & Updates"
        subtitle="Track recent changes and fixes"
      />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <Button variant="ghost" asChild className="gap-2">
              <Link to="/">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>

          <div className="space-y-4">
            {bugFixes.length === 0 ? (
              <Card variant="glass" className="p-8 text-center">
                <Bug className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  No bug fixes recorded yet.
                </p>
              </Card>
            ) : (
              bugFixes.map((fix, index) => (
                <Card
                  key={index}
                  variant="elevated"
                  className="p-6 animate-fade-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        fix.status === "fixed"
                          ? "bg-success/10 text-success"
                          : "bg-warning/10 text-warning"
                      }`}
                    >
                      {fix.status === "fixed" ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <Bug className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <h3 className="font-semibold font-display">
                          {fix.title}
                        </h3>
                        <Badge
                          variant={
                            fix.status === "fixed" ? "default" : "secondary"
                          }
                          className={
                            fix.status === "fixed"
                              ? "bg-success text-success-foreground"
                              : ""
                          }
                        >
                          {fix.status === "fixed" ? "Fixed" : "Known Issue"}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm mb-2">
                        {fix.description}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{fix.date}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BugFixes;
