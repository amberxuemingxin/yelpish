import React, { useState } from "react";
import { Container, Divider, Link } from '@mui/material';
import { NavLink } from 'react-router-dom';

const config = require('../config.json');


export default function AddReviewPage({userId, businessId}) {
    const [star, setStar] = useState('');
    const [text, setText] = useState('');
    const [data, setData] = useState(null);
    const [addReviewSuccess, setAddReviewSuccess] = useState(false);
    const [addReviewFailure, setAddReviewFailure] = useState(false);
    

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Adding review...');

        fetch(`http://${config.server_host}:${config.server_port}/add_review`, {
          method: "POST",
          crossDomain: true,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            user_id: userId,
            business_id: businessId,
            star: star,
            text: text
          }),
        })
        .then((res) => res.json())
        .then((data) => {
          if (data.review_id === null) {
            console.log('Add review error.');
            setAddReviewFailure(true);
          } else {
            setData(data);
            setAddReviewSuccess(true);
          }
        });
    }

    return (
      <Container>
        <h2>Add Your Review Here</h2>
        <form onSubmit={handleSubmit}>
          <div >
            <label>Star</label>
            <input value={star} onChange={(e) => setStar(e.target.value)} placeholder="0 - 5" />
          </div>
          <div>
            <label>Text</label>
            <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Review Text"/>
          </div>
          <button type="submit">Add</button>
        </form>
        {addReviewSuccess ? <p>Success! Please go back to main page.</p> : <></>}
        {addReviewFailure ? <p>Add review fail! Please try again.</p> : <></>}
        <NavLink to={'/'}>Back to Home Page</NavLink>
      </Container>
    )
}