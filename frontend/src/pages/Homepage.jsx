import { useEffect, useState } from 'react';
import { NavLink } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../config/axiosClient';
import { logoutUser } from '../utils/authSlice';

function Homepage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [filters, setFilters] = useState({
    difficulty: 'all',
    tag: 'all',
    status: 'all' 
  });
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    solved: 0,
    easy: 0,
    medium: 0,
    hard: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [problemsRes, solvedRes] = await Promise.all([
          axiosClient.get('/problem/getAllProblem'),
          user ? axiosClient.get('/problem/problemSolvedByUser') : Promise.resolve({ data: [] })
        ]);
        
        setProblems(problemsRes.data);
        setSolvedProblems(solvedRes.data);
        
        // Calculate stats
        const total = problemsRes.data.length;
        const solved = solvedRes.data.length;
        const easy = problemsRes.data.filter(p => p.difficulty === 'easy').length;
        const medium = problemsRes.data.filter(p => p.difficulty === 'medium').length;
        const hard = problemsRes.data.filter(p => p.difficulty === 'hard').length;
        
        setStats({ total, solved, easy, medium, hard });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleLogout = () => {
    dispatch(logoutUser());
    setSolvedProblems([]);
  };

  const filteredProblems = problems.filter(problem => {
    const difficultyMatch = filters.difficulty === 'all' || problem.difficulty === filters.difficulty;
    const tagMatch = filters.tag === 'all' || problem.tags === filters.tag;
    const statusMatch = filters.status === 'all' || 
                      (filters.status === 'solved' && solvedProblems.some(sp => sp._id === problem._id));
    return difficultyMatch && tagMatch && statusMatch;
  });

  const getDifficultyBadgeColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'badge-success';
      case 'medium': return 'badge-warning';
      case 'hard': return 'badge-error';
      default: return 'badge-neutral';
    }
  };

  const getDifficultyProgress = () => {
    const totalSolved = solvedProblems.length;
    if (totalSolved === 0) return 0;
    return Math.round((totalSolved / stats.total) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="text-lg">Loading problems...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      {/* Navigation Bar */}
      <nav className="navbar bg-base-100 shadow-lg sticky top-0 z-50 px-4 lg:px-8">
        <div className="flex-1">
          <NavLink to="/" className="btn btn-ghost text-xl font-bold text-primary">CodeRoots</NavLink>
        </div>
        
        <div className="flex-none gap-4">
          {user ? (
            <div className="dropdown dropdown-end">
              <div tabIndex={0} className="btn btn-ghost avatar placeholder">
                <div className="bg-neutral text-neutral-content rounded-full w-10">
                  <span className="text-lg font-semibold">
                    {user.firstname?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="ml-2 hidden sm:inline">{user.firstname}</span>
              </div>
              <ul className="mt-3 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                <li>
                  <div className="flex flex-col p-2">
                    <span className="font-semibold">{user.firstname}</span>
                    <span className="text-sm text-base-content/70">{user.email}</span>
                  </div>
                </li>
                <li><div className="divider my-1"></div></li>
                {user.role === 'admin' && (
                  <li>
                    <NavLink to="/admin" className="justify-between">
                      Admin Panel
                      <span className="badge badge-primary">Admin</span>
                    </NavLink>
                  </li>
                )}
                <li><button onClick={handleLogout}>Logout</button></li>
              </ul>
            </div>
          ) : (
            <div className="flex gap-2">
              <NavLink to="/login" className="btn btn-ghost">Login</NavLink>
              <NavLink to="/signup" className="btn btn-primary">Sign Up</NavLink>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-base-100">
        <div className="container mx-auto px-4 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Master Your <span className="text-primary">Coding Skills</span>
            </h1>
            <p className="text-xl lg:text-2xl mb-8 text-base-content/70 max-w-3xl mx-auto">
              Solve coding challenges, prepare for interviews, and level up your programming journey with CodeRoots.
            </p>
            {!user && (
              <div className="flex gap-4 justify-center">
                <NavLink to="/signup" className="btn btn-primary btn-lg">Get Started</NavLink>
                <NavLink to="/problems" className="btn btn-outline btn-lg">Browse Problems</NavLink>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      {user && (
        <div className="container mx-auto px-4 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {/* Progress Card */}
            <div className="lg:col-span-2 card bg-primary text-primary-content">
              <div className="card-body">
                <h3 className="card-title">Your Progress</h3>
                <div className="flex items-center gap-4">
                  <div className="radial-progress text-white" style={{"--value": getDifficultyProgress(), "--size": "5rem"}}>
                    {getDifficultyProgress()}%
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{solvedProblems.length}/{stats.total}</p>
                    <p>Problems Solved</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="card bg-base-100 shadow">
              <div className="card-body text-center">
                <div className="stat-value text-success">{stats.easy}</div>
                <div className="stat-title">Easy</div>
              </div>
            </div>
            
            <div className="card bg-base-100 shadow">
              <div className="card-body text-center">
                <div className="stat-value text-warning">{stats.medium}</div>
                <div className="stat-title">Medium</div>
              </div>
            </div>
            
            <div className="card bg-base-100 shadow">
              <div className="card-body text-center">
                <div className="stat-value text-error">{stats.hard}</div>
                <div className="stat-title">Hard</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 lg:px-8 py-8">
        {/* Header and Filters */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold mb-2">Coding Problems</h2>
            <p className="text-base-content/70">
              {filteredProblems.length} problem{filteredProblems.length !== 1 ? 's' : ''} found
            </p>
          </div>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <select 
              className="select select-bordered select-sm lg:select-md"
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
            >
              <option value="all">All Problems</option>
              <option value="solved">Solved Only</option>
            </select>

            <select 
              className="select select-bordered select-sm lg:select-md"
              value={filters.difficulty}
              onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
            >
              <option value="all">All Difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            <select 
              className="select select-bordered select-sm lg:select-md"
              value={filters.tag}
              onChange={(e) => setFilters({...filters, tag: e.target.value})}
            >
              <option value="all">All Tags</option>
              <option value="array">Array</option>
              <option value="linkedList">Linked List</option>
              <option value="graph">Graph</option>
              <option value="dp">Dynamic Programming</option>
              <option value="tree">Tree</option>
              <option value="string">String</option>
            </select>
          </div>
        </div>

        {/* Problems List */}
        <div className="grid gap-4">
          {filteredProblems.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No problems found</h3>
              <p className="text-base-content/70">Try adjusting your filters to see more problems.</p>
            </div>
          ) : (
            filteredProblems.map(problem => (
              <div key={problem._id} className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="card-body">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <h2 className="card-title text-lg lg:text-xl hover:text-primary transition-colors">
                          <NavLink to={`/problem/${problem._id}`}>
                            {problem.title}
                          </NavLink>
                        </h2>
                        {solvedProblems.some(sp => sp._id === problem._id) && (
                          <div className="badge badge-success gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Solved
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-3">
                        <div className={`badge badge-lg ${getDifficultyBadgeColor(problem.difficulty)}`}>
                          {problem.difficulty}
                        </div>
                        <div className="badge badge-lg badge-info">
                          {problem.tags}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <NavLink 
                        to={`/problem/${problem._id}`}
                        className="btn btn-primary btn-sm lg:btn-md"
                      >
                        Solve Challenge
                      </NavLink>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="footer footer-center p-10 bg-base-300 text-base-content rounded mt-12">
        <div>
          <div className="grid grid-flow-col gap-4">
            <a className="link link-hover">About us</a>
            <a className="link link-hover">Contact</a>
            <a className="link link-hover">Jobs</a>
            <a className="link link-hover">Press kit</a>
          </div>
        </div>
        <div>
          <div className="grid grid-flow-col gap-4">
            <a><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path></svg></a>
            <a><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path></svg></a>
            <a><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path></svg></a>
          </div>
        </div>
        <div>
          <p>Copyright © {new Date().getFullYear()} - All rights reserved by CodeRoots</p>
        </div>
      </footer>
    </div>
  );
}

export default Homepage;