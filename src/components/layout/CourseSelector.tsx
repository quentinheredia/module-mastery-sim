import { useCourse } from "@/contexts/CourseContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GraduationCap } from "lucide-react";
import { CourseColor } from "@/types/quiz";

const courseColorClasses: Record<CourseColor, { bg: string; text: string; border: string; dot: string }> = {
  blue: {
    bg: "bg-[hsl(var(--course-blue-light))]",
    text: "text-[hsl(var(--course-blue))]",
    border: "border-[hsl(var(--course-blue)/0.3)]",
    dot: "bg-[hsl(var(--course-blue))]",
  },
  violet: {
    bg: "bg-[hsl(var(--course-violet-light))]",
    text: "text-[hsl(var(--course-violet))]",
    border: "border-[hsl(var(--course-violet)/0.3)]",
    dot: "bg-[hsl(var(--course-violet))]",
  },
  emerald: {
    bg: "bg-[hsl(var(--course-emerald-light))]",
    text: "text-[hsl(var(--course-emerald))]",
    border: "border-[hsl(var(--course-emerald)/0.3)]",
    dot: "bg-[hsl(var(--course-emerald))]",
  },
  amber: {
    bg: "bg-[hsl(var(--course-amber-light))]",
    text: "text-[hsl(var(--course-amber))]",
    border: "border-[hsl(var(--course-amber)/0.3)]",
    dot: "bg-[hsl(var(--course-amber))]",
  },
  rose: {
    bg: "bg-[hsl(var(--course-rose-light))]",
    text: "text-[hsl(var(--course-rose))]",
    border: "border-[hsl(var(--course-rose)/0.3)]",
    dot: "bg-[hsl(var(--course-rose))]",
  },
};

export const CourseSelector = () => {
  const { courses, activeCourse, setActiveCourse } = useCourse();

  if (!activeCourse) return null;

  const activeColors = courseColorClasses[activeCourse.color];

  return (
    <div className="flex items-center gap-3">
      <div className="hidden md:flex items-center gap-2 text-muted-foreground">
        <GraduationCap className="h-4 w-4" />
        <span className="text-sm">Course:</span>
      </div>
      <Select value={activeCourse.id} onValueChange={setActiveCourse}>
        <SelectTrigger 
          className={`w-[180px] h-10 rounded-xl border ${activeColors.border} ${activeColors.bg} backdrop-blur-sm hover:opacity-90 transition-all duration-300 focus:ring-primary/30`}
        >
          <div className="flex items-center gap-2">
            <div className={`h-2.5 w-2.5 rounded-full ${activeColors.dot}`} />
            <SelectValue />
          </div>
        </SelectTrigger>
        <SelectContent className="rounded-xl border-border/50 bg-popover/95 backdrop-blur-md shadow-elevation-lg">
          {courses.map((course) => {
            const colors = courseColorClasses[course.color];
            return (
              <SelectItem 
                key={course.id} 
                value={course.id}
                className="rounded-lg cursor-pointer transition-colors duration-200 focus:bg-muted"
              >
                <div className="flex items-center gap-3 py-1">
                  <div className={`h-3 w-3 rounded-full ${colors.dot}`} />
                  <div className="flex flex-col items-start">
                    <span className={`font-semibold font-display ${colors.text}`}>{course.name}</span>
                    <span className="text-xs text-muted-foreground line-clamp-1 max-w-[180px]">
                      {course.description}
                    </span>
                  </div>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};

export { courseColorClasses };
