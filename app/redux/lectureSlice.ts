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
      action: PayloadAction<{
        partId: LecturePart;
        lectureId: string;
        data: any;
      }>
    ) => {
      if (!state.data[action.payload.lectureId]) {
        state.data[action.payload.lectureId] = {};
      }
      state.data[action.payload.lectureId][action.payload.partId] =
        action.payload.data;
    },
  },
});

export const { saveLecturePart } = lectureSlice.actions;
export default lectureSlice.reducer;
