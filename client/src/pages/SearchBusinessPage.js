import React, { useState } from "react";
import { Container, Grid, TextField, Button } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';

const config = require('../config.json');

export default function SearchBusinessPage() {
    const [name, setName] = useState('');
    const [categories, setCategories] = useState([]);
    const [longtitude, setLongtitude] = useState(0);
    const [latitude, setLatitude] = useState(0);
    const [max_miles, setMaxMiles] = useState(0);
    const [min_rating, setMinRating] = useState(-1);
    //const [searchSuccess, setSearchSuccess] = useState(false);

    const [businesses, setBusinesses] = useState([]);
    const [pageSize, setPageSize] = useState(5);

    const handleSubmit = () => {
      console.log('search business: ' + JSON.stringify({
        name_keyword: name,
        categories: categories,
        longtitude: longtitude,
        latitude: latitude,
        max_miles: max_miles,
        min_rating: min_rating
      }))
      fetch(`http://${config.server_host}:${config.server_port}/search_business`, {
        method: "POST",
        crossDomain: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name_keyword: name,
          categories: categories,
          longtitude: longtitude,
          latitude: latitude,
          max_miles: max_miles,
          min_rating: min_rating
        }),
      })
      .then((res) => res.json())
      .then((data) => {
        if (data.businesses !== null) {
          setBusinesses(data.businesses);
          console.log(data);
        } else {
          console.log("Business search error");
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
            <h1>Search Business</h1>
            <Grid container spacing={3}>
              <Grid item xs={8}>
                <TextField label='Business Name' value={name} onChange={(e) => setName(e.target.value)} style={{ width: "100%" }}/>
              </Grid>
              <Grid item xs={8}>
                <TextField label='Categories' value={categories} onChange={(e) => setCategories(e.target.value ? e.target.value.split(" ,") : [])} style={{ width: "100%" }}/>
              </Grid>
              <Grid item xs={8}>
                <TextField label='Longtitude' onChange={(e) => setLongtitude(e.target.value ? e.target.value : 0)} style={{ width: "100%" }}/>
              </Grid>
              <Grid item xs={8}>
                <TextField label='Latitude' onChange={(e) => setLatitude(e.target.value ? e.target.value : 0)} style={{ width: "100%" }}/>
              </Grid>
              <Grid item xs={8}>
                <TextField label='Max Miles' onChange={(e) => setMaxMiles(e.target.value ? e.target.value : 0)} style={{ width: "100%" }}/>
              </Grid>
              <Grid item xs={8}>
                <TextField label='Min Rating' onChange={(e) => setMinRating(e.target.value ? e.target.value : 0)} style={{ width: "100%" }}/>
              </Grid>
            </Grid>
            <br />
            <Button onClick={() => handleSubmit() } style={{ left: '50%', transform: 'translateX(-50%)' }}>
              Search
            </Button>
            <h2>Result</h2>
            <DataGrid
              rows={businesses}
              columns={columns}
              pageSize={pageSize}
              rowsPerPageOptions={[5, 10, 25]}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              autoHeight
              autoWidth
            />
            <br></br>
            <NavLink to={'/'}>Back to Home Page</NavLink>
        </Container>
    )
}