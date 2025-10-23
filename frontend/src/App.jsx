import { Routes, Route } from "react-router";
import Homepage from "./pages/homepage";
import SignUp from "./pages/signup";
import Login from "./pages/Login";

function App(){
   
  return (
    <> 
      <Routes>
         <Route path="/" element={<Homepage></Homepage>} />
         <Route path="/login" element={<Login></Login>} />
         <Route path="/signup" element={<SignUp></SignUp>} />
      </Routes>
    </>
  )
} 

export default App;