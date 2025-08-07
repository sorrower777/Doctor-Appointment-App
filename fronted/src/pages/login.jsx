import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner.jsx";

const Login = () => {
  const navigate = useNavigate();
  const { login, register, isLoading, isAuthenticated } =
    useContext(AppContext);

  const [state, setState] = useState("Sign Up");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const validateForm = () => {
    const newErrors = {};

    if (state === "Sign Up" && !name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(password)) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    if (state === "Sign Up") {
      if (!confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (state === "Sign Up") {
        const success = await register({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
        });
        if (success) {
          navigate("/");
        }
      } else {
        const success = await login({
          email: email.trim().toLowerCase(),
          password,
        });
        if (success) {
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Authentication error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setConfirmPassword("");
    setRememberMe(false);
    setErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleStateChange = (newState) => {
    setState(newState);
    resetForm();
  };

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[88vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-sm shadow-lg bg-white">
        <p className="text-2xl font-semibold text-center w-full">
          {state === "Sign Up" ? "Create Account" : "Welcome Back"}
        </p>
        <p className="text-gray-600 text-center w-full">
          Please {state === "Sign Up" ? "sign up" : "log in"} to book
          appointment
        </p>

        {/* Full Name Field - Only for Sign Up */}
        {state === "Sign Up" && (
          <div className="w-full">
            <p className="text-gray-700 font-medium">Full Name</p>
            <input
              className={`border rounded w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.name ? "border-red-500" : "border-zinc-300"
              }`}
              type="text"
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({ ...errors, name: "" });
              }}
              value={name}
              placeholder="Enter your full name"
              required={state === "Sign Up"}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>
        )}

        {/* Email Field */}
        <div className="w-full">
          <p className="text-gray-700 font-medium">Email</p>
          <input
            className={`border rounded w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-primary ${
              errors.email ? "border-red-500" : "border-zinc-300"
            }`}
            type="email"
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors({ ...errors, email: "" });
            }} 
            value={email}
            placeholder="Enter your email"
            required
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="w-full">
          <p className="text-gray-700 font-medium">Password</p>
          <div className="relative">
            <input
              className={`border rounded w-full p-2 mt-1 pr-10 focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.password ? "border-red-500" : "border-zinc-300"
              }`}
              type={showPassword ? "text" : "password"}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: "" });
              }}
              value={password}
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              className="absolute right-2 top-3 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password Field - Only for Sign Up */}
        {state === "Sign Up" && (
          <div className="w-full">
            <p className="text-gray-700 font-medium">Confirm Password</p>
            <div className="relative">
              <input
                className={`border rounded w-full p-2 mt-1 pr-10 focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.confirmPassword ? "border-red-500" : "border-zinc-300"
                }`}
                type={showConfirmPassword ? "text" : "password"}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword)
                    setErrors({ ...errors, confirmPassword: "" });
                }}
                value={confirmPassword}
                placeholder="Confirm your password"
                required={state === "Sign Up"}
              />
              <button
                type="button"
                className="absolute right-2 top-3 text-gray-500 hover:text-gray-700"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>
        )}

        {/* Remember Me - Only for Login */}
        {state === "Login" && (
          <div className="w-full flex items-center gap-2">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label
              htmlFor="rememberMe"
              className="text-sm text-gray-700 cursor-pointer"
            >
              Remember me for 30 days
            </label>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 rounded-md text-base font-medium transition duration-300 flex items-center justify-center gap-2 ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-primary text-white hover:bg-blue-600 active:bg-blue-700"
          }`}
        >
          {isLoading && <LoadingSpinner size="sm" />}
          {isLoading
            ? state === "Sign Up"
              ? "Creating Account..."
              : "Logging in..."
            : state === "Sign Up"
            ? "Create Account"
            : "Login"}
        </button>

        {/* Toggle between Login and Sign Up */}
        <div className="w-full text-center">
          {state === "Sign Up" ? (
            <p className="text-gray-600">
              Already have an account?
              <span
                onClick={() => handleStateChange("Login")}
                className="text-primary underline cursor-pointer hover:text-blue-600 ml-1"
              >
                Login here
              </span>
            </p>
          ) : (
            <p className="text-gray-600">
              Create a new account?
              <span
                onClick={() => handleStateChange("Sign Up")}
                className="text-primary underline cursor-pointer hover:text-blue-600 ml-1"
              >
                Sign up here
              </span>
            </p>
          )}
        </div>

        {/* Demo Credentials Info */}
        {state === "Login" && (
          <div className="w-full p-3 bg-gray-50 rounded border text-xs text-gray-600">
            <p className="font-medium mb-1">Demo Credentials:</p>
            <p>Email: demo@example.com</p>
            <p>Password: demo123</p>
            <button
              type="button"
              onClick={() => {
                setEmail("demo@example.com");
                setPassword("demo123");
              }}
              className="mt-2 text-primary underline hover:text-blue-600"
            >
              Use Demo Credentials
            </button>
          </div>
        )}
      </div>
    </form>
  );
};

export default Login;
