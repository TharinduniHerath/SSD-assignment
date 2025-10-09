// import React, { createContext, useContext, useState, useEffect } from "react";
// import Cookies from "js-cookie";
// import PropTypes from "prop-types";
// import axiosClient from "../axios-client"; // Add this import

// const StateContext = createContext({
//   user: null,
//   token: null,
//   setUser: () => { },
//   setToken: () => { },
// });

// export const ContextProvider = ({ children }) => {
//   const storedUser = Cookies.get("_user");
//   const [user, _setUser] = useState(storedUser ? JSON.parse(storedUser) : null);
//   const [token, _setToken] = useState(Cookies.get("_auth"));

//   // ADD this useEffect to check for OAuth users on app load
//   useEffect(() => {
//     const checkOAuthUser = async () => {
//       // Only check for OAuth if no regular user is already set
//       if (!user) {
//         try {
//           const response = await axiosClient.get('/auth/profile');
//           if (response.data.user) {
//             console.log('OAuth user found:', response.data.user);
//             setUser(response.data.user);
//           }
//         } catch (error) {
//           console.log('No OAuth user found');
//           // This is normal if user isn't logged in via OAuth
//         }
//       }
//     };

//     checkOAuthUser();
//   }, []); // Empty dependency array means this runs once on mount

//   const setToken = (token) => {
//     _setToken(token);
//     if (token) {
//       Cookies.set("_auth", token, { expires: 0.5 });
//     } else {
//       Cookies.remove("_auth");
//     }
//   };

//   console.log('user', user);

//   const setUser = (user) => {
//     _setUser(user);
//     if (user) {
//       // Only set _user cookie for regular users, not OAuth users
//       if (user.provider !== 'google') {
//         Cookies.set("_user", JSON.stringify(user), { expires: 0.5 });
//       }
//       console.log("User set:", user);
//     } else {
//       Cookies.remove("_user");
//     }
//   };

//   return (
//     <StateContext.Provider
//       value={{
//         user,
//         token,
//         setUser,
//         setToken,
//       }}
//     >
//       {children}
//     </StateContext.Provider>
//   );
// };

// ContextProvider.propTypes = {
//   children: PropTypes.node.isRequired,
// };

// export const useStateContext = () => useContext(StateContext);

import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import PropTypes from "prop-types";

const StateContext = createContext({
  user: null,
  token: null,
  setUser: () => { },
  setToken: () => { },
});

export const ContextProvider = ({ children }) => {
  const storedUser = Cookies.get("_user");
  const [user, _setUser] = useState(storedUser ? JSON.parse(storedUser) : null);
  const [token, _setToken] = useState(Cookies.get("_auth"));

  const setToken = (token) => {
    console.log('NavigationContext: Setting token:', token ? 'present' : 'null');
    _setToken(token);
    if (token) {
      Cookies.set("_auth", token, { expires: 0.5 });
    } else {
      Cookies.remove("_auth");
    }
  };

  const setUser = (newUser) => {
    console.log('NavigationContext: setUser called with:', newUser);
    _setUser(newUser);
    
    if (newUser) {
      // Only set _user cookie for regular users, not OAuth users
      if (newUser.provider !== 'google') {
        console.log('NavigationContext: Setting regular user cookie');
        Cookies.set("_user", JSON.stringify(newUser), { expires: 0.5 });
      } else {
        console.log('NavigationContext: OAuth user, not setting _user cookie');
      }
    } else {
      console.log('NavigationContext: Clearing user cookie');
      Cookies.remove("_user");
    }
  };

  return (
    <StateContext.Provider
      value={{
        user,
        token,
        setUser,
        setToken,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

ContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useStateContext = () => useContext(StateContext);