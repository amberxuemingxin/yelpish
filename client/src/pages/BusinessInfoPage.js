
import { useEffect, useState } from 'react';
import { Container, Button, Grid, TextField } from '@mui/material';
import { useParams } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';

import { formatDuration } from '../helpers/formatter';
const config = require('../config.json');

export default function BusinessInfoPage({ userId, isLoggedIn }) {
  const [businessData, setBusinessData] = useState({});
  const [reviewData, setReviewData] = useState({});
  const [tipData, setTipData] = useState({});
  const { business_id } = useParams();
  const [topUsers, setTopUsers] = useState({});
  const [photos, setPhotos] = useState([]);

  const [pageSize1, setPageSize1] = useState(5);
  const [pageSize2, setPageSize2] = useState(5);
  const [pageSize3, setPageSize3] = useState(5);

  const [star, setStar] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [addReviewSuccess, setAddReviewSuccess] = useState(false);
  const [addReviewFailure, setAddReviewFailure] = useState(false);

  const [tipText, setTipText] = useState('');
  const [addTipSuccess, setAddTipSuccess] = useState(false);
  const [addTipFailure, setAddTipFailure] = useState(false);

  const [lastNday, setLastNday] = useState(1000);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/business/${business_id}`)
      .then(res => res.json())
      .then(resJson => {
        setBusinessData(resJson);

        const photos = resJson.photos?.map(photo => `http://44.215.185.232/${photo}.jpg`);
        setPhotos(photos);

        fetch(`http://${config.server_host}:${config.server_port}/reviews/${business_id}`)
          .then(res2 => res2.json())
          .then(resJson2 => {
            const reviewsWithId = resJson2.reviews.map((review) => ({ id: review.review_id, clean_date: review.date.substring(0, 10), ...review }));
            setReviewData(reviewsWithId);
          });

        fetch(`http://${config.server_host}:${config.server_port}/tips/${business_id}`)
          .then(res3 => res3.json())
          .then(resJson3 => {
            const tipsWithId = resJson3.tips.map((tip) => ({ id: tip.tip_id, clean_date: tip.date.substring(0, 10), ...tip }));
            setTipData(tipsWithId);
          });
      });

    fetch(`http://${config.server_host}:${config.server_port}/top_reviews/${business_id}?lastNday=${lastNday}`)
      .then(res4 => res4.json())
      .then(resJson4 => {
        const usersWithId = resJson4.user_info.map((user) => ({ id: user.user_id, ...user }));
        setTopUsers(usersWithId);
        console.log(resJson4);
      });

  }, []);


  const columns1 = [
    { field: 'review_user_name', headerName: 'User', width: 200 },
    { field: 'stars', headerName: 'Stars', width: 75 },
    { field: 'text', headerName: 'Review', width: 500 },
    { field: 'useful_count', headerName: 'Useful', width: 75 },
    { field: 'funny_count', headerName: 'Funny', width: 75 },
    { field: 'cool_count', headerName: 'Cool', width: 75 },
    { field: 'clean_date', headerName: 'Date', width: 105 },
  ]

  const columns2 = [
    { field: 'tip_user_name', headerName: 'User', width: 200 },
    { field: 'text', headerName: 'Tip', width: 700 },
    { field: 'clean_date', headerName: 'Date', width: 200 },
  ]

  const columns3 = [
    { field: 'username', headerName: 'User Name', width: 400 },
    { field: 'display_name', headerName: 'Display Name', width: 400 },
    { field: 'total_reviews', headerName: 'Total Reviews', width: 200 },
  ]

  const handleReviewSubmit = () => {
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
        business_id: business_id,
        star: star,
        text: reviewText
      }),
    })
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson.review_id === null) {
          console.log('Add review error.');
          setAddReviewFailure(true);
        } else {
          setAddReviewSuccess(true);
        }
        fetch(`http://${config.server_host}:${config.server_port}/reviews/${business_id}`)
          .then(res2 => res2.json())
          .then(resJson2 => {
            const reviewsWithId = resJson2.reviews.map((review) => ({ id: review.review_id, clean_date: review.date.substring(0, 10), ...review }));
            setReviewData(reviewsWithId);
          });
      });
  }

  const handleTipSubmit = () => {
    console.log('Adding tip...');

    fetch(`http://${config.server_host}:${config.server_port}/add_tip`, {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        business_id: business_id,
        text: tipText
      }),
    })
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson.tip_id === null) {
          console.log('Add tip error.');
          setAddTipFailure(true);
        } else {
          setAddTipSuccess(true);
        }
        fetch(`http://${config.server_host}:${config.server_port}/tips/${business_id}`)
          .then(res3 => res3.json())
          .then(resJson3 => {
            const tipsWithId = resJson3.tips.map((tip) => ({ id: tip.tip_id, clean_date: tip.date.substring(0, 10), ...tip }));
            setTipData(tipsWithId);
          });
      });
  }

  const handleTopSubmit = () => {
    console.log('Searching top...');

    fetch(`http://${config.server_host}:${config.server_port}/top_reviews/${business_id}?lastNday=${lastNday}`)
      .then(res4 => res4.json())
      .then(resJson4 => {
        const usersWithId = resJson4.user_info.map((user) => ({ id: user.user_id, ...user }));
        setTopUsers(usersWithId);
        console.log(resJson4);
      });
  }

  const renderedPhotos = photos?.map(photo => (
    <img key={photo} src={photo} alt="Business" />
  ));

  return (
    <Container>
      <h1>{businessData.name}</h1>
      <p><b>Category:</b> {businessData.categories ? businessData.categories.map((category) => " " + category) + "" : ""}</p>
      <p><b>Rating:</b> {businessData.rating}</p>
      <p><b>Address:</b> {businessData.address}</p>
      <p><b>City:</b> {businessData.city}</p>
      <p><b>State:</b> {businessData.state}</p>
      <br></br>
      <h2>Reviews</h2>
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
      {isLoggedIn ? (
        <div>
          <h3>Add Review</h3>
          <Grid container spacing={3}>
            <Grid item xs={8}>
              <TextField label='Star' value={star} onChange={(e) => setStar(e.target.value)} style={{ width: "100%" }} />
            </Grid>
            <Grid item xs={8}>
              <TextField label='Review' value={reviewText} onChange={(e) => setReviewText(e.target.value)} style={{ width: "100%" }} />
            </Grid>
          </Grid>
          <Button onClick={() => handleReviewSubmit()} style={{ left: '50%', transform: 'translateX(-50%)' }}>
            Add Review
          </Button>
          {addReviewSuccess ? <p>Success! Review Added.</p> : <></>}
          {addReviewFailure ? <p>Add review fail! Please try again.</p> : <></>}
        </div>
      ) : <></>}

      <br></br>
      <h2>Tips</h2>
      <DataGrid
        rows={tipData}
        columns={columns2}
        pageSize={pageSize2}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize2) => setPageSize2(newPageSize2)}
        autoHeight
        autoWidth
      />
      {isLoggedIn ? (
        <div>
          <h3>Add Tip</h3>
          <Grid container spacing={3}>
            <Grid item xs={8}>
              <TextField label='Text' value={tipText} onChange={(e) => setTipText(e.target.value)} style={{ width: "100%" }} />
            </Grid>
          </Grid>
          <Button onClick={() => handleTipSubmit()} style={{ left: '50%', transform: 'translateX(-50%)' }}>
            Add Tip
          </Button>
          {addTipSuccess ? <p>Success! Tip Added.</p> : <></>}
          {addTipFailure ? <p>Add tip fail! Please try again.</p> : <></>}
        </div>
      ) : <></>}

      <br></br>
      <h2>Top 5 Users Who Write Most Useful, Funny, and Cool Reviews for Last Few Days</h2>
      <br />
      <Grid container spacing={3}>
        <Grid item xs={8}>
          <TextField label='Past N Day' value={lastNday} onChange={(e) => setLastNday(e.target.value ? e.target.value : 1000)} style={{ width: "100%" }} />
        </Grid>
      </Grid>
      <Button onClick={() => handleTopSubmit()} style={{ left: '50%', transform: 'translateX(-50%)' }}>
        Search
      </Button>
      <br />
      <DataGrid
        rows={topUsers}
        columns={columns3}
        pageSize={pageSize3}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize2) => setPageSize3(newPageSize2)}
        autoHeight
        autoWidth
      />
      <br></br>

      <h2>Business Images</h2>
      <div>{renderedPhotos} </div>

      <br></br>
      <NavLink to={'/'}>Back to Home Page</NavLink>
    </Container>
  );
}