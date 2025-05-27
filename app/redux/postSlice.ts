import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type PostState = {
  data: { [key: string]: string };
};

const initialState: PostState = {
  data: {},
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    savePost: (state, action: PayloadAction<{ id: string; url: string }>) => {
      state.data[action.payload.id] = action.payload.url;
    },
    saveMultiplePosts: (
      state,
      action: PayloadAction<{ [id: string]: string }>
    ) => {
      Object.entries(action.payload).forEach(([id, url]) => {
        state.data[id] = url;
      });
    },
  },
});

export const { savePost, saveMultiplePosts } = postSlice.actions;
export default postSlice.reducer;