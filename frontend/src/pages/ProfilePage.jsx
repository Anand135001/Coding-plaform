import { useEffect, useState } from "react";
import axiosClient from "../utils/axiosClient";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../authSlice";
import { useNavigate, NavLink } from "react-router";



function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosClient.get("/user/profile");
        setProfile(response.data);
      } catch (error) {
        console.error("Profile fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 p-8">
      <div className="max-w-3xl mx-auto bg-base-200 rounded-xl shadow-lg p-8">

        {/* User Info */}
        <div className="flex items-center gap-6 mb-8">
          <div className="avatar placeholder">
            <div className="bg-primary text-primary-content rounded-full w-16">
              <span className="text-xl">
                {profile.user.name[0].toUpperCase()}
              </span>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold">{profile.user.name}</h2>
            <p className="text-sm text-gray-500">{profile.user.email}</p>
            <p className="badge badge-outline mt-2">
              {profile.user.role}
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <button onClick={handleLogout} className="btn btn-error"> Logout </button>

          {user?.role === "admin" && ( 
            <NavLink to="/admin"  className="btn btn-primary">
              Admin Panel
            </NavLink>
          )}

        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-6">

          <div className="stat bg-base-100 rounded-lg p-4">
            <div className="stat-title">Problems Solved</div>
            <div className="stat-value text-success">
              {profile.stats.solvedCount}
            </div>
          </div>

          <div className="stat bg-base-100 rounded-lg p-4">
            <div className="stat-title">Total Submissions</div>
            <div className="stat-value">
              {profile.stats.totalSubmissions}
            </div>
          </div>

          <div className="stat bg-base-100 rounded-lg p-4">
            <div className="stat-title">Accepted</div>
            <div className="stat-value text-primary">
              {profile.stats.acceptedSubmissions}
            </div>
          </div>

          <div className="stat bg-base-100 rounded-lg p-4">
            <div className="stat-title">Success Rate</div>
            <div className="stat-value text-secondary">
              {profile.stats.successRate}%
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ProfilePage;