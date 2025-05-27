import { configureStore } from "@reduxjs/toolkit";
import lectureReducer from "./lectureSlice";
import imageReducer from "./imageSlice";
import postReducer from "./postSlice";
import { useDispatch, useSelector } from "react-redux";

export const store = configureStore({
  reducer: {
    lecture: lectureReducer,
    image: imageReducer,
    post: postReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: <T>(selector: (state: RootState) => T) => T =
  useSelector;
