import { useEffect, useState } from 'react';
import { Container, Divider, Link } from '@mui/material';
import { NavLink } from 'react-router-dom';

const config = require('../config.json');

export default function ProfilePage({userId}) {
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/profile/${userId}`, {
          method: "GET",
          crossDomain: true,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
        .then((res) => res.json())
        .then((data) => {
          setProfileData(data);
          console.log(data);
        });
  }, []);

  
  // window.location = "http://localhost:3000/login";
  return (
    <Container>
      <h1>Profile Page</h1>
      {profileData === null ? <div/> : 
      <div>
        <p>Username: {profileData.username}</p>
        <p>UserId: {profileData.id}</p>
        <p>Name: {profileData.name}</p>
        <label>Reviews:</label>
        {profileData.reviews.map(review => {
          return (<div style={{border: '5px solid #6A74E5'}}>
            <p>Review: {review.text}</p>
            <p>Stars: {review.stars}</p>
            <p>Useful Count: {review.useful_count}</p>
            <p>Funny Count: {review.funny_count}</p>
            <p>Date: {review.date.split("T")[0]}</p>
            <p/>
          </div>)})}
      </div>
      }
      <NavLink to={'/'}>Back to Home Page</NavLink>
    </Container>
  );
};