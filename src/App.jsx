import { useState } from 'react'
import { ToastContainer } from 'react-toastify';

import './App.css'
import {Routes, Route} from 'react-router-dom';
import LogIn from './Pages/LogIn'
import SignUp from './Pages/SignUp'
import Meeting from './Pages/Meeting';
import Resource from './Pages/Resource';
import UpdateProfile from './Pages/UpdateProfile';
import Chat from './Pages/Chat';
import Dashboard from './Pages/Dashboard';

import Home from './Pages/Home';

function App() {

  return (
    <>
    <ToastContainer />
    <Routes>
      <Route path='/' element={<Home />} exact />
      <Route path='/login' element={<LogIn />} exact />
      <Route path='/signup' element={<SignUp />} exact />
      <Route path='/dashboard' element={<Dashboard />} exact />
      <Route path='/updateProfile' element={<UpdateProfile />} exact />
      <Route path='/resource' element={<Resource />} exact />
      <Route path='/chat' element={<Chat />} exact />
      <Route path='/meeting' element={<Meeting />} exact />
    </Routes>
    </>
  )
}

export default App;
