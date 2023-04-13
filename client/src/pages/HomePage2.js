import { useEffect, useState } from 'react';
import { Container, Divider, Link } from '@mui/material';
import { NavLink } from 'react-router-dom';

const config = require('../config.json');

export default function HomePage2({username, userId}) {
  console.log(
    'username: ' + username + ' , userId: ' + userId
  );
  return (
    <Container>
      <h1>Home Page</h1>
      <label>Username: {username}</label>
      <div />
      <label>UserId: {userId}</label>
      <p />
      <div style={{border: '3px solid #6A74E5'}}>
        <NavLink to={'/profile'}>Profile Page</NavLink>
      </div>
      <div style={{border: '3px solid #6A74E5'}}>
        <NavLink to={'/search_business'}>Search Business Page</NavLink>
      </div>
      <div style={{border: '3px solid #6A74E5'}}>
        <NavLink to={'/add_review'}>Add Review Page</NavLink>
      </div>
    </Container>
  );
};