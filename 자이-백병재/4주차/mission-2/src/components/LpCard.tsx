import { NavLink } from "react-router-dom";
import type { Likes, Tags } from "../types/lp";
import formatDate from "../utils/formatDate";
import { useDisLike, useLike } from "../hooks/queries/useLike";
import { useAuth } from "../contexts/AuthContext";

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

function LpCard({ lp, setSearch }: LpProps) {
    
    const { mutate: likeMutate } = useLike(lp.id);
    const { mutate: disLikeMutate } = useDisLike(lp.id);
    const { accessToken, userData } = useAuth();
    const isLoggedIn = !!accessToken;

    const isLiked = isLoggedIn && lp.likes.some((like: Likes) => like.userId === userData?.data.id);

    const likeColor = isLiked ? 'text-pink-400' : 'text-white';

    // 좋아요 클릭 핸들러
    const handleLike = (e: React.MouseEvent) => {
        e.preventDefault(); 
        e.stopPropagation(); 
        if(isLoggedIn) {
            if(isLiked) {
                disLikeMutate(lp.id); 
            } else {
                likeMutate(lp.id); 
            }
        } else {
            alert("로그인이 필요합니다."); 
        }
    }
    
    // 태그 클릭 핸들러
    const handleTagClick = (e: React.MouseEvent, tagName: string) => {
        e.preventDefault(); 
        e.stopPropagation(); 
        setSearch(tagName);
    }

    // 날짜 포맷
    const formattedDate = formatDate(lp.createdAt); 
    const tagsArray = lp.tags || [];

    return (
        <NavLink className="group relative rounded-lg overflow-hidden aspect-square" to={`/lp/${lp.id}`}>
            
            <img
                src={lp.thumbnail}
                alt={lp.title}
                className="group-hover:blur-md group-hover:brightness-25 rounded-lg w-full h-full object-cover transition-all duration-200"
            />
            
            <div className="absolute p-4 inset-0 flex flex-col justify-end 
                            opacity-0 group-hover:opacity-100 transition-all duration-200 text-white bg-linear-to-t from-black/80 to-transparent">
            
                {/* Likes / Date */}
                <div className="text-sm md:text-md lg:text-lg flex justify-between w-full">
                    
                    <button 
                        onClick={handleLike} 
                        className={`z-10 cursor-pointer ${likeColor} hover:text-pink-300`}
                    >
                        ♥ {lp.likes.length}
                    </button>
                    
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
                                onClick={(e) => handleTagClick(e, tag.name)}
                                className="z-10 px-2 py-0.5 bg-blue-500/70 text-white text-xs rounded-full hover:bg-blue-400 focus:outline-none"
                            >
                                {tag.name}
                            </button>
                        ))
                    ) : (
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