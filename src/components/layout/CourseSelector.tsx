import { useCourse } from "@/contexts/CourseContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup, // Added
  SelectLabel, // Added
} from "@/components/ui/select";
import { GraduationCap } from "lucide-react";
import { CourseColor } from "@/types/quiz";

const courseColorClasses: Record<
  CourseColor,
  {
    bg: string;
    text: string;
    border: string;
    dot: string;
    hover: string;
    hoverBg: string;
  }
> = {
  blue: {
    bg: "bg-[hsl(210_80%_95%)] dark:bg-[hsl(210_50%_20%)]",
    text: "text-[hsl(210_80%_45%)] dark:text-[hsl(210_80%_65%)]",
    border: "border-[hsl(210_80%_80%)] dark:border-[hsl(210_50%_35%)]",
    dot: "bg-[hsl(210_80%_48%)] dark:bg-[hsl(210_75%_55%)]",
    hover: "hover:bg-[hsl(210_80%_90%)] dark:hover:bg-[hsl(210_50%_25%)]",
    hoverBg:
      "group-hover:bg-[hsl(210_80%_90%)] dark:group-hover:bg-[hsl(210_50%_25%)]",
  },
  violet: {
    bg: "bg-[hsl(270_70%_95%)] dark:bg-[hsl(270_40%_20%)]",
    text: "text-[hsl(270_70%_50%)] dark:text-[hsl(270_70%_70%)]",
    border: "border-[hsl(270_70%_85%)] dark:border-[hsl(270_40%_35%)]",
    dot: "bg-[hsl(270_70%_55%)] dark:bg-[hsl(270_65%_60%)]",
    hover: "hover:bg-[hsl(270_70%_90%)] dark:hover:bg-[hsl(270_40%_25%)]",
    hoverBg:
      "group-hover:bg-[hsl(270_70%_90%)] dark:group-hover:bg-[hsl(270_40%_25%)]",
  },
  emerald: {
    bg: "bg-[hsl(160_70%_95%)] dark:bg-[hsl(160_40%_18%)]",
    text: "text-[hsl(160_70%_35%)] dark:text-[hsl(160_65%_55%)]",
    border: "border-[hsl(160_70%_80%)] dark:border-[hsl(160_40%_30%)]",
    dot: "bg-[hsl(160_70%_40%)] dark:bg-[hsl(160_65%_45%)]",
    hover: "hover:bg-[hsl(160_70%_90%)] dark:hover:bg-[hsl(160_40%_22%)]",
    hoverBg:
      "group-hover:bg-[hsl(160_70%_90%)] dark:group-hover:bg-[hsl(160_40%_22%)]",
  },
  amber: {
    bg: "bg-[hsl(38_90%_95%)] dark:bg-[hsl(38_50%_18%)]",
    text: "text-[hsl(38_90%_40%)] dark:text-[hsl(38_85%_60%)]",
    border: "border-[hsl(38_90%_80%)] dark:border-[hsl(38_50%_30%)]",
    dot: "bg-[hsl(38_90%_50%)] dark:bg-[hsl(38_85%_55%)]",
    hover: "hover:bg-[hsl(38_90%_90%)] dark:hover:bg-[hsl(38_50%_22%)]",
    hoverBg:
      "group-hover:bg-[hsl(38_90%_90%)] dark:group-hover:bg-[hsl(38_50%_22%)]",
  },
  rose: {
    bg: "bg-[hsl(350_75%_95%)] dark:bg-[hsl(350_45%_18%)]",
    text: "text-[hsl(350_75%_50%)] dark:text-[hsl(350_70%_65%)]",
    border: "border-[hsl(350_75%_85%)] dark:border-[hsl(350_45%_30%)]",
    dot: "bg-[hsl(350_75%_55%)] dark:bg-[hsl(350_70%_58%)]",
    hover: "hover:bg-[hsl(350_75%_90%)] dark:hover:bg-[hsl(350_45%_22%)]",
    hoverBg:
      "group-hover:bg-[hsl(350_75%_90%)] dark:group-hover:bg-[hsl(350_45%_22%)]",
  },
};

export const CourseSelector = () => {
  const { courses, activeCourse, setActiveCourse } = useCourse();

  if (!activeCourse) return null;

  // activeCourse is safe because the Context flattens it correctly
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
        <SelectContent className="rounded-xl border-border/50 bg-popover/95 backdrop-blur-md shadow-elevation-lg max-h-[500px]">
          {/* We now iterate over SEMESTERS first */}
          {courses.map((semester: any) => (
            <SelectGroup key={semester.id}>
              <SelectLabel className="pl-3 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                {semester.name}
              </SelectLabel>

              {/* Then we iterate over the COURSES inside the semester */}
              {semester.courses?.map((course: any) => {
                const colors = courseColorClasses[course.color as CourseColor];
                if (!colors) return null; // Safety check

                return (
                  <SelectItem
                    key={course.id}
                    value={course.id}
                    className="rounded-lg cursor-pointer transition-colors duration-200 focus:bg-muted ml-1"
                  >
                    <div className="flex items-center gap-3 py-1">
                      <div className={`h-3 w-3 rounded-full ${colors.dot}`} />
                      <div className="flex flex-col items-start">
                        <span
                          className={`font-semibold font-display ${colors.text}`}
                        >
                          {course.name}
                        </span>
                        <span className="text-xs text-muted-foreground line-clamp-1 max-w-[180px]">
                          {course.description}
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export { courseColorClasses };
