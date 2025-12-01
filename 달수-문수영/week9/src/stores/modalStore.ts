import { create } from 'zustand';

type ModalState = {
	isOpen: boolean;
	open: () => void;
	close: () => void;
	toggle: () => void;
};

export const useModalStore = create<ModalState>(set => ({
	isOpen: false,
	open: () => set({ isOpen: true }),
	close: () => set({ isOpen: false }),
	toggle: () => set(state => ({ isOpen: !state.isOpen }))
}));


