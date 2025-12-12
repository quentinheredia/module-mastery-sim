import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { CourseSelector, courseColorClasses } from "./CourseSelector";
import { useCourse } from "@/contexts/CourseContext";
import { CourseColor } from "@/types/quiz";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export const Header = ({ title, subtitle, children }: HeaderProps) => {
  const { theme, setTheme } = useTheme();
  const { activeCourse } = useCourse();
  
  const courseColors = activeCourse ? courseColorClasses[activeCourse.color as CourseColor] : null;

  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-card/80 backdrop-blur-md supports-[backdrop-filter]:bg-card/60">
      {/* Course color accent bar */}
      {courseColors && (
        <div className={`h-1 w-full ${courseColors.dot}`} />
      )}
      
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="space-y-1">
            <h1 className={`text-2xl font-bold font-display ${courseColors?.text || 'text-primary'}`}>
              {title || `${activeCourse?.name || ''} Practice Exam`}
            </h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div className="hidden sm:block">
            <CourseSelector />
          </div>
        </div>
        <div className="flex items-center gap-3">
          {children}
          <Button
            variant="outline"
            size="icon"
            className="rounded-xl border-border/50 bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-all duration-300"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 text-warning" />
            ) : (
              <Moon className="h-5 w-5 text-primary" />
            )}
          </Button>
        </div>
      </div>
      {/* Mobile course selector */}
      <div className="sm:hidden border-t border-border/50 px-4 py-2 bg-muted/30">
        <CourseSelector />
      </div>
    </header>
  );
};
