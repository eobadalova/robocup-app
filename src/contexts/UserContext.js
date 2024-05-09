import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password, navigate) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      const result = await response.json();
      if (response.ok && result.type !== 'ERROR') {
        localStorage.setItem('token', result.data);
        getUserInfo(); // Fetch user details
        navigate('/dashboard');
      } else {
        throw new Error(result.data || 'Incorrect email or password');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const getUserInfo = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      const response = await fetch(`${process.env.REACT_APP_API_URL}api/user/info`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      if (response.ok) {
        setUser(result.data);
        
        // Extract the role names and store them in local storage
        const roles = result.data.roles.map(role => role.name).join(', ');
        const ID = result.data.id;
        localStorage.setItem('roles', roles);
        localStorage.setItem('UserID', ID);
        
  
      } else {
        console.error('Failed to fetch user data');
      }
    }
  };
  

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/robogames/login';
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
