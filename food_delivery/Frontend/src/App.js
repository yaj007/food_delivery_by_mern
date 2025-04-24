// import { Routes, Route } from 'react-router-dom';
// import './App.css';
// import Navbar from './components/Navbar';
// import Home from './pages/Home';
// import Login from './pages/Login';
// import SignUp from './pages/SignUp';
// import Profile from './pages/Profile';
// import ChangePassword from './pages/ChangePassword'; // Corrected import

// function App() {
//   const isUserSignedIn = !!localStorage.getItem('token');

//   return (
//     <div className="App">
//       <Navbar />
//       <Routes>
//         <Route path='/' element={<Home />} />
//         <Route path='/login' element={<Login />} />
//         <Route path='/signup' element={<SignUp />} />
//         {isUserSignedIn && <Route path='/profile' element={<Profile />} />}
//         {isUserSignedIn && <Route path='/change-password' element={<ChangePassword />} />}
//       </Routes>
//     </div>
//   );
// }

// export default App;
"use client"

// import { useState, useEffect } from "react"
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
// import Home from "./pages/Home"
// import Login from "./pages/Login"
// import SignUp from "./pages/SignUp"
// import Profile from "./pages/Profile"
// import ChangePassword from "./pages/ChangePassword"
// import { auth } from "./firebase"
// import { onAuthStateChanged } from "firebase/auth"
// // Add the import for AdminDashboard
// import AdminDashboard from "./pages/AdminDashboard"

// function App() {
//   const [isUserSignedIn, setIsUserSignedIn] = useState(false)

//   useEffect(() => {
//     onAuthStateChanged(auth, (user) => {
//       if (user) {
//         setIsUserSignedIn(true)
//       } else {
//         setIsUserSignedIn(false)
//       }
//     })
//   }, [])

//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<SignUp />} />
//         {isUserSignedIn && <Route path="/profile" element={<Profile />} />}
//         {isUserSignedIn && <Route path="/change-password" element={<ChangePassword />} />}
//         {isUserSignedIn && <Route path="/admin" element={<AdminDashboard />} />}
//       </Routes>
//     </Router>
//   )
// }

// export default App
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