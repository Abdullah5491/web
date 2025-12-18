import { Button, Grid, TextField } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../services/axiosInstance";

const Register = () => {
  const navigate = useNavigate();
  const [user, setUser] = React.useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = React.useState("");

  return (
    <div style={{ padding: "20px" }}>
      <h1>Register</h1>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Name"
            value={user.name}
            fullWidth
            onChange={(e) => {
              setUser({ ...user, name: e.target.value });
            }}
          />
        </Grid>
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
              axiosInstance
                .post("/api/users/register", user)
                .then((res) => {
                  console.log(res.data);
                  navigate("/login");
                })
                .catch((err) => {
                  console.log(err);
                  setError(err.response ? err.response.data : "Registration failed");
                });
            }}
          >
            Register
          </Button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="text"
            onClick={() => {
              navigate("/login");
            }}
          >
            Already have an account? Login
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default Register;
