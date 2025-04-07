/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type LecturePart =
  | "vocabulary"
  | "exercises"
  | "reading_practices"
  | "grammar"
  | "listening_practices"
  | "examination"
  | "references";

type LectureState = {
  data: {
    [lectureId: string]: {
      [key in LecturePart]?: any;
    };
  };
};

const initialState: LectureState = {
  data: {},
};

const lectureSlice = createSlice({
  name: "lecture",
  initialState,
  reducers: {
    saveLecturePart: (
      state,
      action: PayloadAction<{ id: string; part: LecturePart; data: any }>
    ) => {
      if (!state.data[action.payload.id]) {
        state.data[action.payload.id] = {};
      }
      state.data[action.payload.id][action.payload.part] = action.payload.data;
    },
  },
});

export const { saveLecturePart } = lectureSlice.actions;
export default lectureSlice.reducer;
