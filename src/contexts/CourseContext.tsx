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
// NOTE: You have changed this to a nested structure. You may need to update
// your 'Course' type definition to support the 'courses' property on the parent object.
const AVAILABLE_COURSES: any[] = [
  {
    id: "F25",
    name: "Fall 2025 Semester", // FIXED: Comma moved outside the quote
    description: "Courses for Fall 2025",
    courses: [
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
        /*
        Modules will need to updated to:
          Queueing Models
          RN Generation
          Random Variate Generation
          Input Modeling
          Verification & Validation
          Output Analysis
        */
        modules: [
          "Inverse Transform Method",
          "Random Number Generation",
          "Queueing Theory",
          "Chi-Square Test",
        ],
      },
      {
        id: "net4007",
        name: "NET4007",
        description: "DAJUN DA GOAT",
        color: "rose",
        modules: ["Take Home Exam"],
      },
    ],
  },
  {
    id: "W26",
    name: "Winter 2026 Semester",
    description: "Courses for Winter 2026",
    courses: [
      {
        id: "net3012",
        name: "NET3012",
        description: "MPLS & Services Architecture",
        color: "rose",
        modules: [],
      },
      {
        id: "net4011",
        name: "NET4011",
        description: "Advanced Net Security",
        color: "violet",
        modules: [],
      },
      {
        id: "net4010",
        name: "NET4010",
        description: "Secure Mobile Networks",
        color: "blue",
        modules: [],
      },
      {
        id: "net4000",
        name: "NET4000",
        description: "Emerging Net Technologies",
        color: "emerald",
        modules: [],
      },
      {
        id: "net4012",
        name: "NET4012",
        description: "Cloud Computing",
        color: "amber",
        modules: [],
      },
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

    // WARNING: Because you nested the courses inside "F25", a simple .find() on
    // AVAILABLE_COURSES will assume 'F25' is the course. You may need to flatten
    // the array here if you want to find specific sub-courses like 'net4009'.

    // Logic adapted to flatten courses for search:
    const allCourses = AVAILABLE_COURSES.flatMap((sem) => sem.courses || [sem]);

    const course =
      allCourses.find((c: any) => c.id === savedCourseId) || allCourses[0];

    setActiveCourseState(course);
  }, []);

  const setActiveCourse = (courseId: string) => {
    // Logic adapted to search within the nested structure
    const allCourses = AVAILABLE_COURSES.flatMap((sem) => sem.courses || [sem]);
    const course = allCourses.find((c: any) => c.id === courseId);

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
