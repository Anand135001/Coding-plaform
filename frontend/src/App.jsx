import { Routes, Route } from "react-router";

function App(){
   
  return (
    <> 
      <Routes>
         <Route path="/" element={<Homepage />} />
         <Route path="/login" element={<Login />} />
         <Route path="/signup" element={<Signup />} />
      </Routes>
    </>
  )
} 

export default App;