import { NavLink } from "react-router-dom";
import type { Likes, Tags } from "../types/lp";

type LpItem = {
    id: number;
    title: string;
    content: string;
    thumbnail: string;
    published: boolean;
    authorId: number;
    createdAt: Date;
    updatedAt: Date;
    tags: Tags[];
    likes: Likes[];
}

interface LpProps { 
    lp: LpItem;
    setSearch: (keyWord: string) => void;
}

function formatDate(dateString: Date) {
  if (!dateString) return ''; // 날짜가 없으면 빈칸 반환
  
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  
  return `${year}.${month}.${day}`;
}

function LpCard({ lp, setSearch }: LpProps, ) {
  
    // 날짜
    const formattedDate = formatDate(lp.createdAt); 

    const tagsArray = lp.tags || [];

    return (
        <NavLink className="group relative rounded-lg overflow-hidden aspect-square" to={`/lp/${lp.id}`}>
      
        {/* 이미지 */}
        <img
            src={lp.thumbnail}
            alt={lp.title}
            className="group-hover:blur-md group-hover:brightness-25 rounded-lg w-full h-full object-cover transition-all duration-200"
        />
      
        {/* 2. 호버 시 나타나는 정보 */}
        <div className="absolute p-4 inset-0 flex flex-col justify-end 
                        opacity-0 group-hover:opacity-100 transition-all duration-200 text-white bg-gradient-to-t from-black/80 to-transparent">
        
            {/* Likes / Date */}
            <div className="text-sm md:text-md lg:text-lg flex justify-between w-full">
            <span>
                ♥ {lp.likes.length}
            </span>
            <span className="text-gray-300"> 
                {formattedDate}
            </span>
            </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-1 h-5 overflow-hidden">
            {tagsArray.length > 0 ? (
                tagsArray.map((tag) => (
                <button
                    key={tag.id}
                    onClick={(e) => setSearch(tag.name)}
                    className="px-2 py-0.5 bg-blue-500/70 text-white text-xs rounded-full hover:bg-blue-400 focus:outline-none"
                >
                    {tag.name}
                </button>
                ))
            ) : (
                // 태그가 없을 때 공간을 유지하기 위한 공백
                <span className="text-xs">&nbsp;</span> 
            )}
            </div>

        {/* Title */}
        <h3 className="font-bold line-clamp-2 mt-1">{lp.title}</h3>

      </div>
    </NavLink>
  );
}

export default LpCard;