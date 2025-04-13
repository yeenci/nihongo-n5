import { configureStore } from "@reduxjs/toolkit";
import lectureReducer from "./lectureSlice";
import imageReducer from "./imageSlice";
import { useDispatch, useSelector } from "react-redux";

export const store = configureStore({
  reducer: {
    lecture: lectureReducer,
    image: imageReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: <T>(selector: (state: RootState) => T) => T =
  useSelector;
