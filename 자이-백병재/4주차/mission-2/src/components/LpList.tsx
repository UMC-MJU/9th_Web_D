import { useEffect, useState } from 'react'; 
import LpCard from "./LpCard";
import LoadingSpinner from './LoadingSpinner';
import ErrorPage from '../pages/ErrorPage';
import { useGetInfiniteLpList } from '../hooks/queries/useGetInfinityLpList';
import {useInView} from 'react-intersection-observer';
import LpListSkeleton from './LpListSkeleton';

export function LpList() {
    const [search, setSearch] = useState("");
    const [order, setOrder] = useState<'desc'|'asc'>('desc');
    const { 
        data: lps,
        hasNextPage,
        isPending,
        isFetching,
        fetchNextPage,
        isError
     } = useGetInfiniteLpList({
        search: search,
        limit: 30,
        order: order,
    });

    const { ref, inView } = useInView();

    useEffect(() => {
        if (inView && !isFetching && hasNextPage) {
        fetchNextPage();
    }
    }, [inView, isFetching, hasNextPage, fetchNextPage]);

    return (
        // 전체를 감싸는 div
        <div className="w-full min-h-screen"> 
            
            {/* 검색창 UI */}
            <div className={`p-2 transition-all duration-300 ease-in-out
                             fixed top-0 left-1/2 transform -translate-x-1/2 
                             w-11/12 md:w-1/2 lg:w-1/3 z-100`}> 
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="앨범명, 아티스트, 태그 등으로 검색..."
                    className="w-full p-3 text-lg text-white rounded-lg outline-none 
                               transition-all duration-300 ease-in-out
                               
                               bg-black/50
                               border-2 border-gray-400 
                                placeholder-transparent

                               focus:bg-gray-700 
                               focus:border-[#FFA900]
                               focus:placeholder-gray-500"
                />
            </div>

            {/* 정렬 */}
                <div className="col-span-full flex justify-end gap-2 mb-4 mr-10">
                    <button
                        onClick={() => setOrder('desc')}
                        className={`px-3 py-1 text-sm rounded-md transition-colors
                            ${order === 'desc' 
                                ? 'bg-[#FFA900] text-white' 
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                    >
                        최신순
                    </button>
                    <button
                        onClick={() => setOrder('asc')} 
                        className={`px-3 py-1 text-sm rounded-md transition-colors
                            ${order === 'asc' 
                                ? 'bg-[#FFA900] text-white' 
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                    >
                        오래된순
                    </button>
                </div>

            {/* 로딩 및 에러 */}
            {isPending && <LoadingSpinner />}
            {isError && <ErrorPage />}

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 m-5">
                {lps?.pages?.map((page) => page.data.data)?.flat()
                ?.map((lp) => (
                    <LpCard 
                        key={lp.id} 
                        lp={lp} 
                        setSearch={setSearch} // LpCard의 태그 버튼으로 검색할 경우
                    />
                ))}
                {isFetching && <LpListSkeleton count={12}/>}
            </div>

            <div ref={ref} className="h-20" />

            {/* 검색 결과가 없음 */}
            {!isPending && lps?.pages[0]?.data.data.length === 0 && (
                <div className="text-gray-400 text-center p-10">
                    "{search}"에 대한 검색 결과가 없습니다.
                </div>
            )}
        </div>
    );
}

export default LpList;