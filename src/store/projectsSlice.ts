/** @format */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Project {
  name: string;
  budget: number;
  profitability: number;
  hours: string;
  status: "over" | "warning" | "good";
  overBy: string;
}

interface ProjectsState {
  projects: Project[];
  totalProjects: number;
  completed: number;
  ongoing: number;
  delayed: number;
}

const initialState: ProjectsState = {
  projects: [],
  totalProjects: 5,
  completed: 1,
  ongoing: 3,
  delayed: 1,
};

export const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    // Add your reducers here
  },
});
