import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import googleIcon from '../assets/googleIcon.png';
import fbIcon from '../assets/facebookIcon.png'
import useStore from "../store/useStore";
import { GoogleLogin } from "@react-oauth/google";

const LogIn = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { signIn, loading, error } = useStore();
  
  const showPswdHandler =(e)=> {
    e.preventDefault();
    setShow(!show);
  }
  const logInhandler= async (e)=> {
    e.preventDefault();
    if(!email || !password) {
      toast.warning('Please fill all the fields.', {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "colored",
      });
      return;
    }

    const success = await signIn({ email, password });

    if (success) {
      toast.success("Login successful.", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
      });
      navigate("/dashboard");
    } else {
      toast.error(error || "Error occurred! Something went wrong.", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
      });
    }
  }

  const handleLoginSuccess = (credentialResponse) => {
    const token = credentialResponse.credential;

    fetch(`${import.meta.env.VITE_API_URL}/api/auth/google`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    })
      .then((response) => response.json())
      .then(async (data) => {
        
        const success = await signIn({ email: data.email, password: data.password });

        if (success) {
          toast.success("Login successful.", {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
          });
          navigate("/dashboard");
        } else {
          toast.error(error || "Error occurred! Something went wrong.", {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
          });
        }
      })
      .catch((error) => toast.error("Login Failed"));

    navigate("/dashboard");
  };

  const handleLoginFailure = (error) => {
    toast.error("Login Failed");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#85C073D6]">
      <div className="bg-white m-12 rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-black mb-6">Log In</h2>
        <form onSubmit={logInhandler}>
          <div className="mb-4">
            <TextField
              label="Email Address"
              variant="standard"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              sx={{
                width: "300px",
              }}
            />
          </div>
          <div className="mb-4">
            <TextField
              label="Password"
              variant="standard"
              type={show ? "text" : "password"}
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              sx={{
                width: "300px",
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
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

          <div className="mt-2 text-right">
            <NavLink
              to="/forgot-password"
              className="text-sm text-green-600 hover:underline"
            >
              Forgot Password?
            </NavLink>
          </div>
        </form>

        {/* OAuth Log In */}
        <div className="my-6 flex items-center justify-center text-gray-500">
          <span className="px-2 bg-white">or</span>
        </div>
        <div className="flex flex-col gap-4">
          <button className="flex items-center justify-center rounded-lg py-2 ">
          <GoogleLogin 
            onSuccess={handleLoginSuccess}
            onError={handleLoginFailure}
            />
            </button>
        </div>
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <NavLink to="/signup" className="text-green-600 hover:underline">
              Create Account
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
