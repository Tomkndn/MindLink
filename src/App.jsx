import { ToastContainer } from 'react-toastify';
import './App.css'
import {Routes, Route, NavLink} from 'react-router-dom';
import LogIn from './Pages/LogIn'
import SignUp from './Pages/SignUp'
import Meeting from './Pages/Meeting';
import Resource from './Pages/Resource';
import UpdateProfile from './Pages/UpdateProfile';
import Chat from './Pages/Chat';
import Dashboard from './Pages/Dashboard';
import Home from './Pages/Home';
import ProtectedRoute from './components/ProtectedRoute';
import useStore from './store/useStore';
import { useEffect } from 'react';
import LoadingPage from './components/Loading';
import FocusSessionTimer from './components/FocusSessionTimer'
import GroupList from './components/GroupList'
import CreateGroup from './components/CreateGroup'
import InviteUser from './components/InviteUser';
import Invitations from './components/Invitations';  
import GroupChat from './Pages/GroupChat';
function App() {
  const { initializeAuth, loading } = useStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (loading) return <LoadingPage />;

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} exact />
        <Route path="/login" element={<LogIn />} exact />
        <Route path="/signup" element={<SignUp />} exact />
        <Route path="/focus" element={<FocusSessionTimer />} exact/>
        <Route path="/create" element={<CreateGroup />} exact/>
        <Route path="/groups" element={<GroupList />} exact/>
        <Route path="/groups/:groupId/invite" element={<InviteUser />} exact/>
        <Route path="/invitations" element={<Invitations />} exact/>
        <Route path="/groupchat" element={<GroupChat />} exact/>
        
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
          exact
        />
        <Route
          path="/updateProfile"
          element={
            <ProtectedRoute>
              <UpdateProfile />
            </ProtectedRoute>
          }
          exact
        />
        <Route
          path="/resource"
          element={
            <ProtectedRoute>
              <Resource />
            </ProtectedRoute>
          }
          exact
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
          exact
        />
        <Route
          path="/meeting/api/auth/"
          element={
            <ProtectedRoute>
              <Meeting />
            </ProtectedRoute>
          }
          exact
        />
        <Route path="*" element={<NotFound />} exact />
      </Routes>
    </>
  );
}

export default App;

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-xl max-w-lg text-center">
        <h1 className="text-5xl font-extrabold text-red-600 mb-4">
          404 Not Found
        </h1>
        <p className="text-xl text-gray-800 mb-6">Oops! The page you're looking for doesn't exist.</p>
        <NavLink to="/" className="text-lg text-blue-500 hover:text-blue-700 underline transition duration-300">
          Go back to Home
        </NavLink>
      </div>
    </div>
  );
}
