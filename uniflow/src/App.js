import React, { useEffect, useState } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Signup from './components/Signup';
import Login from './components/Login';
import DashBord from './pages/DashBord';

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
          <DashBord/>
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
