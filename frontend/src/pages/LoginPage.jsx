import { useContext, useState } from "react";
import assets from "../assets/assets";
import { AuthContext } from "../../context/authContext";

const LoginPage = () => {
  const [currState, setCurrState] = useState("signup");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {login} = useContext(AuthContext);

  const onSubmitHandle = (e) => {
    e.preventDefault();
    if (currState === "signup" && !isSubmitted) {
      setIsSubmitted(true);
      return;
    }
    login(currState === "signup" ? "signup" : "login", { fullName, email, password ,bio});
  };

  return (
    <div className="min-h-screen bg- cover bg-center flex items-center justify-center gap-6 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl">
      {/* Left side */}
      <img src={assets.logo_big} alt="" className="w-50" />

      {/* Right side */}
      <form
        onSubmit={onSubmitHandle}
        className="border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg"
      >
        <h2 className="font-medium text-2xl flex justify-between items-center">
          {currState}

          {/*//? Back arrow */}
          {currState === "signup" && isSubmitted && (
            <img
              onClick={() => setIsSubmitted(false)}
              src={assets.arrow_icon}
              alt=""
              className="w-5 cursor-pointer"
            />
          )}
        </h2>

        
        {currState === "signup" && !isSubmitted && (
          <>
            <input
              onChange={(e) => setFullName(e.target.value)}
              value={fullName}
              type="text"
              placeholder="Full name"
              className="p-2 border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />

            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="text"
              placeholder="Email"
              className="p-2 border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />

            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder="Password"
              className="p-2 border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </>
        )}

        {/* STEP 2 → Bio only */}
        {currState === "signup" && isSubmitted && (
          <textarea
            rows={4}
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            placeholder="Bio (optional)"
            className="p-2 border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        )}

        
        {currState === "login" && (
          <>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="text"
              placeholder="Email"
              className="p-2 border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />

            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder="Password"
              className="p-2 border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </>
        )}

        <button
          type="submit"
          className="py-3 bg-linear-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer"
        >
          {currState === "signup"
            ? isSubmitted
              ? "Finish Sign Up"
              : "Create Account"
            : "Login Now"}
        </button>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <input type="checkbox" />
          <p>Agree to the terms of use & privacy policy</p>
        </div>

        {/* Toggle */}
        <div className="flex flex-col gap-3">
          {currState === "signup" ? (
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <span
                className="text-purple-500 font-medium cursor-pointer"
                onClick={() => {
                  setCurrState("login");
                  setIsSubmitted(false);
                }}
              >
                Login Here
              </span>
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <span
                className="text-purple-500 font-medium cursor-pointer"
                onClick={() => setCurrState("signup")}
              >
                Sign up
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
