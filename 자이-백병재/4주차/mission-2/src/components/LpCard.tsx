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
}

function formatDate(dateString: Date) {
  if (!dateString) return ''; // 날짜가 없으면 빈칸 반환
  
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  
  return `${year}.${month}.${day}`;
}

function LpCard({ lp }: LpProps) {
  
  // 날짜
  const formattedDate = formatDate(lp.createdAt); 

  // 2. 태그 데이터 처리
  const tagNames = (lp.tags && lp.tags.length > 0) 
    ? lp.tags.map(tag => tag.name).join(' · ')
    : null; // 태그가 없으면 null

  return (
    <div className="group relative rounded-lg overflow-hidden aspect-square">
      
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

        {/* Tags  */}
        <p className="text-xs text-gray-300 line-clamp-1 mt-1">
          {tagNames ? tagNames : '\u00A0'}
        </p>

        {/* Title */}
        <h3 className="font-bold line-clamp-2 mt-1">{lp.title}</h3>

      </div>
    </div>
  );
}

export default LpCard;