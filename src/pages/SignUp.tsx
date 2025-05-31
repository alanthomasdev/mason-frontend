import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "";

//   console.log("API URL:", API_URL);


  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return alert("Name is required.");
    if (!validateEmail(email)) return alert("Enter a valid email.");
    if (password.length < 6)
      return alert("Password must be at least 6 characters.");
    if (password !== confirmPassword)
      return alert("Passwords do not match.");

    try {
      const res = await axios.post(`${API_URL}/api/auth/signup`, {
        name,
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err: any) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="w-full flex flex-wrap h-screen">
      <div className="w-1/2 shadow-2xl hidden xl:block">
        <img
          className="object-cover w-full h-screen"
          src="https://images.pexels.com/photos/3127880/pexels-photo-3127880.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Signup Visual"
        />
      </div>

      <div className="w-full xl:w-1/2 flex flex-col">
        <div className="flex justify-center xl:justify-start pt-12 xl:pl-12 xl:-mb-12">
          <a href="#" className="bg-black text-white font-bold text-xl p-4">
            Notes
          </a>
        </div>

        <div className="flex flex-col justify-center my-auto px-8 xl:px-24 lg:px-32">
          <p className="text-center text-3xl">Join Us.</p>

          <form onSubmit={handleSignup} className="flex flex-col pt-6">
            <div className="flex flex-col pt-4">
              <label htmlFor="name" className="text-lg">
                Name
              </label>
              <input
                type="text"
                id="name"
                placeholder="John Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="shadow border rounded w-full py-2 px-3 mt-1 focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="flex flex-col pt-4">
              <label htmlFor="email" className="text-lg">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="shadow border rounded w-full py-2 px-3 mt-1 focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="flex flex-col pt-4 relative">
              <label htmlFor="password" className="text-lg">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="shadow border rounded w-full py-2 px-3 mt-1 focus:outline-none focus:shadow-outline"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-15 text-sm text-blue-600 focus:outline-none"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <div className="flex flex-col pt-4">
              <label htmlFor="confirm-password" className="text-lg">
                Confirm Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="confirm-password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="shadow border rounded w-full py-2 px-3 mt-1 focus:outline-none focus:shadow-outline"
              />
            </div>

            <button
              type="submit"
              className="bg-black text-white font-bold text-lg hover:bg-gray-700 p-2 mt-8"
            >
              Register
            </button>
          </form>

          <div className="text-center pt-12 pb-12">
            <p>
              Already have an account?{" "}
              <a href="/login" className="underline font-semibold">
                Log in here.
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
