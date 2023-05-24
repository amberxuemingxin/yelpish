# Yelpish - your local business helper!

## Backend

### About AWS Academy and EC2

Our static images and Neo4j are hosted on the EC2 instance on the AWS Academy
Learner Lab.
I will have to manually open the lab and start these services,
and they will only last for 4 hours.
Therefore, running the app without contacting me (Yifan Li) will have the
images and Neo4j features disabled.

### Prerequisites

```bash
cd server
npm install
```

### Running

This will start our backend with most functionalities,
except for friends related features:

```bash
npm start
```

If you can confirm that Neo4j is on, use

```bash
USE_NEO4J=1 npm start
```

to test out the complete application.


## Frontend

### Prerequisites

```bash
cd client
npm install
```

### Running

```bash
npm start
```


## Data Cleansing

### Prerequisites

```bash
pip install -r prep-scripts/requirements.txt
```

### For MySQL

```bash
python -m prep-scripts.preprocessing
```

### For Neo4j

```bash
python -m prep-scripts.neo4j-preprocessing
```




