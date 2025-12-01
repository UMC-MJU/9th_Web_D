import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { useModalStore } from '../stores/modalStore';

const Header = () => {
	const totalCount = useSelector((state: RootState) => state.cart.amount);
	const open = useModalStore(s => s.open);

	return (
		<header className="sticky top-0 z-10 bg-slate-800 text-white">
			<div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
				<h1 className="text-lg font-bold">dalso-list</h1>
				<nav className="flex items-center gap-3">
					<div className="flex items-center gap-2">
						<span aria-hidden>🛒</span>
						<span className="rounded bg-slate-700 px-2 py-0.5 text-sm">
							{totalCount}
						</span>
					</div>
					<button
						className="rounded bg-slate-700 px-3 py-1 text-sm hover:bg-slate-600"
						onClick={() => open()}
					>
						전체 삭제
					</button>
				</nav>
			</div>
		</header>
	);
};

export default Header;


