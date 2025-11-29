import { configureStore } from '@reduxjs/toolkit';

function createStore() {
  const store = configureStore({
    reducer: {},
  });
  
  return store; 
}

const store = createStore();

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;