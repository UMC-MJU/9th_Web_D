import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store';
import { closeModal } from '../store/modalSlice';
import { clearCart } from '../store/cartSlice';

const ConfirmModal = () => {
	const dispatch = useDispatch();
	const isOpen = useSelector((state: RootState) => state.modal.isOpen);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div
				className="absolute inset-0 bg-black/40"
				onClick={() => dispatch(closeModal())}
			/>
			<div className="relative z-10 w-[320px] rounded-lg bg-white p-5 shadow-xl">
				<h2 className="mb-2 text-base font-semibold text-slate-900">
					장바구니를 비울까요?
				</h2>
				<p className="mb-4 text-sm text-slate-600">
					이 작업은 되돌릴 수 없습니다.
				</p>
				<div className="flex justify-end gap-2">
					<button
						className="rounded bg-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-300"
						onClick={() => dispatch(closeModal())}
					>
						취소
					</button>
					<button
						className="rounded bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-500"
						onClick={() => {
							dispatch(clearCart());
							dispatch(closeModal());
						}}
					>
						전체 삭제
					</button>
				</div>
			</div>
		</div>
	);
};

export default ConfirmModal;


