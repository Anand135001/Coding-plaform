import { Routes, Route, Navigate } from "react-router";
import Homepage from "./pages/homepage";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import { checkAuth } from "./utils/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

function App(){

  // route user on the bases user auth 
  const { isAuthenticated, loading } = useSelector((state)=> state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
      dispatch(checkAuth());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <> 
      <Routes>
         <Route path="/" element={ isAuthenticated ? <Homepage />: <Navigate to="/signup"/> } />
         <Route path="/login" element={ isAuthenticated ? <Navigate to="/" /> : <Login />} />
         <Route path="/signup" element={ isAuthenticated ? <Navigate to="/" /> : <SignUp />} />
      </Routes>
    </>
  )
} 

export default App;