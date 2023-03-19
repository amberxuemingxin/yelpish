create database yelp;

use yelp;

create table business (
    business_id varchar(36) primary key,
    `name` varchar(100) not null,
    `address` varchar(100) not null,
    city varchar(100) not null,
    `state` enum (
            'AL',  -- Alabama
            'AK',  -- Alaska
            'AZ',  -- Arizona
            'AR',  -- Arkansas
            'CA',  -- California
            'CO',  -- Colorado
            'CT',  -- Connecticut
            'DE',  -- Delaware
            'FL',  -- Florida
            'GA',  -- Georgia
            'HI',  -- Hawaii
            'ID',  -- Idaho
            'IL',  -- Illinois
            'IN',  -- Indiana
            'IA',  -- Iowa
            'KS',  -- Kansas
            'KY',  -- Kentucky
            'LA',  -- Louisiana
            'ME',  -- Maine
            'MD',  -- Maryland
            'MA',  -- Massachusetts
            'MI',  -- Michigan
            'MN',  -- Minnesota
            'MS',  -- Mississippi
            'MO',  -- Missouri
            'MT',  -- Montana
            'NE',  -- Nebraska
            'NV',  -- Nevada
            'NH',  -- New Hampshire
            'NJ',  -- New Jersey
            'NM',  -- New Mexico
            'NY',  -- New York
            'NC',  -- North Carolina
            'ND',  -- North Dakota
            'OH',  -- Ohio
            'OK',  -- Oklahoma
            'OR',  -- Oregon
            'PA',  -- Pennsylvania
            'RI',  -- Rhode Island
            'SC',  -- South Carolina
            'SD',  -- South Dakota
            'TN',  -- Tennessee
            'TX',  -- Texas
            'UT',  -- Utah
            'VT',  -- Vermont
            'VA',  -- Virginia
            'WA',  -- Washington
            'WV',  -- West Virginia
            'WI',  -- Wisconsin
            'WY',  -- Wyoming
        ) not null,
    postal_code varchar(5) not null,
    latitude decimal(15, 12) not null,
    longitude decimal(15, 12) not null,
    is_open boolean not null,

    monday_start time,
    monday_end time,
    tuesday_start time,
    tuesday_end time,
    wednesday_start time,
    wednesday_end time,
    thursday_start time,
    thursday_end time,
    friday_start time,
    friday_end time,
    saturday_start time,
    saturday_end time,
    sunday_start time,
    sunday_end time
);

create table business_categories (
    business_id varchar(36) primary key,
    category varchar(100) primary key,
    foreign key (business_id) references business(business_id)
);

create table user (
    user_id varchar(36) primary key,
    `name` varchar(100) not null,
    salt char(10) not null,
    salted_hashed_password char(256) not null,
    yelp_since datetime not null
);

create table review (
    review_id varchar(36) primary key,
    user_id varchar(36) not null,
    business_id varchar(36) not null,
    stars tinyint not null,
    `date` date not null,
    `text` varchar(500) not null,
    foreign key (user_id) references user(user_id),
    foreign key (business_id) references business(business_id)
);

create table review_attitude (
    review_id varchar(36),
    attitude_user_id varchar(36),
    attitude_type enum (
            'useful',
            'funny',
            'cool'
        ) not null,
    primary key (review_id, attitude_user_id),
    foreign key (review_id) references review(review_id),
    foreign key (attitude_user_id) references user(user_id)
);

create table tip (
    tip_id varchar(36) primary key,
    user_id varchar(36) not null,
    business_id varchar(36) not null,
    `text` varchar(200) not null,
    `date` date not null,
    foreign key (user_id) references user(user_id),
    foreign key (business_id) references business(business_id)
);

create table photo (
    photo_id varchar(36) primary key,
    business_id varchar(36) not null,
    caption varchar(50) not null,
    label varchar(20) not null
    foreign key (business_id) references business(business_id)
);



