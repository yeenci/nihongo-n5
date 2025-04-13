import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ImageState = {
  data: { [key: string]: string };
};

const initialState: ImageState = {
  data: {},
};

const imageSlice = createSlice({
  name: "image",
  initialState,
  reducers: {
    saveImage: (state, action: PayloadAction<{ id: string; url: string }>) => {
      state.data[action.payload.id] = action.payload.url;
    },
    saveMultipleImages: (
      state,
      action: PayloadAction<{ [id: string]: string }>
    ) => {
      Object.entries(action.payload).forEach(([id, url]) => {
        state.data[id] = url;
      });
    },
  },
});

export const { saveImage, saveMultipleImages } = imageSlice.actions;
export default imageSlice.reducer;
