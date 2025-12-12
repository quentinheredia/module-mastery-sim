import React, { createContext, useContext, useState, useEffect } from "react";
import { Course } from "@/types/quiz";

interface CourseContextType {
  courses: Course[];
  activeCourse: Course | null;
  setActiveCourse: (courseId: string) => void;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

const STORAGE_KEY = "active_course";

// Define available courses
const AVAILABLE_COURSES: Course[] = [
  {
    id: "net4009",
    name: "NET4009",
    description: "CCNP ENARSI - Advanced Routing & Services",
    modules: [
      "Module 1 - Basic Forwarding & Troubleshooting",
      "Module 2 - Troubleshooting EIGRPv4/v6",
      "Module 3 - Troubleshooting OSPFv3",
      "Module 4 - Troubleshooting BGP",
      "Module 5 - Conditional Forwarding and Redistribution",
    ],
  },
  {
    id: "net4005",
    name: "NET4005",
    description: "Network Security & Cloud Fundamentals",
    modules: [
      "Crypto/TLS",
      "Application Layer Protocols",
      "Cloud Computing",
      "Software Defined Networking (SDN)",
    ],
  },
];

export const CourseProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [activeCourse, setActiveCourseState] = useState<Course | null>(null);

  // Load saved course on mount
  useEffect(() => {
    const savedCourseId = localStorage.getItem(STORAGE_KEY);
    const course = AVAILABLE_COURSES.find(c => c.id === savedCourseId) || AVAILABLE_COURSES[0];
    setActiveCourseState(course);
  }, []);

  const setActiveCourse = (courseId: string) => {
    const course = AVAILABLE_COURSES.find(c => c.id === courseId);
    if (course) {
      setActiveCourseState(course);
      localStorage.setItem(STORAGE_KEY, courseId);
    }
  };

  return (
    <CourseContext.Provider
      value={{
        courses: AVAILABLE_COURSES,
        activeCourse,
        setActiveCourse,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};

export const useCourse = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error("useCourse must be used within CourseProvider");
  }
  return context;
};
