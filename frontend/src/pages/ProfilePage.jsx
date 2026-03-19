import { useEffect, useState } from "react";
import axiosClient from "../utils/axiosClient";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../authSlice";
import { useNavigate, NavLink } from "react-router";
import { LogOut, Settings, Code2, CheckCircle, XCircle, Clock, Trophy, Flame, BarChart2 } from "lucide-react";

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
      <div className="flex justify-center items-center min-h-screen bg-base-300">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const successRate = parseFloat(profile?.stats?.successRate || 0);
  const solved = profile?.stats?.solvedCount || 0;
  const total = profile?.stats?.totalSubmissions || 0;
  const accepted = profile?.stats?.acceptedSubmissions || 0;
  const failed = total - accepted;

  // Circular progress helper
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (successRate / 100) * circumference;

  return (
    <div className="min-h-screen bg-base-300">

      {/* Top Nav */}
      <div className="bg-base-100 border-b border-base-300 px-6 py-3 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2 text-primary font-bold text-xl">
          <Code2 size={22} />
          CodeRoots
        </NavLink>
        <div className="flex items-center gap-3">
          {user?.role === "admin" && (
            <NavLink to="/admin" className="btn btn-sm btn-outline btn-primary">
              Admin Panel
            </NavLink>
          )}
          <button onClick={handleLogout} className="btn btn-sm btn-error btn-outline flex items-center gap-1">
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Left Column — User Card */}
        <div className="md:col-span-1 flex flex-col gap-4">

          {/* Avatar + Info */}
          <div className="bg-base-100 rounded-2xl p-6 flex flex-col items-center text-center gap-3 border border-base-300">
            <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-primary-content text-3xl font-bold shadow-md">
              {profile.user.name[0].toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold">{profile.user.name}</h2>
              <p className="text-sm text-gray-500 mt-0.5">{profile.user.email}</p>
            </div>
            <div className="flex gap-2 flex-wrap justify-center">
              <span className="badge badge-primary badge-outline capitalize">{profile.user.role}</span>
              <span className="badge badge-ghost text-xs">
                Joined {new Date(profile.user.joinedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
              </span>
            </div>
          </div>

          {/* Success Rate Ring */}
          <div className="bg-base-100 rounded-2xl p-6 flex flex-col items-center gap-3 border border-base-300">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Success Rate</p>
            <div className="relative w-36 h-36">
              <svg viewBox="0 0 128 128" className="w-full h-full -rotate-90">
                <circle cx="64" cy="64" r={radius} fill="none" stroke="currentColor" strokeWidth="10" className="text-base-300" />
                <circle
                  cx="64" cy="64" r={radius} fill="none"
                  stroke="currentColor" strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  className="text-primary transition-all duration-700"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold">{successRate}%</span>
                <span className="text-xs text-gray-500">success</span>
              </div>
            </div>
            <div className="flex gap-4 text-sm w-full justify-center">
              <div className="flex items-center gap-1 text-success">
                <CheckCircle size={14} />
                <span>{accepted} passed</span>
              </div>
              <div className="flex items-center gap-1 text-error">
                <XCircle size={14} />
                <span>{failed} failed</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="md:col-span-2 flex flex-col gap-4">

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-base-100 rounded-2xl p-5 border border-base-300 flex flex-col gap-1">
              <div className="flex items-center gap-2 text-success mb-1">
                <Trophy size={16} />
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Solved</span>
              </div>
              <span className="text-3xl font-bold text-success">{solved}</span>
              <span className="text-xs text-gray-500">problems</span>
            </div>

            <div className="bg-base-100 rounded-2xl p-5 border border-base-300 flex flex-col gap-1">
              <div className="flex items-center gap-2 mb-1">
                <BarChart2 size={16} className="text-primary" />
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Submissions</span>
              </div>
              <span className="text-3xl font-bold">{total}</span>
              <span className="text-xs text-gray-500">total attempts</span>
            </div>

            <div className="bg-base-100 rounded-2xl p-5 border border-base-300 flex flex-col gap-1">
              <div className="flex items-center gap-2 mb-1">
                <Flame size={16} className="text-orange-400" />
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Accepted</span>
              </div>
              <span className="text-3xl font-bold text-primary">{accepted}</span>
              <span className="text-xs text-gray-500">correct solutions</span>
            </div>
          </div>

          {/* Submission Bar Chart */}
          <div className="bg-base-100 rounded-2xl p-6 border border-base-300">
            <h3 className="font-semibold text-sm uppercase tracking-wide text-gray-500 mb-4">Submission Overview</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-success flex items-center gap-1"><CheckCircle size={13} /> Accepted</span>
                  <span className="font-semibold">{accepted}</span>
                </div>
                <div className="w-full bg-base-300 rounded-full h-2.5">
                  <div
                    className="bg-success h-2.5 rounded-full transition-all duration-700"
                    style={{ width: total > 0 ? `${(accepted / total) * 100}%` : "0%" }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-error flex items-center gap-1"><XCircle size={13} /> Wrong Answer</span>
                  <span className="font-semibold">{failed}</span>
                </div>
                <div className="w-full bg-base-300 rounded-full h-2.5">
                  <div
                    className="bg-error h-2.5 rounded-full transition-all duration-700"
                    style={{ width: total > 0 ? `${(failed / total) * 100}%` : "0%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Problems Solved Breakdown — Real Data */}
          <div className="bg-base-100 rounded-2xl p-6 border border-base-300">
            <h3 className="font-semibold text-sm uppercase tracking-wide text-gray-500 mb-4">Problems Solved</h3>
            <div className="flex items-center gap-6">
          
              {/* Total */}
              <div className="flex flex-col items-center min-w-fit">
                <span className="text-4xl font-bold text-success">{solved}</span>
                <span className="text-xs text-gray-500 mt-1">Total Solved</span>
              </div>
          
              {/* Easy / Medium / Hard cards */}
              <div className="flex-1 grid grid-cols-3 gap-3">
                {[
                  {
                    label: "Easy",
                    count: profile.stats.difficulty?.easy || 0,
                    color: "text-success border-success"
                  },
                  {
                    label: "Medium",
                    count: profile.stats.difficulty?.medium || 0,
                    color: "text-warning border-warning"
                  },
                  {
                    label: "Hard",
                    count: profile.stats.difficulty?.hard || 0,
                    color: "text-error border-error"
                  },
                ].map(({ label, count, color }) => (
                  <div key={label} className={`rounded-xl border p-3 text-center ${color}`}>
                    <div className="text-xl font-bold">{count}</div>
                    <div className="text-xs mt-1 opacity-70">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          
            {/* Progress bars */}
            <div className="mt-4 space-y-2">
              {[
                { label: "Easy", count: profile.stats.difficulty?.easy || 0, color: "bg-success" },
                { label: "Medium", count: profile.stats.difficulty?.medium || 0, color: "bg-warning" },
                { label: "Hard", count: profile.stats.difficulty?.hard || 0, color: "bg-error" },
              ].map(({ label, count, color }) => (
                <div key={label}>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>{label}</span>
                    <span>{count} solved</span>
                  </div>
                  <div className="w-full bg-base-300 rounded-full h-1.5">
                    <div
                      className={`${color} h-1.5 rounded-full transition-all duration-700`}
                      style={{ width: solved > 0 ? `${(count / solved) * 100}%` : "0%" }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ProfilePage;