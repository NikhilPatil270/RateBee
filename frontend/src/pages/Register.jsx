import { useState } from "react";
import {Link} from 'react-router-dom';

export default function Register() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
    });
    const [errors, setErrors] = useState({});
    const [pasteBlocked, setPasteBlocked] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((s) => ({ ...s, [name]: value }));
    };

    const validate = () => {
        const errs = {};
        if (!form.name.trim()) errs.name = "Name is required";
        if (!form.email.trim()) errs.email = "Email is required";
        else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Invalid email";
        if (!form.password) errs.password = "Password is required";
        else if (form.password.length < 6) errs.password = "At least 6 characters";
        if (!form.confirmPassword) errs.confirmPassword = "Confirm your password";
        else if (form.password !== form.confirmPassword)
            errs.confirmPassword = "Passwords do not match";
        return errs;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errs = validate();
        setErrors(errs);
        if (Object.keys(errs).length === 0) {
            // Replace with real submit logic
            console.log("Submitting", form);
            // clear or navigate...
        }
    };

    // Block copy/paste/cut on confirm password field
    const blockClipboard = (e) => {
        e.preventDefault();
        setPasteBlocked(true);
        setTimeout(() => setPasteBlocked(false), 1800);
    };

    const blockPasteKey = (e) => {
        // Block Ctrl+V / Cmd+V
        if ((e.ctrlKey || e.metaKey) && (e.key === "v" || e.key === "V")) {
            e.preventDefault();
            setPasteBlocked(true);
            setTimeout(() => setPasteBlocked(false), 1800);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-cyan-50 px-4">
            <div className="max-w-md w-full bg-white p-2 rounded-lg shadow">
                <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Create an account</h1>
                <div class="sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Name
                            </label>
                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 ${errors.name ? "border-red-500" : "border-gray-300"}`}
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
                                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 ${errors.email ? "border-red-500" : "border-gray-300"}`}
                                placeholder="you@example.com"
                                autoComplete="email"
                            />
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
                                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 ${errors.password ? "border-red-500" : "border-gray-300"}`}
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
                                onPaste={blockClipboard}
                                onCopy={blockClipboard}
                                onCut={blockClipboard}
                                onKeyDown={blockPasteKey}
                                onContextMenu={(e) => {
                                    // optional: block right-click menu to discourage paste
                                    e.preventDefault();
                                    setPasteBlocked(true);
                                    setTimeout(() => setPasteBlocked(false), 800);
                                }}
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 border-gray-300"
                                placeholder="Re-type password"
                                autoComplete="new-password"
                                aria-describedby="confirmHelp"
                            />
                            <div className="flex items-center justify-between mt-1">
                                {errors.confirmPassword ? (
                                    <p className="text-sm text-red-600">{errors.confirmPassword}</p>
                                ) : (
                                    <p id="confirmHelp" className="text-sm text-gray-500">
                                        Pasting into this field is disabled
                                    </p>
                                )}
                                {pasteBlocked && (
                                    <p className="text-sm text-yellow-600">Paste blocked</p>
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
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-white border-gray-300"
                            >
                                <option>User</option>
                                <option>Owner</option>
                                <option>Admin</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        >
                            Register
                        </button>
                    </form>
                    <p class="mt-10 text-center text-sm/6 text-gray-400">
                        Already a member?
                        <a href="#" class="font-bold text-cyan-600 hover:underline"><Link to="/">Login </Link></a>
                    </p>
                </div>
            </div>
        </div>
    );
}