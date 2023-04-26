import React, { useState } from "react";
import { Container, Grid, TextField, Button } from '@mui/material';
import { NavLink } from 'react-router-dom';

const config = require('../config.json');

export default function FindFriendPage() {

    const [username, setUsername] = useState('');
    const [userInfo, setUserInfo] = useState({});

    const handleSubmit = () => {
      fetch(`http://${config.server_host}:${config.server_port}/find_friend?target_username=${username}`)
      .then((res) => res.json())
      .then((data) => {
        if (data !== null) {
          setUserInfo(data);
          console.log(userInfo);
        } else {
          console.log("Friend search error");
        }
      });
    }

    return (
        <Container>
            <h1>Seach Business</h1>
            <Grid container spacing={3}>
              <Grid item xs={8}>
                <TextField label='User Name' value={username} onChange={(e) => setUsername(e.target.value)} style={{ width: "100%" }}/>
              </Grid>
            </Grid>
            <br />
            <Button onClick={() => handleSubmit() } style={{ left: '50%', transform: 'translateX(-50%)' }}>
              Search
            </Button>
            <h2>Result</h2>
            <p><b>User ID: </b>{userInfo.user_id}</p>
            <p><b>User Name: </b>{userInfo.user_name}</p>
            <p><b>Is Friend: </b>{JSON.stringify(userInfo) === '{}' ? '' : (userInfo.is_friend ? 'Yes' : 'No')}</p>
            <br></br>
            <NavLink to={'/'}>Back to Home Page</NavLink>
        </Container>
    )
}