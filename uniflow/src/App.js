import React, { useEffect, useState } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { Routes, Route } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import DashBord from './pages/DashBord';
import Qr from './pages/Qr';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <div className='app'>
      {user ? (
        <>
          <Routes>
            <Route path='/' element={<DashBord />} />
            <Route path='/qr' element={<Qr />} />
          </Routes>
        </>
      ) : (
        <>
          <Signup />
          <hr />
          <Login />
        </>
      )}
    </div>
  );
}

export default App;
