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
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// Detalles del alimento
const FoodDetail = () => {
  const { report_number } = useParams();
  const [foodDetail, setFoodDetail] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFoodDetail = async () => {
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
          setFoodDetail(response.data.results[0]);
          setError(null);
        } else {
          setError("No food detail found for this report number");
          setFoodDetail(null);
        }
      } catch (err) {
        setError("Error fetching food details from OpenFDA");
        setFoodDetail(null);
      }
    };
  
    fetchFoodDetail();
  }, [report_number]);
  

  if (error) {
    return <p>{error}</p>;
  }

  if (!foodDetail) {
    return <p>Loading...</p>;
  }

 
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>

      {/* Botón volver */}
      <Link to="/food-search" style={{ textDecoration: "none" }}>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          style={{ position: "absolute", top: 10, left: 10, background: "#7490FF" }}
        >
          Back
        </Button>
      </Link>

      <h1
        style={{
          color: "#7490FF",
          textAlign: "center",
          margin: "20px 0",
        }}
      >
        {foodDetail.products[0].name_brand}
      </h1>
    
      {/* Secciones con los detalles del alimento */}
      <Grid container spacing={2}>
      {foodDetail.reactions.join(", ") && (
      <Grid item xs={12}>
        <Card elevation={4}>
          <CardContent>
            <Typography variant="h6"><b>Reactions</b></Typography>
            <Typography variant="body1" color="textSecondary">
              {foodDetail.reactions.join(", ")}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      )}
      
      {foodDetail.consumer.gender && (
      <Grid item xs={12}>
        <Card elevation={4}>
          <CardContent>
            <Typography variant="h6"><b>Gender</b></Typography>
            <CardMedia
              component="img"
              image={
                foodDetail.consumer.gender === "Female"
                  ? "/public/mujer.png"
                  : foodDetail.consumer.gender === "Male"
                  ? "/public/hombre.png"
                  : ""
              }
              alt={foodDetail.consumer.gender}
              style={{ width: 40, height: 40, margin:'auto', marginBottom:'5px'}}
            />
            <Typography variant="body1" color="textSecondary">
              {foodDetail.consumer.gender}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      )}

      {foodDetail.consumer.age && (
      <Grid item xs={12}>
        <Card elevation={4}>
          <CardContent>
            <Typography variant="h6"><b>Age</b></Typography>
            <Typography variant="body1" color="textSecondary">
              {foodDetail.consumer.age && `${foodDetail.consumer.age} years`}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      )}

      {foodDetail.outcomes && (
      <Grid item xs={12}>
        <Card elevation={4}>
          <CardContent>
            <Typography variant="h6"><b>Outcomes</b></Typography>
            <Typography variant="body1" color="textSecondary">
              {foodDetail.outcomes}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      )}
    </Grid>
    </div>
  );
};

export default FoodDetail;
