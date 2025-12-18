import { Button, Grid, TextField } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../services/axiosInstance";

const Login = () => {
  const navigate = useNavigate();
  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });
  const [error, setError] = React.useState("");

  return (
    <div style={{ padding: "20px" }}>
      <h1>Login</h1>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Email"
            value={user.email}
            fullWidth
            onChange={(e) => {
              setUser({ ...user, email: e.target.value });
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Password"
            value={user.password}
            fullWidth
            type="password"
            onChange={(e) => {
              setUser({ ...user, password: e.target.value });
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            onClick={(e) => {
              if (!user.email || !user.password) {
                setError("Please fill in all fields");
                return;
              }
              axiosInstance
                // .post("/api/auth", user)
                .post("/api/users/login", user) // Trying the new login route first
                .then((res) => {
                  console.log(res.data);
                  localStorage.setItem("jwt_access_token", res.data);
                  window.location.replace("/admin");
                })
                .catch((e) => {
                  console.log(e);
                  // Try the other route if the first one fails, or just handle error
                  axiosInstance.post("/api/auth", user).then((res) => {
                    localStorage.setItem("jwt_access_token", res.data);
                    window.location.replace("/admin");
                  }).catch(err => {
                    setError("Invalid email or password");
                  });
                });
            }}
          >
            Login
          </Button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="text"
            onClick={() => {
              navigate("/register");
            }}
          >
            Don't have an account? Register
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default Login;
