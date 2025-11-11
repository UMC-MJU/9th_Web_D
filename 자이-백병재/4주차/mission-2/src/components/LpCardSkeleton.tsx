function LpCardSkeleton() {
  return (
    <div className="relative rounded-lg overflow-hidden aspect-square bg-[#242938] p-4 flex flex-col justify-end">
      
      <div className="flex flex-col">
      
        {/* Likes / Date */}
        <div className="text-sm md:text-md lg:text-lg flex justify-between w-full mb-2"> 
          {/* Likes */}
          <div className="h-5 w-10 bg-[#3B4254] rounded-md animate-pulse"></div>
          {/* Date */}
          <div className="h-5 w-16 bg-[#3B4254] rounded-md animate-pulse"></div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-1 h-5 overflow-hidden mb-2">
          <div className="h-4 w-12 bg-[#3B4254] rounded-full animate-pulse"></div>
          <div className="h-4 w-16 bg-[#3B4254] rounded-full animate-pulse"></div>
          <div className="h-4 w-10 bg-[#3B4254] rounded-full animate-pulse"></div>
        </div>

        {/* Title */}
        <div className="space-y-1.5 mt-2">
          <div className="h-6 w-full bg-[#3B4254] rounded-md animate-pulse"></div>
          <div className="h-6 w-3/4 bg-[#3B4254] rounded-md animate-pulse"></div>
        </div>

      </div>
    </div>
  );
}

export default LpCardSkeleton;