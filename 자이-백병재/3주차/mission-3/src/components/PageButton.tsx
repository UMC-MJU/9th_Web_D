const PageButton = ( {pageNum, setPageNum} ) => {
    return (
        <div className="flex w-full justify-center items-center gap-6, mt-4">
            <button className="text-3xl bg-red-500 hover:bg-red-800 rounded-2xl w-[55px] text-amber-50 cursor-pointer
            disabled:bg-gray-600 disabled:cursor-not-allowed shadow-lg px-4 pb-1.5" 
            onClick={() => setPageNum((prev : number) => prev - 1)} disabled={pageNum===1}>{`<`}</button>
            <p className="px-10">{pageNum} 페이지</p>
            <button className="text-3xl bg-blue-500 hover:bg-blue-800 rounded-2xl w-[55px] text-amber-50 cursor-pointer
            shadow-lg px-4 pb-1.5" 
             onClick={() => setPageNum((prev : number) => prev + 1)}>{`>`}</button>
        </div>
    );

}

export default PageButton;