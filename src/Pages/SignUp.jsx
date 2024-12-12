import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import bgImg from '../assets/loginBackGround.png';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import googleIcon from '../assets/googleIcon.png';
import fbIcon from '../assets/facebookIcon.png';
import useStore from '../store/useStore';

const SignUp = () => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const { signUp, loading, error } = useStore();
  const navigate = useNavigate();

  const showPswdHandler =(e)=> {
    e.preventDefault();
    setShow(!show);
  }
  const signUpHandler = async (e)=>{
    e.preventDefault();
    if(!name || !email || !password || !confirmpassword){
      toast.warning('Please fill all the fields.', {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "colored",
      });
      return;
    }

    if(password !== confirmpassword) {
      toast.warning('Passwords do not match.', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
      });
      return;
    }

    const response = await signUp({ name, email, password });

    if (response) {
      toast.success(data.message || 'Registration successful.', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
      });
      navigate('/login');
    } else {
      toast.error(error || 'Error occurred! Something went wrong.', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
      });
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#85C073D6]">
      <div className="bg-cover bg-center m-10 rounded-lg shadow-lg p-8 w-full max-w-screen-sm" style={{ backgroundImage: `url(${bgImg})` }}>
        <h2 className="text-2xl font-bold text-black mb-6">Create Account</h2>
        <form onSubmit={signUpHandler}>
          <div className="mb-4">
            <TextField
              label="Full Name"
              variant='standard'
              onChange={(e) => setName(e.target.value)}
              value={name}
              sx={{
                width:'300px'
              }}
             />
          </div>
          <div className="mb-4">
            <TextField
              label="Email Address"
              variant='standard'
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              sx={{
                width:'300px'
              }}
             />
          </div>
          <div className="mb-4">
              <TextField
                label="Password"
                variant='standard'
                type={show ? "text":"password"}
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                sx={{
                  width:'300px'
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={showPswdHandler} edge="end">
                        {show ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
               />
          </div>
          <div className="mb-6">
            <div  className='relative'>
              <TextField
                label="Confirm password"
                variant='standard'
                type={show ? "text":"password"}
                onChange={(e) => setConfirmpassword(e.target.value)}
                value={confirmpassword}
                sx={{
                  width:'300px'
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={showPswdHandler} edge="end">
                        {show ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
               />
            </div>
          </div>
          <button
            type="submit"
            className="m px-9 bg-green-600 text-white font-medium py-2 rounded-lg hover:bg-green-700 transition duration-300"
          >
            {loading ? "Signing Up..." : "Signup"}
          </button>
        </form>

        {/* OAuth SignUp */}
        <div className="my-6 flex items-center justify-center text-gray-500">
          <span className="px-2 bg-white">or</span>
        </div>
        <div className="flex justify-center gap-4">
          <button className="flex items-center justify-center bg-gray-100 text-gray-700 border rounded-lg py-2 hover:bg-gray-200 p-3">
            <img
              src={googleIcon}
              alt="Google"
              className="w-6 h-6 mr-2"
            />
            Sign up with Google
          </button>
          <button className="flex items-center justify-center bg-gray-100 text-gray-700 border rounded-lg py-2 hover:bg-gray-200 p-3">
            <img
              src={fbIcon}
              alt="Facebook"
              className="w-6 h-6 mr-2"
            />
            Sign up with Facebook
          </button>
        </div>
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <NavLink to='/login' className="text-green-600 hover:underline">Log In</NavLink>
          </p>
        </div>
      </div>
      <div>
        
      </div>
    </div>
  )
}

export default SignUp;