import React from "react";
import { scenarios } from "@/assets/data/net4011/scenarios";
import { ScenarioCard } from "./ScenarioCard";

export const ScenariosList: React.FC = () => {
  return (
    <div className="space-y-4">
      {scenarios.map((scenario) => (
        <ScenarioCard key={scenario.id} scenario={scenario} />
      ))}
    </div>
  );
};
