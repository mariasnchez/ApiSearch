import React from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Container, Avatar, Box} from "@mui/material";

const HomePage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column'
    }}>
      {/* Barra de Navegación */}
      <AppBar position="fixed" sx={{ bgcolor: '#eeeeee', color: '#212121'}}>
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

      {/* Contenido Principal */}
      <Container component="main" sx={{display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <h1>Welcome to <span style={{color: '#7490FF'}}>API Search</span></h1>
          <Typography gutterBottom>
            <p>You can easily and quickly find <b>drugs </b><img width="18px" src="/public/pastillas.png"></img>, reported <b>foods </b><img width="18px" src="/public/pollo.png"></img> and view a chart about <b>tobacco </b> <img width="18px" src="/public/tabaco.png"></img> health problems</p>       
            </Typography>
        </Box>
        <Button variant="contained" component={Link} to="/drug-search" sx={{backgroundColor:"#7490FF"}}>
          <b>Start here</b>
        </Button>
      </Container>
    </div>
  );
};

export default HomePage;
