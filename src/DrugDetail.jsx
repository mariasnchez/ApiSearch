import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import {
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
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
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <h3>{title}</h3>
          </AccordionSummary>
          <AccordionDetails>{content}</AccordionDetails>
        </Accordion>
      </Grid>
    ) : null;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>

      {/* Botón volver */}
      <Link to="/" style={{ textDecoration: "none" }}>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          style={{ position: "absolute", top: 10, left: 10 }}
        >
          Back
        </Button>
      </Link>

      <h1
        style={{
          color: "#1769aa",
          textAlign: "center",
          margin: "20px 0",
        }}
      >
        {drugDetail.openfda.brand_name}
      </h1>
    
      {/* Secciones con los detalles del medicamento */}
      <Grid container spacing={2}>
        <DetailSection title="Purpose" content={drugDetail.purpose} />
        <DetailSection
          title="Indications and Usage"
          content={drugDetail.indications_and_usage}
        />
        <DetailSection title="Warnings" content={drugDetail.warnings} />
        <DetailSection
          title="Dosage and Administration"
          content={drugDetail.dosage_and_administration}
        />
        <DetailSection title="Ask a doctor" content={drugDetail.ask_doctor} />
        <DetailSection title="Do not use" content={drugDetail.do_not_use} />
        <DetailSection title="Questions?" content={drugDetail.questions} />
      </Grid>
    </div>
  );
};

export default DrugDetail;
