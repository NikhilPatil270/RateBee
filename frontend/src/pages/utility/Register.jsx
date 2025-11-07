import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        address: "",   // ✅ Address added
        password: "",
        confirmPassword: "",
        role: "USER",
    });

    const [errors, setErrors] = useState({});
   

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        const errs = {};

        if (!form.name.trim()) errs.name = "Name is required";

        if (!form.email.trim()) errs.email = "Email is required";
        else if (!/^\S+@\S+\.\S+$/.test(form.email))
            errs.email = "Invalid email format";

        if (!form.address.trim()) errs.address = "Address is required";
        else if (form.address.length > 400)
            errs.address = "Address cannot exceed 400 characters";

        if (!form.password) errs.password = "Password is required";
        else if (form.password.length < 6)
            errs.password = "Minimum 6 characters needed";

        if (!form.confirmPassword)
            errs.confirmPassword = "Confirm your password";
        else if (form.password !== form.confirmPassword)
            errs.confirmPassword = "Passwords do not match";

        return errs;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errs = validate();
        setErrors(errs);

        if (Object.keys(errs).length > 0) return;

        try {
            const response = await axios.post(
                "http://localhost:3000/api/auth/register",
                {
                    name: form.name,
                    email: form.email,
                    address: form.address,   
                    password: form.password,
                    role: form.role,
                },{ withCredentials: true}
            );

            if (response && response.data) {
                navigate("/");
            }
        } catch (err) {
            if (err && err.response) {
                setErrors({ apiError: err.response.data.message });
            }
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-cyan-50 px-4">
            <div className="max-w-md w-full bg-white p-6 rounded-lg shadow">
                <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
                    Create an account
                </h1>

                {errors.apiError && (
                    <p className="text-red-600 text-center mb-2">
                        {errors.apiError}
                    </p>
                )}

                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Name
                            </label>
                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-cyan-500 ${
                                    errors.name ? "border-red-500" : "border-gray-300"
                                }`}
                                placeholder="Your full name"
                                autoComplete="name"
                            />
                        </div>

                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-cyan-500 ${
                                    errors.email ? "border-red-500" : "border-gray-300"
                                }`}
                                placeholder="you@example.com"
                                autoComplete="email"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Address
                            </label>
                            <textarea
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                rows="3"
                                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-cyan-500 ${
                                    errors.address ? "border-red-500" : "border-gray-300"
                                }`}
                                placeholder="Enter full address"
                            ></textarea>
                            {errors.address && (
                                <span className="text-sm text-red-600">{errors.address}</span>
                            )}
                        </div>

                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                name="password"
                                type="password"
                                value={form.password}
                                onChange={handleChange}
                                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-cyan-500 ${
                                    errors.password ? "border-red-500" : "border-gray-300"
                                }`}
                                placeholder="Enter password"
                                autoComplete="new-password"
                            />
                        </div>

                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Confirm Password
                            </label>
                            <input
                                name="confirmPassword"
                                type="password"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                
                                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-cyan-400 border-gray-300"
                                placeholder="Re-type password"
                                autoComplete="new-password"
                            />

                            <div className="flex items-center justify-between mt-1">
                                {errors.confirmPassword ? (
                                    <span className="text-sm text-red-600">
                                        {errors.confirmPassword}
                                    </span>
                                ) : (
                                    <span className="text-sm text-gray-500">
                                        Pasting disabled
                                    </span>
                                )}
                                
                            </div>
                        </div>

                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Role
                            </label>
                            <select
                                name="role"
                                value={form.role}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-cyan-400 bg-white border-gray-300"
                            >
                                <option value="USER">User</option>
                                <option value="STORE_OWNER">Owner</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                        </div>

                       
                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-md focus:ring-2 focus:ring-cyan-400"
                        >
                            Register
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-400">
                        Already a member?
                        <Link
                            to="/"
                            className="font-bold text-cyan-600 hover:underline ml-1"
                        >
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
