import { useState } from 'react'
import { ToastContainer } from 'react-toastify';

import './App.css'
import {Routes, Route} from 'react-router-dom';
import LogIn from './components/Authentication/LogIn'
import SignUp from './components/Authentication/SignUp'

import Home from './components/Pages/Home';

function App() {

  return (
    <>
    <ToastContainer />
    <Routes>
      <Route path='/' element={<Home />} exact />
      <Route path='/login' element={<LogIn />} exact />
      <Route path='/signup' element={<SignUp />} exact />

    </Routes>

    </>
  )
}

export default App;
