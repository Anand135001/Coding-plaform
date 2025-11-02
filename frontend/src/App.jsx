import { Routes, Route, Navigate } from "react-router";
import Homepage from "./pages/homepage";
import SignUp from "./pages/signup";
import Login from "./pages/Login";
import { checkAuth } from "./utils/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

function App(){

  // route user on the bases user auth 
  const { isAuthenticated } = useSelector((state)=> state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <> 
      <Routes>
         <Route path="/" element={ isAuthenticated ? <Homepage />: <Navigate to="/login"/> } />
         <Route path="/login" element={ isAuthenticated ? <Navigate to="/" /> : <Login />} />
         <Route path="/signup" element={ isAuthenticated ? <Navigate to="/" />: <SignUp />} />
      </Routes>
    </>
  )
} 

export default App;