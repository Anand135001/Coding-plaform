import { Routes, Route, Navigate } from "react-router";
import Homepage from "./pages/Homepage";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import { checkAuth } from "./authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import ProblemPage from './pages/Problempage';
import Admin from './pages/admin/Admin'
import AdminPanel from './pages/admin/AdminPanel'
import AdminDelete from "./pages/admin/AdminDelete";
import AdminUpdate from "./pages/admin/AdminUpdate";
import UpdateProblem from "./pages/admin/UpdateProblem";
import AdminVideo from "./pages/admin/AdminVideos";
import AdminUplaod from "./pages/admin/AdminUpload";
import ProfilePage from "./pages/ProfilePage";

function App(){

  const { isAuthenticated, isAuthChecked, user} = useSelector((state)=> state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (!isAuthChecked) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen gap-3">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="text-gray-400 text-sm">Starting server...</p>
      </div>
    );
  }

  return (
    <> 
      <Routes>
         <Route path="/" element={ isAuthenticated ? <Homepage />: <Navigate to="/signup"/> } />
         <Route path="/login" element={ isAuthenticated ? <Navigate to="/" /> : <Login /> } />
         <Route path="/signup" element={ isAuthenticated ? <Navigate to="/" /> : <SignUp /> } />

         <Route path="/admin" element={isAuthenticated && user?.role === 'admin' ? <Admin /> : <Navigate to="/" />} />
         <Route path="/admin/create" element={isAuthenticated && user?.role === 'admin' ? <AdminPanel /> : <Navigate to="/" />} />
         <Route path="/admin/delete" element={isAuthenticated && user?.role === 'admin' ? < AdminDelete /> : <Navigate to="/" /> } />
         <Route path="/admin/update" element={isAuthenticated && user?.role === 'admin' ? < AdminUpdate /> : <Navigate to="/" /> } />
         <Route path="/admin/update/:problemId" element={<UpdateProblem />} />

         <Route path="/admin/video" element={isAuthenticated && user?.role === 'admin' ? < AdminVideo /> : <Navigate to="/" /> } />
         <Route path="/admin/upload/:problemId" element={isAuthenticated && user?.role === 'admin' ? < AdminUplaod /> : <Navigate to="/" /> } />
         
         <Route path="/problem/:problemId" element={<ProblemPage/>} />

         <Route path="/profile" element={<ProfilePage />} />
         
      </Routes>
    </>
  )
} 

export default App;