import { useEffect, useState } from 'react';
import { Container, Grid, TextField, Button } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';

const config = require('../config.json');

export default function HomePage({username, userId}) {
  const [longtitude, setLongtitude] = useState(0);
  const [latitude, setLatitude] = useState(0);

  const [businesses, setBusinesses] = useState([]);
  const [pageSize1, setPageSize1] = useState(5);

  const [taste, setTaste] = useState({});
  const [pageSize2, setPageSize2] = useState(5);

  const [categories, setCategories] = useState({});
  const [pageSize3, setPageSize3] = useState(5);

  const [lowest, setLowest] = useState({});
  const [pageSize4, setPageSize4] = useState(5);

  const [newFriends, setNewFriends] = useState({});
  const [pageSize5, setPageSize5] = useState(5);
  
  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/pending_friend_request/${userId}`, {
      method: "GET",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
    .then((res) => res.json())
    .then((data) => {
      if (data.request_users_info !== null) {
        const friendsWithId = data.request_users_info.map((friend) => ({ id: friend.user_id, accept: false, decline: false, ...friend }));
        setNewFriends(friendsWithId);
        console.log(friendsWithId);
      } else {
        console.log("Get pending_friend_request error");
      }
    });
    
    fetch(`http://${config.server_host}:${config.server_port}/recommendation?longitude=${longtitude}&latitude=${latitude}`, {
      method: "GET",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
    .then((res) => res.json())
    .then((data) => {
      if (data.businesses !== null) {
        setBusinesses(data.businesses);
        console.log(data);
      } else {
        console.log("Get recommendation error");
      }
    });

    fetch(`http://${config.server_host}:${config.server_port}/similar_taste_users_favourite/${userId}`, {
      method: "GET",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
    .then((res) => res.json())
    .then((data) => {
      if (data.businesses !== null) {
        setTaste(data.businesses);
        console.log(data);
      } else {
        console.log("Get similar taste error");
      }
    });

    fetch(`http://${config.server_host}:${config.server_port}/highest_star_category_review_count`, {
      method: "GET",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
    .then((res) => res.json())
    .then((data) => {
      if (data.categories !== null) {
        const categoriesWithId = data.categories.map((item, index) => ({
          id: index,
          category: item.category,
          reveiw_count: item.reveiw_count,
        }));
        setCategories(categoriesWithId);
      } else {
        console.log("Get category with the highest stars error");
      }
    });

    // fetch(`http://${config.server_host}:${config.server_port}/business_in_city_lowest_review`, {
    //   method: "GET",
    //   crossDomain: true,
    //   headers: {
    //     "Content-Type": "application/json",
    //     Accept: "application/json",
    //   },
    // })
    // .then((res) => res.json())
    // .then((data) => {
    //   if (data.businesses !== null) {
    //     const businessWithId = data.businesses.map((business) => ({id: business.business_id, ...business}));
    //     setLowest(businessWithId);
    //     console.log(data);
    //   } else {
    //     console.log("Get the businesses that are in the cities that have lowest user reviews error");
    //   }
    // });
  }, []);


  const handleSubmit = () => {
    console.log('Get recommendation: ' + JSON.stringify({
      longtitude: longtitude,
      latitude: latitude,
    }))
    fetch(`http://${config.server_host}:${config.server_port}/recommendation?longitude=${longtitude}&latitude=${latitude}`, {
      method: "GET",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
    .then((res) => res.json())
    .then((data) => {
      if (data.businesses !== null) {
        setBusinesses(data.businesses);
        console.log('recommendation:');
        console.log(data);
      } else {
        console.log("Get recommendation error");
      }
    });
  }

  const handleAcceptFriendSubmit = (request_user_id, accept) => {
    console.log('Accept Friend Request, request_user_id: ' + request_user_id + ' , accept: ' + accept);
    fetch(`http://${config.server_host}:${config.server_port}/respond_add_friend`, {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        request_user_id: request_user_id,
        accept: accept,
      }),
    })
    .then((res) => res.json())
    .then((data) => {
      if (data !== null) {
        
      }

      fetch(`http://${config.server_host}:${config.server_port}/pending_friend_request/${userId}`, {
        method: "GET",
        crossDomain: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((res) => res.json())
      .then((data) => {
        if (data.request_users_info !== null) {
          const friendsWithId = data.request_users_info.map((friend) => ({ id: friend.user_id, accept: false, decline: false, ...friend }));
          setNewFriends(friendsWithId);
          console.log(friendsWithId);
        } else {
          console.log("Get pending_friend_request error");
        }
      });
    });
  }

  const columns1 = [
    { field: 'name', headerName: 'Name', width: 300, renderCell: (params) => (
      <NavLink to={`/business/${params.row.id}`}>{params.value}</NavLink>
    ) },
    { field: 'address', headerName: 'Address', width: 400 },
    { field: 'city', headerName: 'City', width: 200 },
    { field: 'rating', headerName: 'Rating', width: 200 },
  ]

  const columns2 = [
    { field: 'name', headerName: 'Name', width: 300, renderCell: (params) => (
      <NavLink to={`/business/${params.row.id}`}>{params.value}</NavLink>
    ) },
    { field: 'address', headerName: 'Address', width: 400 },
    { field: 'city', headerName: 'City', width: 200 },
    { field: 'rating', headerName: 'Rating', width: 200 },
  ]

  const columns3 = [
    { field: 'category', headerName: 'Category', width: 900},
    { field: 'reveiw_count', headerName: 'Total Reviews', width: 200 },
  ]

  // const columns4 = [
  //   { field: 'name', headerName: 'Name', width: 500, renderCell: (params) => (
  //     <NavLink to={`/business/${params.row.id}`}>{params.value}</NavLink>
  //   ) },
  //   { field: 'city', headerName: 'City', width: 300 },
  //   { field: 'avg_stars', headerName: 'Average Rating', width: 300 },
  // ]

  const newFriendColumns = [
    { field: 'user_id', headerName: 'User ID', width: 400},
    { field: 'user_name', headerName: 'User Name', width: 300 },
    { field: 'accept', headerName: 'Accept', width: 200, renderCell: (params) => (
      <Button onClick={() => handleAcceptFriendSubmit(params.row.user_id, true) } style={{ left: '50%', transform: 'translateX(-50%)' }}>
        Accept
      </Button>
    ) },
    { field: 'decline', headerName: 'Decline', width: 200, renderCell: (params) => (
      <Button onClick={() => handleAcceptFriendSubmit(params.row.user_id, false) } style={{ left: '50%', transform: 'translateX(-50%)' }}>
        Decline
      </Button>
    ) },
  ]

  return (
    <Container>
      <h1>Home Page</h1>
      <p><b>Username: </b>{username}</p>
      <br />
      <h2>Pending Friend Requests</h2>
      <DataGrid
        rows={newFriends}
        columns={newFriendColumns}
        pageSize={pageSize5}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize5(newPageSize)}
        autoHeight
        autoWidth
      />
      <br />
      <h2>Business Recommendation</h2>
      <p>Change longtitude and latitude to search recommendation at different locations</p>
      <Grid container spacing={3}>
        <Grid item xs={8}>
          <TextField label='Longtitude' onChange={(e) => setLongtitude(e.target.value ? e.target.value : 0)} style={{ width: "100%" }}/>
        </Grid>
        <Grid item xs={8}>
          <TextField label='Latitude' onChange={(e) => setLatitude(e.target.value ? e.target.value : 0)} style={{ width: "100%" }}/>
        </Grid>
      </Grid>
      <br />
      <Button onClick={() => handleSubmit() } style={{ left: '50%', transform: 'translateX(-50%)' }}>
        Search
      </Button>
      <DataGrid
        rows={businesses}
        columns={columns1}
        pageSize={pageSize1}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize1(newPageSize)}
        autoHeight
        autoWidth
      />
      <br />
      <h2>Favorite Business of the Users Who Have Similar Tastes to You </h2>
      <DataGrid
        rows={taste}
        columns={columns2}
        pageSize={pageSize2}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize2(newPageSize)}
        autoHeight
        autoWidth
      />
      <br />
      <h2>Categories with the Highest Stars</h2>
      <DataGrid
        rows={categories}
        columns={columns3}
        pageSize={pageSize3}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize3(newPageSize)}
        autoHeight
        autoWidth
      />
      <br />
      <h2>Businesses in the Cities that Have Lowest User Reviews</h2>
      {/* <DataGrid
        rows={lowest}
        columns={columns4}
        pageSize={pageSize4}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize4(newPageSize)}
        autoHeight
        autoWidth
      /> */}
    </Container>
  );
};