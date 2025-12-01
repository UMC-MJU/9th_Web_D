import { useModalStore } from '../stores/modalStore';
import { useCartStore } from '../stores/cartStore';

const ConfirmModal = () => {
	const isOpen = useModalStore(s => s.isOpen);
	const close = useModalStore(s => s.close);
	const clearCartZ = useCartStore(s => s.clearCart);

	if (!isOpen) return null;

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center"
			role="dialog"
			aria-modal="true"
			aria-labelledby="confirm-title"
		>
			<div className="absolute inset-0 bg-black/40" onClick={() => close()} />
			<div className="relative z-10 w-[320px] rounded-lg bg-white p-5 shadow-xl">
				<h2 id="confirm-title" className="mb-2 text-base font-semibold text-slate-900">
					장바구니를 비울까요?
				</h2>
				<p className="mb-4 text-sm text-slate-600">
					이 작업은 되돌릴 수 없습니다.
				</p>
				<div className="flex justify-end gap-2">
					<button className="rounded bg-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-300" onClick={() => close()}>
						아니요
					</button>
					<button
						className="rounded bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-500"
						onClick={() => {
							clearCartZ();
							close();
						}}
					>
						네
					</button>
				</div>
			</div>
		</div>
	);
};

export default ConfirmModal;


