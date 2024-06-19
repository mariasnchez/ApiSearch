import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import {
  Button,
  Card,
  CardContent,
  Typography,
  CardMedia,
  Grid,
  AppBar,
  Toolbar,
  Avatar
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// Detalles de la reacción
const ReactionDetail = () => {
  const { report_number } = useParams();
  const [reactionDetail, setReactionDetail] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReactionDetail = async () => {
      try {
        const response = await axios.get(
          `https://api.fda.gov/food/event.json`,
          {
            params: {
              search: `"${report_number}"`,
              api_key: import.meta.env.API_KEY,
            },
          }
        );
  
        // Verificar si hay resultados
        if (response.data.results && response.data.results.length > 0) {
          setReactionDetail(response.data.results[0]);
          setError(null);
        } else {
          setError("No reaction detail found for this report number");
          setReactionDetail(null);
        }
      } catch (err) {
        setError("Error fetching reaction details from OpenFDA");
        setReactionDetail(null);
      }
    };
  
    fetchReactionDetail();
  }, [report_number]);
  

  if (error) {
    return <p>{error}</p>;
  }

  if (!reactionDetail) {
    return <p>Loading...</p>;
  }

 
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      {/* Barra de Navegación */}
      <AppBar position="fixed" sx={{ bgcolor: '#eeeeee', color: '#212121', zIndex: 1300 }}>
        <Toolbar>
          {/* Botón volver */}
          <Typography component="div" sx={{ marginRight: 'auto', display: 'flex', alignItems: 'center' }}>
            <Link to="/food-search" style={{ textDecoration: "none" }}>
              <Button
                variant="contained"
                startIcon={<ArrowBackIcon />}
                sm={{backgroundColor:'gray'}}
                sx={{ 
                  backgroundColor: "#7490FF",
                }}
              >
                Back
              </Button>
            </Link>
          </Typography>
          <Typography>
            {/* Espacio entre elementos */}
          </Typography>
          <Typography component="div" sx={{  display: 'flex', alignItems: 'center' }}>
          <Avatar
              alt="Lupa"
              src="/lupa.png"
              sx={{ width: 30, height: 30, marginRight: 1 }}
            />
            <Link to="/" color="inherit">
              <h3>API Search</h3>
            </Link>
          </Typography>
        </Toolbar>
      </AppBar>

      {/*Título */}
      <div style={{ marginTop: "64px", position: "relative" }}>
        <h1
          style={{
            color: "#7490FF",
            textAlign: "center",
            margin: "20px 0",
          }}
        >
          {reactionDetail.reactions.join(", ")}
        </h1>
      </div>
    
      {/* Secciones con los detalles de la reacción */}
      <Grid container spacing={2}>
      {reactionDetail.products[0].name_brand && (
      <Grid item xs={12}>
        <Card elevation={4}>
          <CardContent>
            <Typography variant="h6"><b>Food name</b></Typography>
            <Typography variant="body1" color="textSecondary">
            {reactionDetail.products[0].name_brand}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      )}

      {reactionDetail.consumer.gender &&  (
      <Grid item xs={12}>
        <Card elevation={4}>
          <CardContent>
            <Typography variant="h6"><b>Gender</b></Typography>
            <CardMedia
              component="img"
              image={
                reactionDetail.consumer.gender === "Female"
                  ? "/public/mujer.png"
                  : reactionDetail.consumer.gender === "Male"
                  ? "/public/hombre.png"
                  : ""
              }
              alt={reactionDetail.consumer.gender}
              style={{ width: 40, height: 40, margin:'auto', marginBottom:'5px'}}
            />
            <Typography variant="body1" color="textSecondary">
              {reactionDetail.consumer.gender}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      )}
    
      {reactionDetail.consumer.age && (
      <Grid item xs={12}>
        <Card elevation={4}>
          <CardContent>
            <Typography variant="h6"><b>Age</b></Typography>
            <Typography variant="body1" color="textSecondary">
              {reactionDetail.consumer.age} years
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      )}
      
      {reactionDetail.outcomes && (
      <Grid item xs={12}>
        <Card elevation={4}>
          <CardContent>
            <Typography variant="h6"><b>Outcomes</b></Typography>
            <Typography variant="body1" color="textSecondary">
              {reactionDetail.outcomes}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      )}
    </Grid>
    </div>
  );
};

export default ReactionDetail;
