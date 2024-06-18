import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button, TextField, Grid, Fab, Card, CardContent, Avatar, Container, AppBar, Toolbar, Typography } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

// Función de debounce para que no haga demasiadas solicitudes a la API
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

// Búsqueda de valores
const DrugSearch = () => {
  const [query, setQuery] = useState("");
  const [fullResults, setFullResults] = useState([]);
  const [displayResults, setDisplayResults] = useState([]);
  const [error, setError] = useState(null);
  const [resultsCount, setResultsCount] = useState(0);

  const handleSearch = async (searchQuery) => {
    try {
      if (!searchQuery.trim()) {
        setError("Please enter a drug name");
        return;
      }

      const response = await axios.get("https://api.fda.gov/drug/label.json", {
        params: {
          search: `openfda.brand_name:${searchQuery}*`, // Buscar por nombre del medicamento
          limit: 100,
          api_key: import.meta.env.API_KEY
        },
      });

      // Resultados filtrados
      const filteredResults = response.data.results.filter(
        (result) => result.openfda && result.openfda.brand_name
      );
      setFullResults(filteredResults);
      setDisplayResults(filteredResults.slice(0, 9));
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

  const debouncedSearch = debounce(handleSearch, 300);

  useEffect(() => {
    if (query.trim()) {
      debouncedSearch(query);
    }
  }, [query]);

  // Guardar los valores para cargar más resultados
  const loadMoreResults = () => {
    const currentLength = displayResults.length;
    const newResults = fullResults.slice(currentLength, currentLength + 9);
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
    <Container maxWidth="md" style={{ marginTop: '20px' }}>
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        <Grid item>
          <h1>
            Drug <span style={{ color: '#7490FF' }}>Search</span>
          </h1>
        </Grid>
        <Grid item>
          <Avatar
          alt="Pills"
          src="public/pastillas.png"
          sx={{ width: 50, height: 50, borderRadius: '0%' }}
          />
        </Grid>
      </Grid>
    </Container>

        {/* Buscador */}
        <Grid container spacing={2} alignItems="center" justifyContent="center" style={{ maxWidth: "300px", margin: "auto" }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="outlined-basic"
              label="Enter drug name"
              variant="outlined"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </Grid>
        </Grid>
        {error && <p>{error}</p>}

        {/* Resultados */}
        <Grid container spacing={2} style={{ maxWidth: "800px", margin: "20px auto" }}>
          {displayResults.map((result, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card elevation={3}>
                <CardContent>
                  <Link to={`/drug/${result.id}`} >
                    <h3 style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {result.openfda.brand_name}
                    </h3>
                  </Link>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Botón cargar más resultados */}
        {fullResults.length > displayResults.length && (
          <Button variant="contained" onClick={loadMoreResults} sx={{backgroundColor:"#7490FF"}}>
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
