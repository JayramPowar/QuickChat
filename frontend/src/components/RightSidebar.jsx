import { useContext, useEffect, useState } from 'react';
import assets, { imagesDummyData } from '../assets/assets'
import ChatContext from '../../context/ChatContext';
import { AuthContext } from '../../context/authContext';

const RightSidebar = () => {

  const {selectedUser,messages} = useContext(ChatContext);
  const {logout, onlineUser} = useContext(AuthContext);

  const[msgImages, setMsgImages] = useState([]);

  //* used to extract images from messages of selected user
  useEffect(() => {
    setMsgImages(
      messages.filter(msg => msg.image) // Filter messages that have an image
              .map(msg => msg.image) // Extract the image URLs
    )
  },[messages])

  return selectedUser && (
    <div className={`bg-[#8185B2]/10 text-white w-full relative  rounded-l-xl overflow-y-scroll ${selectedUser ? 'max-md:hidden' : ''}`}>
        <div className='pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto'>
          <img src={selectedUser.profilePic || assets.avatar_icon} alt="userPic" className='w-15 aspect-square rounded-full'/>
          <h1 className=' px-10 text-xl font-medium mx-auto flex items-center gap-2'>
            {onlineUser.includes(selectedUser._id) && <p className='w-2 h-2 rounded-full bg-green-500'></p>}
            {selectedUser.fullName || 'User Name'}</h1>
            <p className='px-10 mx-auto '>{selectedUser.bio || 'User Bio'}</p>
        </div>
        <hr className='my-4 border-[#ffffff60]'/>

        <div className='px-5 text-xs'>
          <p>Media</p>
          <div className='mt-2 max-h-50 overflow-y-scroll grid grid-cols-2 gap-5 opacity-75'>
            {msgImages.map((imgUrl, index) => (
              <div key={index} onClick={() => window.open(imgUrl)} className='cursor-pointer rounded'>
                <img src={imgUrl} alt="mediaImg" className='h-full rounded-md'/>
              </div>
            ))}
          </div>
        </div>

        <button onClick={() => logout()} className='absolute bottom-5 left-1/2 transform -translate-x-1/2 text-sm bg-linear-to-r from-purple-400 to-violet-600 text-white border-none font-light py-2 px-20 rounded-full cursor-pointer'>Logout</button>
    </div>
  )
}

export default RightSidebar