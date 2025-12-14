import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Bug, CheckCircle2, Calendar } from "lucide-react";
import { Header } from "@/components/layout/Header";

const Formulas = () => {
  return (
    <div className="min-h-screen bg-gradient-surface">
      <Header
        title="Formulas for the Cheat Sheet"
        subtitle="View all important formulas & concepts"
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

          <div className="space-y-4"></div>
        </div>
      </main>
    </div>
  );
};

export default Formulas;
