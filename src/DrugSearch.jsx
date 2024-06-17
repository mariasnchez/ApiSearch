import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button, TextField, Grid, Fab } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

// Búsqueda de valores
const DrugSearch = () => {
  const [query, setQuery] = useState("");
  const [fullResults, setFullResults] = useState([]);
  const [displayResults, setDisplayResults] = useState([]);
  const [error, setError] = useState(null);
  const [resultsCount, setResultsCount] = useState(0);

  const handleSearch = async () => {
    try {
      if (!query.trim()) {
        setError("Please enter a drug name");
        return;
      }

      const response = await axios.get("https://api.fda.gov/drug/label.json", {
        params: {
          search: `openfda.brand_name:${query}*`, // Buscar por nombre del medicamento
          limit: 100, // Límite de resultados
          api_key: import.meta.env.API_KEY
        },
      });

      // Resultados filtrados
      const filteredResults = response.data.results.filter(
        (result) => result.openfda && result.openfda.brand_name
      );
      setFullResults(filteredResults);
      setDisplayResults(filteredResults.slice(0, 10));
      setResultsCount(filteredResults.length);
      setError(null);
    } catch (err) {
      console.error("Error fetching data from OpenFDA:", err);
      setError("Error fetching data from OpenFDA");
      setFullResults([]);
      setDisplayResults([]);
      setResultsCount(0);
    }
  };

  // Guardar los valores para cargar más resultados
  const loadMoreResults = () => {
    const currentLength = displayResults.length;
    const newResults = fullResults.slice(currentLength, currentLength + 10);
    setDisplayResults([...displayResults, ...newResults]);
    setResultsCount(displayResults.length + newResults.length);
  };

  // Desplazamiento del botón que redirige arriba de la página
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div>
      <h1>Drug Search</h1>

      {/* Buscador */}
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={8}>
          <TextField
            fullWidth
            id="outlined-basic"
            label="Enter drug name"
            variant="outlined"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={4} style={{ textAlign: "center" }}>
          <Button variant="contained" onClick={handleSearch}>
            Search
          </Button>
        </Grid>
      </Grid>
      {error && <p>{error}</p>}

      {/* Resultados */}
      <div style={{ maxWidth: "320px", margin: "auto" }}>
        {displayResults.map((result, index) => (
          <Link key={index} to={`/drug/${result.id}`}>
            <h2
              style={{
                margin: "10px 0",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {result.openfda.brand_name}
            </h2>
          </Link>
        ))}
      </div>

      {/* Botón cargar más resultados */}
      {fullResults.length > displayResults.length && (
        <Button variant="contained" onClick={loadMoreResults}>
          Load More
        </Button>
      )}

      {/* Botón desplazarse hasta arriba */}
      <Fab
        color="primary"
        aria-label="scroll-to-top"
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
        }}
        onClick={scrollToTop}
      >
        <KeyboardArrowUpIcon />
      </Fab>
    </div>
  );
};

export default DrugSearch;
