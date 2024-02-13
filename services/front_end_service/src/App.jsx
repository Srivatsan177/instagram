import * as React from "react";
import { ThemeProvider } from "@mui/material/styles";
import {Button, AppBar, Toolbar} from "@mui/material";
import theme from "./assets/theme";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import { BrowserRouter, Routes, Route, redirect } from "react-router-dom";
import { CookiesProvider, useCookies } from "react-cookie";
import { Home } from "./images/Home";
function App() {
  // comment
  return (
    <ThemeProvider theme={theme}>
      <CookiesProvider>
        <AppBar position="static">
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            {/* Your logo or brand name here */}
            <a href="/" style={{color: "white", textDecoration: "none"}}>SrInstagram</a>

            <Button variant="contained" color="primary">
              Login
            </Button>
          </Toolbar>
        </AppBar>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            {/* Add other routes for protected areas here */}
          </Routes>
        </BrowserRouter>
      </CookiesProvider>
    </ThemeProvider>
  );
}

export default App;
