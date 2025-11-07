import { Link } from 'react-router-dom';
import { FaRegStarHalf } from "react-icons/fa";

export default function Navbar({ auth }) {
  const onLogout=()=>{

  }
  return (
    <div className="flex gap-3 p-3 border-b border-cyan-300 bg-cyan-600 flex justify-between">
      <h2 className="text-lg font-semibold text-white flex justify-center items-center"
><FaRegStarHalf />RateBee<FaRegStarHalf className='transform scale-x-[-1]' /></h2>
      {!auth && <Link className="text-white" to="/login">Login</Link>}
      {!auth && <Link className="text-white" to="/register">Register</Link>}
      {auth?.role === 'USER' && <Link className="text-white" to="/stores"></Link>}
      {auth?.role === 'ADMIN' && <Link className="text-white" to="/admin"></Link>}
      {auth?.role === 'STORE_OWNER' && <Link className="text-white" to="/owner"></Link>}
      {auth && <button className="text-white" onClick={onLogout}>Logout</button>}
    </div>
  );
}