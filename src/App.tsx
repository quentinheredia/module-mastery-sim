import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { QuizProvider } from "@/contexts/QuizContext";
import { CourseProvider } from "@/contexts/CourseContext";
import Home from "./pages/Home";
import Textbook from "./pages/Textbook";
import Formulas from "./pages/Formulas";
import CheatSheet from "@/pages/CheatSheet";
import Practice from "./pages/Practice";
import Exam from "./pages/Exam";
import Results from "./pages/Results";
import History from "./pages/History";
import BugFixes from "./pages/BugFixes";
import NotFound from "./pages/NotFound";
import { GlobalUpdateBanner } from "@/components/system/GlobalUpdateBanner";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light">
      <CourseProvider>
        <QuizProvider>
          <TooltipProvider>
            {/* 🔔 Global build-based update banner */}
            <GlobalUpdateBanner />

            <Toaster />
            <Sonner />

            <BrowserRouter basename={import.meta.env.BASE_URL}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/practice" element={<Practice />} />
                <Route path="textbook" element={<Textbook />} />
                <Route path="/formulas" element={<Formulas />} />
                <Route path="/formulas/cheatsheet" element={<CheatSheet />} />
                <Route path="/exam" element={<Exam />} />
                <Route path="/results" element={<Results />} />
                <Route path="/history" element={<History />} />
                <Route path="/bug-fixes" element={<BugFixes />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </QuizProvider>
      </CourseProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
