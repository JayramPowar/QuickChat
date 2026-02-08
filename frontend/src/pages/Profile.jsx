import { useContext, useState} from "react";
import {useNavigate} from "react-router-dom";
import assets from "../assets/assets";
import { AuthContext } from "../../context/authContext";

const Profile = () => {

  const {authUser,updateProfile} = useContext(AuthContext); 
  console.log("Profile authUser:", authUser);


  const navigate = useNavigate();

  const [selectImage, setSelectImage] = useState(null);
  const [name,setName] = useState(authUser.fullName || "");
  const [bio, setBio] = useState(authUser.bio || "");

  const handleSubmit = async(e) =>{
    e.preventDefault();
    if(!selectImage){
      await updateProfile({fullName:name,bio});
      navigate('/');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(selectImage);
    reader.onload = async () => {
      const base64Image = reader.result;
     
      await updateProfile({fullName:name,bio,profilePic:base64Image});
      navigate('/');
    }
  }

  return (
    <div className='min-h-screen bg-cover bg-no-repeat flex items-center justify-center'>
      <div className='w-5/6 max-w-2xl backdrop-blur-2xl text-gray-400 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg'>
        <form onSubmit={handleSubmit}
        className='flex flex-col gap-6 p-10 flex-1'>
          <h3 className='text-lg'>Profile Details</h3>
          <label htmlFor="avatar" className='flex items-center gap-4 cursor-pointer'>
          <input onChange={(e)=>setSelectImage(e.target.files[0])} 
          type="file" 
          id='avatar' 
          accept='.png, .jpg, .jpeg' 
          hidden/>
          <img src={selectImage ? URL.createObjectURL(selectImage) : assets.avatar_icon} alt="profilePic" className={`w-12 h-12 ${selectImage && 'rounded-full'}`}/>
          Upload Profile Pic
          </label>

          <input onChange={(e)=>setName(e.target.value)} value={name}
          type="text"  placeholder="Your Name" className="p-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500" required/>


          <textarea rows={4}
          onChange={(e)=>setBio(e.target.value)} value={bio} className="p-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="Write profile bio" required></textarea>

          <button type="submit" className="bg-linear-to-r from-purple-400 to-violet-600 text-white p-2 rounded-lg text-lg cursor-pointer">Save</button>
        </form>
        <img src={authUser.profilePic || assets.logo_icon} alt="" className={`max-w-40 aspect-square rounded-full mx-12 max-sm:mt-15${selectImage && 'rounded-full'}`}/>
      </div>
    </div>
  )
}

export default Profile