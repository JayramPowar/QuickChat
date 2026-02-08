import { useContext  } from "react"
import ChatContainer from "../components/ChatContainer"
import RightSidebar from "../components/RightSidebar"
import Sidebar from "../components/Sidebar"
import ChatContext from "../../context/ChatContext"


const HomePage = () => {

    //TODO created a state variable to track selected user
    //? when a user is selected, we will display 3 columns that are Sidebar, ChatContainer, and RightSidebar
    //? when it is not selected, we display 2 columns - sidebar and ChatContainer
    
    const {selectedUser} = useContext(ChatContext);

  return (

    <div className="border w-full h-screen sm:px-[15%] sm:py-[5%]">
        <div className={`backdrop-blur-xl border-2 border-gray-700 rounded-2xl grid grid-cols-1 overflow-hidden h-full relative ${selectedUser ? 'md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]' :'md:grid-cols-2'}`}>
            <Sidebar/>
            <ChatContainer/>
            <RightSidebar/>
        </div>
    </div>
  )
}

export default HomePage