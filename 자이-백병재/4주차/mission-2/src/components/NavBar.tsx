import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react'; // useEffect를 import합니다.
import CreateLpModal from '../modals/CreateLpModal';
import { useDeleteMyInfo, useFixMyInfo } from '../hooks/queries/useMyInfo';

const NavBar = () => {
  const shadowClass = "[text-shadow:0_1px_4px_rgb(0_0_0_/_0.9)]";

  const baseLinkClass = `
    px-3 py-2 rounded-md text-sm font-medium 
    transition-all duration-200 ease-in-out
    ${shadowClass}
  `;
  const activeLinkClass = "text-white font-semibold transform scale-120";
  const inactiveLinkClass = "text-white hover:scale-105 hover:opacity-80"; 

  const { accessToken, userData } = useAuth();
  const isLoggedIn = !!accessToken;

  const { logout } = useAuth();
  
  const handleLogout = async () => {
      await logout();
  }

  const { mutate: fixMutate } = useFixMyInfo();
  const { mutate: deleteMutate } = useDeleteMyInfo();

  const [ name, setName ] = useState<string>();
  const [ bio, setBio ] = useState<string>();
  const [ avatar, setAvatar] = useState<string>();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const openModal = () => {
    setName(userData?.data?.name || '');
    setBio(userData?.data?.bio || '');
    setAvatar(userData?.data?.avatar || ''); 
    setIsEditModalOpen(true);
  };

  const closeModal = () => {
    setName('');
    setBio('');
    setAvatar('');
    setIsEditModalOpen(false);
  }

  const submitModal = () => {
    fixMutate({name, bio, avatar});
    closeModal();
  }

  const deleteModal = () => {
    deleteMutate();
    closeModal();
  }

  useEffect(() => {
    if (isEditModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isEditModalOpen]);

  return (
    <nav 
      className="fixed top-0 w-full z-50 py-4 bg-transparent">
      <div className="flex h-12 items-center justify-between px-8"> 
        <div className="flex items-center">
          <NavLink 
            to="/" 
            className={`
              text-white font-bold text-xl tracking-tight 
              transition-all duration-300 ease-in-out 
              ${shadowClass}
              hover:scale-105 hover:opacity-90
            `}
          >
            LPage
          </NavLink>
        </div>

        <div className="flex items-center space-x-6">
          {isLoggedIn ? (
            <div className="flex items-center space-x-4">
              <button className={`text-white text-sm font-medium ${shadowClass} cursor-pointer`}
              onClick = {() => openModal()}>
                {userData?.data?.name ? `${userData.data.name}님` : ``}
              </button>
              <button
                onClick={handleLogout}
                className={`${baseLinkClass} ${inactiveLinkClass} cursor-pointer`}
                type="button" 
              >
                Logout
              </button>
            </div>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `${baseLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`
              }
            >
              Login
            </NavLink>
          )}
        </div>
      </div>
      {isEditModalOpen && (
        <>
        <CreateLpModal 
          isOpen={isEditModalOpen} 
          onClose={() => closeModal()}
        >
          <>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-300">
                    프로필 아바타 url
                </label>
                <input 
                    type="text" 
                    placeholder="https://... 이미지 주소를 붙여넣으세요"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    className="w-full rounded border-gray-600 bg-gray-700 p-2 text-white placeholder-gray-400 focus:ring-[#FFA900] focus:border-[#FFA900]"
                />
                {avatar && (
                    <img 
                        src={avatar} 
                        alt="썸네일 프리뷰" 
                        className="mt-2 mx-auto h-32 w-32 object-cover rounded-md" 
                        onError={(e) => e.currentTarget.style.display = 'none'} 
                        onLoad={(e) => e.currentTarget.style.display = 'block'}
                    />
                )}
          </div>
          <input 
                type="text" 
                placeholder="이름"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded border-gray-600 bg-gray-700 p-2 mb-2 text-white placeholder-gray-400 focus:ring-[#FFA900] focus:border-[#FFA900]"
            />
            <textarea 
                placeholder="자기소개"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full rounded border-gray-600 bg-gray-700 p-2 mb-4 text-white placeholder-gray-400 focus:ring-[#FFA900] focus:border-[#FFA900]"
                rows={4}
            />
          </>
          <div className="flex justify-end gap-2">
                <button
                    type="button"
                    onClick={deleteModal}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500"
                >
                    탈퇴
                </button>
                <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500"
                >
                    취소
                </button>
                <button
                    type="button"
                    onClick={submitModal}
                    className="px-4 py-2 bg-[#FFA900] text-white rounded-lg hover:bg-[#ffaa00cd]"
                >
                    수정
                </button>
            </div>
        </CreateLpModal> 
  
        </>
        
      )}
    </nav>
  );
};

export default NavBar;