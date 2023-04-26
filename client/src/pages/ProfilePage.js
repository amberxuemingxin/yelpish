import { useEffect, useState } from 'react';
import { Container, Divider, Link } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';

const config = require('../config.json');

export default function ProfilePage({userId}) {
  const [profileData, setProfileData] = useState({});
  const [reviewData, setReviewData] = useState({});
  const [pageSize1, setPageSize1] = useState(5);

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

          const reviewsWithId = data.reviews.map((review) => ({ id: review.review_id, clean_date: review.date.substring(0, 10), ...review }));
          setReviewData(reviewsWithId);
          console.log(data);
        });
  }, []);

  const columns1 = [
    { field: 'business_name', headerName: 'Business', width: 200 },
    { field: 'text', headerName: 'Review', width: 500 },
    { field: 'stars', headerName: 'Stars', width: 75 },
    { field: 'useful_count', headerName: 'Useful', width: 75 },
    { field: 'funny_count', headerName: 'Funny', width: 75 },
    { field: 'cool_count', headerName: 'Funny', width: 75 },
    { field: 'clean_date', headerName: 'Date', width: 105 },
  ]

  
  // window.location = "http://localhost:3000/login";
  return (
    <Container>
      <h1>Profile</h1>
      {profileData === null ? <div/> : 
      <div>
        <p><b>Username: </b>{profileData.username}</p>
        <p><b>Name: </b>{profileData.name}</p>
        <b>Reviews: </b>
        <DataGrid
        rows={reviewData}
        columns={columns1}
        pageSize={pageSize1}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize1) => setPageSize1(newPageSize1)}
        autoHeight
        autoWidth
        />
      </div>
      }
      
      <br></br>
      <NavLink to={'/'}>Back to Home Page</NavLink>
    </Container>
  );
};