import React, { useState } from "react";
import { Container, Grid, TextField, Button } from '@mui/material';
import { NavLink } from 'react-router-dom';

const config = require('../config.json');

export default function FindFriendPage({ login_user_id, login_user_name }) {

    const [username, setUsername] = useState('');
    const [userInfo, setUserInfo] = useState({});
    const [requestSuccess, setRequestSuccess] = useState(false);

    const handleSubmit = () => {
      setRequestSuccess(false);
      if (username !== login_user_name) {
        fetch(`http://${config.server_host}:${config.server_port}/find_friend?target_username=${username}&login_user_id=${login_user_id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data !== null) {
            setUserInfo(data);
            console.log(userInfo);
          } else {
            console.log("Friend search error");
          }
        });
      } else {
        setUsername('');
        setUserInfo({});
      }
      
    }

    const handleAddFriendSubmit = () => {
      fetch(`http://${config.server_host}:${config.server_port}/request_add_friend`, {
          method: "POST",
          crossDomain: true,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            login_user_id: login_user_id,
            target_user_id: userInfo.user_id,
          }),
        })
        .then((res) => res.json())
        .then((data) => {
          if (data !== null) {
            setRequestSuccess(data);
            console.log(data);
          }
        });
      
    }

    return (
        <Container>
            <h1>Find Friend</h1>
            <Grid container spacing={3}>
              <Grid item xs={8}>
                <TextField label='User Name' value={username} onChange={(e) => setUsername(e.target.value)} style={{ width: "100%" }}/>
              </Grid>
            </Grid>
            {username === login_user_name ? <p> Cannot be your user name !</p> : <></>}
            <br />
            <Button onClick={() => handleSubmit() } style={{ left: '50%', transform: 'translateX(-50%)' }}>
              Search
            </Button>
            <h2>Result</h2>
            <p><b>User ID: </b>{userInfo.user_id}</p>
            <p><b>Name: </b>{userInfo.user_name}</p>
            <p><b>Is Friend: </b>{JSON.stringify(userInfo) === '{}' ? '' : (userInfo.is_friend ? 'Yes' : 'No')}</p>
            <p><b>Hop Distance: </b>{userInfo.current_hop}</p>
            <br></br>
            {userInfo.is_friend ? <></> : 
              <Button onClick={() => handleAddFriendSubmit() } style={{ left: '50%', transform: 'translateX(-50%)' }}>
                Add Friend
              </Button> }
            {requestSuccess ? <p>Request Sent</p> : <></>}
            <br />
            <NavLink to={'/'}>Back to Home Page</NavLink>
        </Container>
    )
}