import { useCourse } from "@/contexts/CourseContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GraduationCap, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const CourseSelector = () => {
  const { courses, activeCourse, setActiveCourse } = useCourse();

  if (!activeCourse) return null;

  return (
    <div className="flex items-center gap-3">
      <div className="hidden md:flex items-center gap-2 text-muted-foreground">
        <GraduationCap className="h-4 w-4" />
        <span className="text-sm">Course:</span>
      </div>
      <Select value={activeCourse.id} onValueChange={setActiveCourse}>
        <SelectTrigger className="w-[160px] h-10 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-all duration-300 focus:ring-primary/30">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="rounded-xl border-border/50 bg-popover/95 backdrop-blur-md shadow-elevation-lg">
          {courses.map((course) => (
            <SelectItem 
              key={course.id} 
              value={course.id}
              className="rounded-lg cursor-pointer transition-colors duration-200 focus:bg-primary/10 focus:text-foreground data-[state=checked]:bg-primary/10"
            >
              <div className="flex items-center gap-3 py-1">
                <div className="flex flex-col items-start">
                  <span className="font-semibold font-display">{course.name}</span>
                  <span className="text-xs text-muted-foreground line-clamp-1 max-w-[180px]">
                    {course.description}
                  </span>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
