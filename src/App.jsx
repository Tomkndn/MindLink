import { toast, ToastContainer } from 'react-toastify';
import './App.css'
import {Routes, Route, NavLink,Navigate, useLocation} from 'react-router-dom';
import LogIn from './Pages/LogIn'
import SignUp from './Pages/SignUp'
import Meeting from './Pages/Meeting';
import Resource from './Pages/Resource';
import UpdateProfile from './Pages/UpdateProfile';
import Chat from './Pages/Chat';
import Dashboard from './Pages/Dashboard';
import Home from './Pages/Home';
import useStore from './store/useStore';
import { useEffect,useState } from 'react';
import LoadingPage from './components/Loading';
import PastMeeting from './Pages/PastMeeting';
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
        <Route
          path="/login"
          element={
            <Redirect>
              <LogIn />
            </Redirect>
          }
          exact
        />
        <Route
          path="/signup"
          element={
            <Redirect>
              <SignUp />
            </Redirect>
          }
          exact
        />
         <Route path="/focus" element={<ProtectedRoute>
              <RedirectToProfile>
                <FocusSessionTimer />
              </RedirectToProfile>
            </ProtectedRoute>} exact/>
        <Route path="/create" element={<ProtectedRoute>
              <RedirectToProfile>
                <CreateGroup />
              </RedirectToProfile>
            </ProtectedRoute>} exact/>
        <Route path="/groups" element={<ProtectedRoute>
              <RedirectToProfile>
                <GroupList />
              </RedirectToProfile>
            </ProtectedRoute>} exact/>
        <Route path="/groups/:groupId/invite" element={<ProtectedRoute>
              <RedirectToProfile>
                <InviteUser />
              </RedirectToProfile>
            </ProtectedRoute>} exact/>
        <Route path="/invitations" element={<ProtectedRoute>
              <RedirectToProfile>
                <Invitations />
              </RedirectToProfile>
            </ProtectedRoute>} exact/>
        <Route path="/groupchat" element={<ProtectedRoute>
              <RedirectToProfile>
                <GroupChat />
              </RedirectToProfile>
            </ProtectedRoute>} exact/>
        <Route
          path="/PastMeeting"
          element={
            <ProtectedRoute>
              <RedirectToProfile>
                <PastMeeting />
              </RedirectToProfile>
            </ProtectedRoute>
          }
          exact
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <RedirectToProfile>
                <Dashboard />
              </RedirectToProfile>
            </ProtectedRoute>
          }
          exact
        />
        <Route
          path="/updateprofile"
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
              <RedirectToProfile>
                <Resource />
              </RedirectToProfile>
            </ProtectedRoute>
          }
          exact
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <RedirectToProfile>
                <Chat />
              </RedirectToProfile>
            </ProtectedRoute>
          }
          exact
        />
        <Route
          path="/meeting"
          element={
            <ProtectedRoute>
              <RedirectToProfile>
                <Meeting />
              </RedirectToProfile>
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

const Redirect = ({ children }) => {
  const { isAuthenticated, loading, profileUpdated } = useStore();
  const location = useLocation();

  if (loading) return <LoadingPage />;

  if (isAuthenticated) {
    const from = location.state?.from?.pathname || "/dashboard";

    return <Navigate to={from} replace />;
  }

  return children;
};

const RedirectToProfile = ({ children }) => {
  const { isAuthenticated, loading, profileUpdated } = useStore();
  const [toastDisplayed, setToastDisplayed] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !profileUpdated && !toastDisplayed) {
      toast.warning("Please update your profile to continue.", {
        position: "bottom-right",
        autoClose: 2000,
      });
      setToastDisplayed(true); 
    }
  }, [isAuthenticated, profileUpdated, toastDisplayed]);

  if (loading) return <LoadingPage />;

  if (!profileUpdated) {
    return <Navigate to="/updateprofile" replace />;
  }

  return children;
};

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, profileUpdated } = useStore();
  const location = useLocation();

  if (loading) return <LoadingPage />;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
};