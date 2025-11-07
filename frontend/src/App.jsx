import { Routes, Route } from 'react-router-dom';

import Login from './pages/utility/Login';
import Register from './pages/utility/Register';
import Admin from './pages/admin';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}

export default App;