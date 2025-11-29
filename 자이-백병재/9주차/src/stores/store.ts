import { configureStore } from '@reduxjs/toolkit';

function createStore() {
  const store = configureStore({
    reducer: {},
  });
  
  return store; 
}

const store = createStore();

export default store;