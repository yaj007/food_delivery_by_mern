
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import ChangePassword from './pages/ChangePassword';
import AdminDashboard from './pages/AdminDashboard'; // Add this import

function App() {
  const isUserSignedIn = !!localStorage.getItem('token');

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        {isUserSignedIn && <Route path='/profile' element={<Profile />} />}
        {isUserSignedIn && <Route path='/change-password' element={<ChangePassword />} />}
        {isUserSignedIn && <Route path='/admin' element={<AdminDashboard />} />} {/* Add this route */}
      </Routes>
    </div>
  );
}

export default App;