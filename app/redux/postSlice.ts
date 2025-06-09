import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Comment {
  id: string;
  userEmail: string;
  text: string;
  commentedAt: string;
}

export interface Post {
  id: number;
  name: string;
  title: string;
  description: string;
  email: string;
  likes: string[];
  status: string;
  reports: string[];
  createdAt: string;
  tags: string[];
  comments: Comment[];
  resourceFileNames?: string[]; // post-<timestamp>-image1.jpg", "post-<timestamp>-doc.pdf
}

type PostState = {
  data: Post[];
};

const initialState: PostState = {
  data: [],
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    savePost: (state, action: PayloadAction<Post>) => {
      const existingIndex = state.data.findIndex(
        (p) => p.id === action.payload.id
      );
      if (existingIndex !== -1) {
        state.data[existingIndex] = action.payload;
      } else {
        state.data.push(action.payload);
      }
    },
    saveMultiplePosts: (state, action: PayloadAction<Post[]>) => {
      state.data = action.payload;
    },
  },
});

export const { savePost, saveMultiplePosts } = postSlice.actions;
export default postSlice.reducer;
