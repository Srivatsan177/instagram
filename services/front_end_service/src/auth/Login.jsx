import React, { useState } from "react";
import { Box, TextField, Button, Typography, Link } from "@mui/material";
import axios from "axios";
import { USER_API_URL } from "../../constants";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cookies, setCookies] = useCookies(["access_token", "refresh_token"]);
  const navigate = useNavigate();
  const handleSubmit = (event) => {
    event.preventDefault();

    // Implement your authentication logic here (e.g., API call)
    // Check for valid credentials and redirect accordingly
    const formUsername = username;
    const formPassword = password;
    axios
      .post(`${USER_API_URL}/auth/login`, {
        username: formUsername,
        password: formPassword,
      })
      .then((response) => {
        // Handle successful login (e.g., redirect, store token)
        const data = response.data;
        const accessToken = data.access_token;
        const refreshToken = data.refresh_token;
        setCookies("access_token", refreshToken, {
          path: "/",
          maxAge: 24 * 60 * 60,
        });
        setCookies("refresh_token", refreshToken, {
          path: "/",
          maxAge: 24 * 60 * 60,
        });
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
        setError("Invalid username or password.");
        // Handle errors (e.g., display error message)
      });
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          maxWidth: 400,
          p: 3,
          borderRadius: 5,
          bgcolor: "background.paper",
          boxShadow: 3,
        }}
      >
        <Typography variant="h5" component="h1" sx={{ mb: 3 }}>
          Login
        </Typography>
        <TextField
          label="Username"
          type="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          error={Boolean(error)}
          helperText={error}
          sx={{ mb: 2 }}
          fullWidth
          required
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={Boolean(error)}
          helperText={error}
          sx={{ mb: 2 }}
          fullWidth
          required
        />
        <Button type="submit" variant="contained" sx={{ mb: 2 }}>
          Sign in
        </Button>
        <Link href="#" sx={{ display: "flex", justifyContent: "center" }}>
          Forgot password?
        </Link>
        <Link href="/signup" sx={{ display: "flex", justifyContent: "center" }}>
          Create Account?
        </Link>
      </Box>
    </Box>
  );
}

export default Login;
