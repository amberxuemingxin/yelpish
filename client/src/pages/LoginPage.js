import React, { useState } from "react";

export default function LoginPage({updateLoggedInStatus}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Registering, username: ' + username + ', password: ' + password);

        fetch("http://localhost:8000/login", {
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
          }
        });
    }

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form className="login-form" onSubmit={handleSubmit}>
              <div class="username-input">
                <label>Username</label>
                <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username"/>
              </div>
              <div class="password-input">
                <label>Password</label>
                <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"/>
              </div>   
              <button type="submit">Log In</button>
            </form>
            <a href="/register">Register Here</a>
        </div>
    )
}