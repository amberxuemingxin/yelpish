import React, { useState } from "react";
import { Container, Grid, TextField, Button } from '@mui/material';
import { NavLink } from 'react-router-dom';
import './index.css';

const config = require('../config.json');

export default function Register() {
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [registerSuccess, setRegisterSuccess] = useState(false);
    const [registerFailure, setRegisterFailure] = useState(false);

    const handleSubmit = (e) => {
      if(name === '' || password === '' || username === '') {
        setRegisterFailure(true);
        setRegisterSuccess(false);
        return;
      } 
        console.log('Registering, username: ' + username + ', name: ' + name + ', password: ' + password);

        fetch(`http://${config.server_host}:${config.server_port}/register`, {
          method: "POST",
          crossDomain: true,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            username: username,
            name: name,
            password: password,
          }),
        })
        .then((res) => res.json())
        .then((data) => {
          if (data.user_id !== null) {
            setRegisterSuccess(true);
            setRegisterFailure(false);
          } else {
            setRegisterSuccess(false);
            setRegisterFailure(true);
          }
        });
    }

    return (
      <Container>
        <h2>Register Here</h2>
        {/* <form className="register-form" onSubmit={handleSubmit}>
          <div className="username-input">
            <label>Username   </label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="johndoe" />
          </div>
          <div className="name-input">
            <label>Full Name   </label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe"/>
          </div>
          <div className="password-input">
            <label>Password   </label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="12345678"/>
          </div> 
          <button type="submit">Register</button>
        </form> */}
        <Grid container spacing={3}>
          <Grid item xs={8}>
            <TextField label='Username' onChange={(e) => setUsername(e.target.value)} style={{ width: "100%" }}/>
          </Grid>
          <Grid item xs={8}>
            <TextField label='Full Name' onChange={(e) => setName(e.target.value)} style={{ width: "100%" }}/>
          </Grid>
          <Grid item xs={8}>
            <TextField label='Password' onChange={(e) => setPassword(e.target.value)} style={{ width: "100%" }}/>
          </Grid>
        </Grid>
        <br />
        <Button onClick={() => handleSubmit() } style={{ left: '50%', transform: 'translateX(-50%)' }}>
          Register
        </Button>
        {registerSuccess ? <p><b>Success! Please go back to login page.</b></p> : <></>}
        {registerFailure ? <p><b>Registration Fail! Please try again.</b></p> : <></>}
        {/* <a href="/">Back to Login.</a> */}
        <br />
        <NavLink to={'/'}>Back to Login.</NavLink>
    </Container>
    )
}