import { useEffect, useState } from 'react';
import { Container, Grid, TextField, Button } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';

const config = require('../config.json');

export default function HomePage2({username, userId}) {
  const [longtitude, setLongtitude] = useState(0);
  const [latitude, setLatitude] = useState(0);

  const [businesses, setBusinesses] = useState([]);
  const [pageSize, setPageSize] = useState(5);
  
  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/search_business`, {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        longtitude: longtitude,
        latitude: latitude,
      }),
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
  }, []);


  const handleSubmit = () => {
    console.log('Get recommendation: ' + JSON.stringify({
      longtitude: longtitude,
      latitude: latitude,
    }))
    fetch(`http://${config.server_host}:${config.server_port}/search_business`, {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        longtitude: longtitude,
        latitude: latitude,
      }),
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
  }

  const columns = [
    { field: 'name', headerName: 'Name', width: 300, renderCell: (params) => (
      <NavLink to={`/business/${params.row.id}`}>{params.value}</NavLink>
    ) },
    { field: 'address', headerName: 'Address', width: 400 },
    { field: 'city', headerName: 'City', width: 200 },
    { field: 'rating', headerName: 'Rating', width: 200 },
  ]

  return (
    <Container>
      <h1>Home Page</h1>
      <p><b>Username: </b>{username}</p>
      <br />
      <h2>Business Recommendation</h2>
      <p>Change longtitude and latitude to have different recommendation</p>
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
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
        autoWidth
      />
    </Container>
  );
};