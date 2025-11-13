import { ReactNode } from 'react';

interface QueryStateProps {
	isLoading: boolean;
	isError: boolean;
	onRetry?: () => void;
	errorMessage?: string;
	skeleton?: ReactNode;
	children?: ReactNode;
}

export default function QueryState({
	isLoading,
	isError,
	onRetry,
	errorMessage,
	skeleton,
	children,
}: QueryStateProps) {
	if (isError) {
		return (
			<div className="p-4 border rounded bg-red-50 text-red-700 flex items-center justify-between gap-4">
				<div>
					요청을 처리하지 못했습니다.
					{errorMessage ? <span className="ml-2 text-xs text-red-500">{errorMessage}</span> : null}
				</div>
				{onRetry && (
					<button
						onClick={onRetry}
						className="px-3 py-1 text-sm rounded bg-black text-white hover:bg-gray-800 transition-colors"
					>
						재시도
					</button>
				)}
			</div>
		);
	}

	if (isLoading) {
		return <>{skeleton ?? null}</>;
	}

	return <>{children ?? null}</>;
}


