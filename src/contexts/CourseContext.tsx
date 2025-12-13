import React, { createContext, useContext, useState, useEffect } from "react";
import { Course } from "@/types/quiz";

interface CourseContextType {
  courses: Course[];
  activeCourse: Course | null;
  setActiveCourse: (courseId: string) => void;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

const STORAGE_KEY = "active_course";

// Define available courses with color coding
const AVAILABLE_COURSES: Course[] = [
  {
    id: "net4009",
    name: "NET4009",
    description: "Troubleshooting IP",
    color: "blue",
    modules: [
      "Module 1 - Basic Forwarding & Troubleshooting",
      "Module 2 - Troubleshooting EIGRPv4/v6",
      "Module 3 - Troubleshooting OSPFv3",
      "Module 4 - Troubleshooting BGP",
      "Module 5 - Conditional Forwarding and Redistribution",
      "Module 6 - DMVPN & Troubleshooting GRE",
      "Module 7 - Infra-Security Management Tools",
      "Module 8 - VRF Lite",
    ],
  },
  {
    id: "net4005",
    name: "NET4005",
    description: "Networked Applications",
    color: "violet",
    modules: [
      "Crypto/TLS",
      "Application Layer Protocols",
      "Cloud Computing",
      "Software Defined Networking (SDN)",
    ],
  },
  {
    id: "net3008",
    name: "NET3008",
    description: "Advanced Routing",
    color: "emerald",
    modules: [
      "Module 1a - EIGRP Basics",
      "Module 1b - Advanced EIGRP",
      "Module 1c - EIGRPv6",
      "Module 2b - OSPFv2 Advanced",
      "Module 2c - OSPFv3",
      "Module 3a - BGP Basics",
      "Module 3b - Advanced BGP",
      "Module 3c - BGP Path Selection",
      "Module 4 - Routing Protocols Redistribution",
      "Module 5 - IS-IS Routing",
      "Module 6 - Route Maps & PBR",
    ],
  },
  {
    id: "net4001",
    name: "NET4001",
    description: "Network Simulation",
    color: "amber",
    modules: [
      "Inverse Transform Method",
      "Random Number Generation",
      "Queueing Theory",
      "Chi-Square Test",
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
