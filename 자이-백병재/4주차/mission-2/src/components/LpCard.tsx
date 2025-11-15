import { NavLink } from "react-router-dom";
import type { Likes, Tags } from "../types/lp";
import formatDate from "../utils/formatDate";
import { useDisLike, useLike } from "../hooks/queries/useLike";
import { useAuth } from "../contexts/AuthContext";
import type { Dispatch, SetStateAction } from "react";
import { useDeleteLp } from "../hooks/queries/useDeleteLp";
import DropdownMenu from "./DropDownMenu";
import { useState } from 'react';
import CreateLpModal from '../modals/CreateLpModal';
import { useFixLp } from "../hooks/queries/useFixLp";
import LpForm from "./LpForm";

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
    // `DropdownMenu`를 제어하기 위한 props 추가
    openMenuId: number | null;
    setOpenMenuId: Dispatch<SetStateAction<number | null>>;
  }

function LpCard({ lp, setSearch, openMenuId, setOpenMenuId }: LpProps) {
    
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [title, setTitle] = useState(lp.title);
    const [content, setContent] = useState(lp.content);
    const [thumbnailUrl, setThumbnailUrl] = useState(lp.thumbnail);

    const initialTags = lp.tags.map(tag => tag.name);
    const [tags, setTags] = useState<string[]>(initialTags);
    const [currentTag, setCurrentTag] = useState('');

    const { mutate: likeMutate } = useLike(lp.id);
    const { mutate: disLikeMutate } = useDisLike(lp.id);
    const { accessToken, userData } = useAuth();
    const isLoggedIn = !!accessToken;

    const isLiked = isLoggedIn && lp.likes.some((like: Likes) => like.userId === userData?.data.id);

    const likeColor = isLiked ? 'text-pink-400' : 'text-white';

    const isAuthor = isLoggedIn && userData?.data.id === lp.authorId;

    const {mutate: deleteMutate} = useDeleteLp();
    const { mutate: updateMutate } = useFixLp();

    const closeModalAndReset = () => {
        setIsEditModalOpen(false);
        setTitle(lp.title);
        setContent(lp.content);
        setThumbnailUrl(lp.thumbnail);
        setTags(initialTags);
        setCurrentTag('');
    };

    // 모달 열기 함수
    const openEditModal = () => {
        setIsEditModalOpen(true);
        setOpenMenuId(null); // 드롭다운 메뉴 닫기
    }

    // 태그 추가/제거 핸들러
    const handleAddTag = () => {
        const newTag = currentTag.trim();
        if (newTag && !tags.includes(newTag)) {
          setTags([...tags, newTag]); 
          setCurrentTag(''); 
        }
    };
    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    // 최종 수정 제출 핸들러
    const handleUpdateSubmit = () => {
        updateMutate({ 
            lpId: lp.id, 
            title: title, 
            content: content, 
            thumbnail: thumbnailUrl, 
            tags: tags
        });
        closeModalAndReset(); // 모달 닫기
    };

    //  DropdownMenu에 전달할 메뉴 항목 배열 정의
    const lpMenuItems = [
    {
      label: '수정',
      onClick: openEditModal, // 수정 버튼 클릭 시 모달 열기
    },
    {
      label: '삭제',
      onClick: () => {
        deleteMutate(lp.id);
      },
    },
    ];

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
        <>
        <NavLink className="group relative rounded-lg overflow-hidden aspect-square" to={`/lp/${lp.id}`}>
            
            {isAuthor && (
        <div
          className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <DropdownMenu
            triggerId={lp.id}
            openMenuId={openMenuId}
            setOpenMenuId={setOpenMenuId}
            menuItems={lpMenuItems}
          />
        </div>
      )}
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
        
        {isAuthor && (
            <CreateLpModal isOpen={isEditModalOpen} onClose={closeModalAndReset}>
            <h2 className="text-xl font-bold mb-6 text-white">LP 수정</h2>
            <LpForm
                title={title}
                setTitle={setTitle}
                content={content}
                setContent={setContent}
                thumbnailUrl={thumbnailUrl}
                setThumbnailUrl={setThumbnailUrl}
                currentTag={currentTag}
                setCurrentTag={setCurrentTag}
                tags={tags}
                handleAddTag={handleAddTag}
                handleRemoveTag={handleRemoveTag}
            />

            {/* 모달 버튼 */}
            <div className="flex justify-end gap-2">
                <button
                    type="button"
                    onClick={closeModalAndReset}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500"
                >
                    취소
                </button>
                <button
                    type="button"
                    onClick={handleUpdateSubmit}
                    className="px-4 py-2 bg-[#FFA900] text-white rounded-lg hover:bg-[#ffaa00cd]"
                >
                    수정
                </button>
            </div>
        </CreateLpModal>
        )}
        </>
    );
}

export default LpCard;