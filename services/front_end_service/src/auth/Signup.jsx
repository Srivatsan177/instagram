import React, { useState } from "react";
import { Box, TextField, Button, Typography, Link } from "@mui/material";
import axios from "axios";
import { USER_API_URL } from "../../constants";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const[dob, setDob] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [cookies, setCookies] = useCookies(["access_token", "refresh_token"]);
  const navigate = useNavigate();
  const handleSubmit = (event) => {
    event.preventDefault();

    // Implement your authentication logic here (e.g., API call)
    // Check for valid credentials and redirect accordingly
    const formUsername = username;
    const formPassword = password;
    const formEmail = email;
    const formDob = dob;
    const formPhoneNumber = phoneNumber;
    const formName = name;
    axios
      .post(`${USER_API_URL}/auth/sign_up`, {
        username: formUsername,
        password: formPassword,
        email: formEmail,
        dob: formDob,
        phone_number: formPhoneNumber,
        name: formName,
      })
      .then((response) => {
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
        setError("Invalid username or password.");
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
          type="input"
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
        <TextField
          label="Name"
          type="input"
          value={name}
          onChange={(event) => setName(event.target.value)}
          error={Boolean(error)}
          helperText={error}
          sx={{ mb: 2 }}
          fullWidth
          required
        />
        <TextField
          label="Phone Number"
          type="input"
          value={phoneNumber}
          onChange={(event) => setPhoneNumber(event.target.value)}
          error={Boolean(error)}
          helperText={error}
          sx={{ mb: 2 }}
          fullWidth
          required
        />
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={Boolean(error)}
          helperText={error}
          sx={{ mb: 2 }}
          fullWidth
          required
        />
        <TextField
          label="DOB"
          type="date"
          value={dob}
          onChange={(event) => setDob(event.target.value)}
          error={Boolean(error)}
          helperText={error}
          sx={{ mb: 2 }}
          fullWidth
          required
        />
        <Button type="submit" variant="contained" sx={{ mb: 2 }}>
          Sign Up
        </Button>
      </Box>
    </Box>
  );
}

export default Signup;
