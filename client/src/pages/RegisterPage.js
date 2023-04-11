import React, { useState } from "react";

export default function Register() {
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [registerSuccess, setRegisterSuccess] = useState(false);
    const [registerFailure, setRegisterFailure] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Registering, username: ' + username + ', name: ' + name + ', password: ' + password);

        fetch("http://localhost:8000/register", {
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
          } else {
            setRegisterFailure(true);
          }
        });
    }

    return (
      <div className="register-container">
        <h2>Register Here</h2>
        <form className="register-form" onSubmit={handleSubmit}>
          <div class="username-input">
            <label>Username</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
          </div>
          <div class="name-input">
            <label>Full Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe"/>
          </div>
          <div class="password-input">
            <label>Password</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"/>
          </div> 
          <button type="submit">Register</button>
        </form>
        {registerSuccess ? <p>Success! Please go back to login page.</p> : <></>}
        {registerFailure ? <p>Registration Fail! Please try again.</p> : <></>}
        <a href="/login">Back to Login.</a>
    </div>
    )
}