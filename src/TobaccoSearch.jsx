import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Paper, Typography, AppBar, Toolbar, Avatar, Button, Container, Grid } from '@mui/material';
import { styled } from '@mui/system';
import { Link } from 'react-router-dom'; 

const ChartContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginTop: theme.spacing(2),
}));

const TobaccoSearch = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://api.fda.gov/tobacco/problem.json?limit=1000');
        const events = response.data.results;

        const CountYear = {};

        {/* Contador de casos */}
        events.forEach((event) => {
          const date = new Date(event.date_submitted);
          const year = date.getFullYear();
          if (CountYear[year]) {
            CountYear[year]++;
          } else {
            CountYear[year] = 1;
          }
        });

        const chartData = Object.keys(CountYear).map(year => ({
          year,
          count: CountYear[year],
        }));

        setData(chartData);
      } catch (error) {
        console.error('Error fetching data from OpenFDA API', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {/* Barra de Navegación */}
      <AppBar position="fixed" sx={{ bgcolor: '#eeeeee', color: '#212121' }}>
      <Toolbar>
          <Typography component="div" sx={{marginRight: 'auto', display: 'flex', alignItems: 'center' }}>
            <Avatar
              alt="Lupa"
              src="/lupa.png"
              sx={{ width: 30, height: 30, marginRight: 1 }}
            />
            <Link to="/" color="inherit">
            <h3>API Search</h3> 
            </Link>
          </Typography>
          <Typography>
            {/* Espacio entre elementos */}
          </Typography>
          <Button color="inherit" component={Link} to="/drug-search">
            <h5>Drug</h5> 
          </Button>
          <Button color="inherit" component={Link} to="/food-search">
            <h5>Food</h5>
          </Button>
          <Button color="inherit" component={Link} to="/tobacco-search">
            <h5>Tobacco</h5>
          </Button>
        </Toolbar>
      </AppBar>
      <Toolbar />

      {/* Contenido */}
      <Container maxWidth="md">
        <Grid container spacing={2} justifyContent="center" alignItems="center">
            <Grid item>
            <h1>
                Tobacco <span style={{ color: '#7490FF' }}>Chart</span>
            </h1>
            </Grid>
            <Grid item>
            <Avatar
            alt="Tobacco"
            src="public/tabaco.png"
            sx={{ width: 50, height: 50, borderRadius: '0%' }}
            />
            </Grid>
        </Grid>
      </Container>

      {/* Gráfica */}
      <ChartContainer>
        <Typography marginTop={-4}>
          <h4>Health Problems cause by tobacco each year</h4>
        </Typography>
        <ResponsiveContainer width="101%" height={400}>
          <LineChart
            width={600}
            height={300}
            data={data}
          >
            <CartesianGrid/>
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default TobaccoSearch;
