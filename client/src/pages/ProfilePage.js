import { useEffect, useState } from 'react';
import { Container, Divider, Link } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';

const config = require('../config.json');

export default function ProfilePage({userId}) {
  const [profileData, setProfileData] = useState({});
  const [reviewData, setReviewData] = useState({});
  const [friendsData, setFriendsData] = useState({});
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
          if (data !== null) {
            setProfileData(data);
            const reviewsWithId = data.reviews.map((review) => ({ id: review.review_id, clean_date: review.date.substring(0, 10), ...review }));
            setReviewData(reviewsWithId);
            if(data.friends_info.length > 0) {
              const friendsWithId = data.friends_info.map((friend) => ({ id: friend.user_id, ...friend }));
              setFriendsData(friendsWithId);
            }
          }
          
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

  const columns2 = [
    { field: 'user_id', headerName: 'User ID', width: 550 },
    { field: 'name', headerName: 'User Name', width: 550 },
  ]

  
  // window.location = "http://localhost:3000/login";
  return (
    <Container>
      <h1>Profile</h1>
      {profileData === null ? <div/> : 
      <div>
        <p><b>User ID: </b>{userId}</p>
        <br />
        <p><b>Username: </b>{profileData.username}</p>
        <br />
        <p><b>Name: </b>{profileData.name}</p>
        <br />
        <b>Reviews: </b>
        <br />
        <DataGrid
        rows={reviewData}
        columns={columns1}
        pageSize={pageSize1}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize1) => setPageSize1(newPageSize1)}
        autoHeight
        autoWidth
        />
        <br />
        <b>Friends: </b>
        <br />
        <DataGrid
        rows={friendsData}
        columns={columns2}
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