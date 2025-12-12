import { useCourse } from "@/contexts/CourseContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookOpen } from "lucide-react";

export const CourseSelector = () => {
  const { courses, activeCourse, setActiveCourse } = useCourse();

  if (!activeCourse) return null;

  return (
    <div className="flex items-center gap-2">
      <BookOpen className="h-4 w-4 text-muted-foreground" />
      <Select value={activeCourse.id} onValueChange={setActiveCourse}>
        <SelectTrigger className="w-[140px] h-9">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {courses.map((course) => (
            <SelectItem key={course.id} value={course.id}>
              <div className="flex flex-col">
                <span className="font-medium">{course.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
