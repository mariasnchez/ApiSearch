import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import {
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  AppBar,
  Toolbar, 
  Typography, 
  Avatar
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// Detalles del medicamento
const DrugDetail = () => {
  const { id } = useParams();
  const [drugDetail, setDrugDetail] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDrugDetail = async () => {
      try {
        const response = await axios.get(
          `https://api.fda.gov/drug/label.json`,
          {
            params: {
              search: `id:${id}`,
              api_key: import.meta.env.API_KEY,
            },
          }
        );
        setDrugDetail(response.data.results[0]);
        setError(null);
      } catch (err) {
        setError("Error fetching drug details from OpenFDA");
        setDrugDetail(null);
      }
    };

    fetchDrugDetail();
  }, [id]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!drugDetail) {
    return <p>Loading...</p>;
  }

  // Estructura de cada sección
  const DetailSection = ({ title, content }) =>
    content ? (
      <Grid item xs={12} sm={6}>
        <Accordion elevation={4}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} style={{color: '#4f4f4f', borderRadius: '50px'}}>
            <h3>{title}</h3>
          </AccordionSummary>
          <AccordionDetails>{content}</AccordionDetails>
        </Accordion>
      </Grid>
    ) : null;

  return (
    
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      {/* Barra de Navegación */}
      <AppBar position="fixed" sx={{ bgcolor: '#eeeeee', color: '#212121', zIndex: 1300 }}>
        <Toolbar>
          {/* Botón volver */}
          <Typography component="div" sx={{ marginRight: 'auto', display: 'flex', alignItems: 'center' }}>
            <Link to="/drug-search" style={{ textDecoration: "none" }}>
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
          {drugDetail.openfda.brand_name}
        </h1>
      </div>
    
      {/* Secciones con los detalles del medicamento */}
      <Grid container spacing={2}>
        <DetailSection title="Purpose" content={drugDetail.purpose} />
        <DetailSection
          title="Indications and Usage"
          content={drugDetail.indications_and_usage}
        />
        <DetailSection title="Ingredients" content={drugDetail.active_ingredient} />
        <DetailSection title="Warnings" content={drugDetail.warnings} />
        <DetailSection
          title="Dosage and Administration"
          content={drugDetail.dosage_and_administration}
        />
        <DetailSection title="Pregnancy" content={drugDetail.pregnancy_or_breast_feeding} />
        <DetailSection title="Pregnancy" content={drugDetail.pregnancy} />
        <DetailSection title="Ask a doctor" content={drugDetail.ask_doctor} />
        <DetailSection title="Do not use" content={drugDetail.do_not_use} />
      </Grid>
      <h4>{drugDetail.questions} </h4>
    </div>
  );
};

export default DrugDetail;
