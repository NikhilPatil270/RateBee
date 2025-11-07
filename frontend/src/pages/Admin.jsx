import Navbar from "./utility/Navbar";
import { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';

const Admin = () => {
    let roles = { role: "ADMIN" };
    let usersq = [{ id: 1, name: "Nikhil" }, { id: 2, name: "Nikhil" }];
    let storesq = [
        { id: 1, name: "Dept store 1", ratings: 4.5, address: "ABC street, XYZ Cross, IN" },
        { id: 2, name: "Dept store 2", ratings: 3, address: "SDF marg Bakery galli, somewhere in IN" }
    ];
    const [stats, setStats] = useState({ stores: 243, ratings: 100443 });
    const [users, setUsers] = useState([]);
    const [stores, setStores] = useState([]);
    const [activeTab, setActiveTab] = useState('users'); // State to manage active tab

    useEffect(() => {
        // Fetch stats, users, and stores from API
        const fetchData = async () => {
            // Example API calls
            const statsResponse = await fetch('/api/stats');
            const usersResponse = await fetch('/api/users');
            const storesResponse = await fetch('/api/stores');
            setStats(await statsResponse.json());
            setUsers(await usersResponse.json());
            setStores(await storesResponse.json());
        };
        fetchData();
    }, []);

    // Function to truncate text if it exceeds a certain length
    const truncateText = (text, length) => {
        return text.length > length ? text.substring(0, length) + '...' : text;
    };

    return (
        <div className="bg-white min-h-screen">
            <Navbar auth={roles} />
            <div className="p-6">
                <h1 className="text-2xl font-bold text-cyan-600">Admin Dashboard</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                    <div className="bg-cyan-100 p-4 rounded-lg shadow">
                        <h2 className="text-lg font-semibold">Number of Stores</h2>
                        <p className="text-3xl font-bold text-cyan-600">{stats.stores}</p> {/* Increased font size and made bold */}
                    </div>
                    <div className="bg-cyan-100 p-4 rounded-lg shadow">
                        <h2 className="text-lg font-semibold">Number of Ratings</h2>
                        <p className="text-3xl font-bold text-cyan-600">{stats.ratings}</p> {/* Increased font size and made bold */}
                    </div>
                    <div className="bg-cyan-100 p-4 rounded-lg shadow">
                        <h2 className="text-lg font-semibold">Admin Options</h2>
                        <div className="flex flex-col mt-2 grid grid-cols-2 gap-2">
                            <button className="mb-2 bg-cyan-600 text-white p-2 rounded">Add User</button>
                            <button className="mb-2 bg-cyan-600 text-white p-2 rounded">Add Store</button>
                        </div>
                    </div>
                </div>
                <div className="p-4 mt-4">
                    <h2 className="text-lg font-semibold text-cyan-600">Manage Users and Stores</h2>
                    <div className="flex space-x-4 mt-2">
                        <button 
                            className={`p-2 border-b-2 ${activeTab === 'users' ? 'border-cyan-600 text-cyan-600' : 'border-transparent text-cyan-600'}`} 
                            onClick={() => setActiveTab('users')}
                        >
                            List Users
                        </button>
                        <button 
                            className={`p-2 border-b-2 ${activeTab === 'stores' ? 'border-cyan-600 text-cyan-600' : 'border-transparent text-cyan-600'}`} 
                            onClick={() => setActiveTab('stores')}
                        >
                            List Stores
                        </button>
                    </div>
                    <hr className="my-2 border-gray-300" />
                    <div className="mt-4">
                        {activeTab === 'users' ? (
                            <div>
                                <ul className="grid grid-cols-2 gap-4">
                                    {users.map(user => (
                                        <li key={user.id} className="p-4 bg-cyan-50 rounded-lg shadow hover:shadow-lg transition-shadow">
                                            {user.name}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <div>
                                <ul className="grid grid-cols-2 gap-4">
                                    {stores.map(store => (
                                        <li key={store.id} className="flex flex-col justify-between p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                                            <div className="flex justify-between items-center">
                                                <span>{store.name}</span>
                                                <span className="flex items-center">
                                                    {store.ratings} <FaStar className="text-yellow-500 ml-1" />
                                                </span>
                                            </div>
                                            <span className="text-gray-600 text-sm mt-1">{truncateText(store.address, 30)}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;