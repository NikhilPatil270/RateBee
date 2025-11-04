import { useState, useEffect } from "react";
import {Link} from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const saved = localStorage.getItem("loginEmail");
        if (saved) {
            setEmail(saved);
            setRemember(true);
        }
    }, []);

    const validate = () => {
        const e = {};
        if (!email) e.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email";
        if (!password) e.password = "Password is required";
        else if (password.length < 6) e.password = "Password must be at least 6 characters";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = (ev) => {
        ev.preventDefault();
        if (!validate()) return;
        setLoading(true);
        // replace with real API call
        setTimeout(() => {
            setLoading(false);
            if (remember) localStorage.setItem("loginEmail", email);
            else localStorage.removeItem("loginEmail");
            // navigate("/dashboard");
        }, 1000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-cyan-50 px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
                <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Sign in to your account</h1>
                <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="text-sm font-medium text-gray-700">Email address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 ${errors.email ? "border-red-500" : "border-gray-300"}`}
                                aria-invalid={errors.email ? "true" : "false"}
                            />
                            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                        </div>

                        <div>
                            <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
                            <div className="mt-1 relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 ${errors.password ? "border-red-500" : "border-gray-300"}`}
                                    aria-invalid={errors.password ? "true" : "false"}
                                />
                                <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-cyan-500">
                                    {showPassword ? "Hide":"Show"}
                                </button>
                            </div>
                            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center text-sm">
                                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-4 w-4 text-cyan-600 border-gray-300 rounded" />
                                <span className="ml-2 text-gray-700">Remember me</span>
                            </label>
                            <a href="#" className="text-sm text-cyan-600 hover:underline">Forgot password?</a>
                        </div>

                        <div>
                            <button type="submit" disabled={loading} className="w-full flex items-center justify-center px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 disabled:opacity-50">
                                {loading ? "Signing in..." : "Sign in"}
                            </button>
                        </div>
                    </form>
                    <p class="mt-10 text-center text-sm/6 text-gray-400">
                        Not a member?
                        <a href="#" class="font-bold text-cyan-600 hover:underline"><Link to="/register">Register </Link></a>
                    </p>
                </div>

            </div>
        </div>
    );
}