import { useState, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { Button, AppBar, Toolbar } from "@mui/material";
import theme from "./assets/theme";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import { BrowserRouter, Routes, Route, redirect } from "react-router-dom";
import { Cookies, CookiesProvider, useCookies } from "react-cookie";
import { Home } from "./images/Home";
import axios from "axios";
import { USER_API_URL } from "../constants";
import UserProfile from "./users/UserProfile";
import UserInfo from "./users/UserInfo";
import MinifiedUserInfo from "./users/MinifiedUserInfo";
import SnackBar from "./assets/SnackBar";

function App() {
  const cookie = new Cookies();
  const headers = {
    "Authorization": `Bearer ${cookie.get("access_token")}`
  }
  const [user, setUser] = new useState({});
  useEffect(() => {
    axios.get(`${USER_API_URL}/users/info`, { headers })
      .then(resp => setUser(resp.data))
      .catch(err => console.log(err))
  }, []);
  // comment
  return (
    <ThemeProvider theme={theme}>
      <CookiesProvider>
        <BrowserRouter>
          <AppBar position="static">
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
              {/* Your logo or brand name here */}
              <a href="/" style={{ color: "white", textDecoration: "none" }}>SrInstagram</a>

              {user ? <UserProfile user={user} /> : <Button variant="contained" color="primary">
                Login
              </Button>}
            </Toolbar>
          </AppBar>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/info" element={<UserInfo />} />
            <Route path="/user-info/:userId" element={<MinifiedUserInfo />} />
            {/* Add other routes for protected areas here */}
          </Routes>
        </BrowserRouter>
        <SnackBar />
      </CookiesProvider>
    </ThemeProvider>
  );
}

export default App;
