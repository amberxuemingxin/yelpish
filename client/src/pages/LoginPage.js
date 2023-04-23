import React, { useState } from "react";
import { Container, Grid, TextField, Button } from '@mui/material';
import { NavLink } from 'react-router-dom';
import './index.css';

const config = require('../config.json');

export default function LoginPage({isLoggedIn, updateLoggedInStatus, updateUsername, updateUserId}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = () => {
        console.log('Logging, username: ' + username + ', password: ' + password);

        fetch(`http://${config.server_host}:${config.server_port}/login`, {
          method: "POST",
          crossDomain: true,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        })
        .then((res) => res.json())
        .then((data) => {
          if (data.user_id !== null) {
            updateLoggedInStatus(true);
            updateUsername(username);
            updateUserId(data.user_id);
            console.log(data);
            //window.location = `http://${config.server_host}:${config.frontend_port}/`;
          }
        });
    }

    return (
        <Container>
            <h2>Login</h2>
            <br/>
            <Grid container spacing={3}>
              <Grid item xs={8}>
                <TextField label='Username' onChange={(e) => setUsername(e.target.value)} style={{ width: "100%" }}/>
              </Grid>
              <Grid item xs={8}>
                <TextField label='Password' onChange={(e) => setPassword(e.target.value)} style={{ width: "100%" }}/>
              </Grid>
            </Grid>
            <br />
            <Button onClick={() => handleSubmit() } style={{ left: '50%', transform: 'translateX(-50%)' }}>
              Login
            </Button>
            <br />
            <NavLink to={'/register'}>Register Here</NavLink>
        </Container>
    )
}