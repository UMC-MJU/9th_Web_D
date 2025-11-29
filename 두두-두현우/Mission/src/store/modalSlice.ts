import { createSlice } from "@reduxjs/toolkit";

interface ModalState {
  isOpen: boolean;
  modalType: "clearCart" | null;
}

const initialState: ModalState = {
  isOpen: false,
  modalType: null,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openClearCartModal: (state) => {
      state.isOpen = true;
      state.modalType = "clearCart";
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.modalType = null;
    },
  },
});

export const { openClearCartModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
