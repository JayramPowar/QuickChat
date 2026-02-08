import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import Profile from './pages/Profile'
import {Toaster} from 'react-hot-toast';
import { AuthContext } from '../context/authContext'

const App = () => {

  const {authUser,loading } = useContext(AuthContext);
  if (loading) {
  return null; // or loader/spinner
}
  console.log("APP authUser:", authUser);

  return (
    <div className='bg-[url("../src/assets/bgImage.svg")] bg-contain' >
      <Toaster/>
      <Routes>
        <Route path="/" element={authUser ?<HomePage/> : <Navigate to="/login"/>}/>
        <Route path="/login" element={!authUser ? <LoginPage/> : <Navigate to="/"/>}/>
        <Route path="/profile" element={authUser ? <Profile/> : <Navigate to="/login"/>}/>
      </Routes>
    </div>
  )
}

export default App;
