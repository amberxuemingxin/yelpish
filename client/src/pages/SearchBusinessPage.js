import React, { useState } from "react";
import { Container, Divider, Link } from '@mui/material';
import { NavLink } from 'react-router-dom';

const config = require('../config.json');

export default function SearchBusinessPage() {
    const [name, setName] = useState('');
    const [categories, setCategories] = useState([]);
    const [longitude, setLongitude] = useState(null);
    const [latitude, setLatitude] = useState(null);
    const [max_miles, setMaxMiles] = useState(null);
    const [min_rating, setMinRating] = useState(null);

    const [businesses, setBusinesses] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`http://${config.server_host}:${config.server_port}/search_business`, {
          method: "GET",
          crossDomain: true,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: name,
            categories: categories,
            longitude: longitude,
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
          }
        });
    }

    return (
        <Container>
            <h2>Seach Business Page</h2>
            <form className="login-form" onSubmit={handleSubmit}>
              <div className="business-name-input">
                <label>Business Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name"/>
              </div>
              <div className="categories-input">
                <label>Categories</label>
                <input value={categories} onChange={(e) => setCategories(e.target.value.split(" ,"))} placeholder="Categories"/>
                <label> (Please seperate by comma.)</label>
              </div>
              <div className="longitude-input">
                <label>Longitude</label>
                <input value={longitude} onChange={(e) => setLongitude(e.target.value)} placeholder="Longitude"/>
              </div>
              <div className="latitude-input">
                <label>Latitude</label>
                <input value={latitude} onChange={(e) => setLatitude(e.target.value)} placeholder="Latitude"/>
              </div>
              <div className="max-miles-input">
                <label>Max Miles</label>
                <input value={max_miles} onChange={(e) => setMaxMiles(e.target.value)} placeholder="Max Miles"/>
              </div>
              <div className="min-rating-input">
                <label>Min Rating</label>
                <input value={min_rating} onChange={(e) => setMinRating(e.target.value)} placeholder="Min Rating"/>
              </div>
              <button type="submit">Submit</button>
            </form>
            <NavLink to={'/'}>Back to Home Page</NavLink>
        </Container>
    )
}