import React, { useState } from "react";

const config = require('../config.json');

export default function LoginPage({isLoggedIn, updateLoggedInStatus, updateUsername, updateUserId}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
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
        <div className="login-container">
            <h2>Login</h2>
            <form className="login-form" onSubmit={handleSubmit}>
              <div className="username-input">
                <label>Username</label>
                <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username"/>
              </div>
              <div className="password-input">
                <label>Password</label>
                <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"/>
              </div>   
              <button type="submit">Log In</button>
            </form>
            <a href="/register">Register Here</a>
        </div>
    )
}