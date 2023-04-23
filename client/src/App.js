import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from '@mui/material'
import { indigo, amber } from '@mui/material/colors'
import { createTheme } from "@mui/material/styles";
import React, { useState, useEffect} from "react";

import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from "./pages/ProfilePage";
import SearchBusinessPage from "./pages/SearchBusinessPage";
import BusinessInfoPage from "./pages/BusinessInfoPage";

// createTheme enables you to customize the look and feel of your app past the default
// in this case, we only change the color scheme
export const theme = createTheme({
  palette: {
    primary: indigo,
    secondary: amber,
  },
});

// App is the root component of our application and as children contain all our pages
// We use React Router's BrowserRouter and Routes components to define the pages for
// our application, with each Route component representing a page and the common
// NavBar component allowing us to navigate between pages (with hyperlinks)
export default function App() {
  const [isLoggedIn, setIsLoggedIn] =useState(false);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    console.log('isLoggedIn: ' + isLoggedIn);
  }, [isLoggedIn]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <NavBar isLoggedIn={isLoggedIn} />
        <Routes>
          <Route path="/" element={isLoggedIn ? <HomePage username={username} userId={userId} /> : <LoginPage updateLoggedInStatus={setIsLoggedIn} updateUsername={setUsername} updateUserId={setUserId}/>} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/search_business" element={<SearchBusinessPage/>} />
          <Route path="/business/:business_id" element={<BusinessInfoPage userId={userId} isLoggedIn={isLoggedIn} />} />
          {isLoggedIn ? 
              <Route path="/profile" element={<ProfilePage username={username} userId={userId}/>} />
            : <Route/>
          }
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}