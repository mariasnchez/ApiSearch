import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button, TextField, Grid, Fab, Card, CardContent, Avatar, Container, AppBar, Toolbar, Typography, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from "@mui/material";
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
const FoodSearch = () => {
  const [query, setQuery] = useState("");
  const [fullResults, setFullResults] = useState([]);
  const [displayResults, setDisplayResults] = useState([]);
  const [error, setError] = useState(null);
  const [resultsCount, setResultsCount] = useState(0);
  const [searchType, setSearchType] = useState("food"); 

  // Actualiza el estado con el valor seleccionado
  const handleSearchTypeChange = (event) => {
    setSearchType(event.target.value); 
  };

  //Búsqueda por alimentos
  const handleSearchFood = async (searchQuery) => {
    try {
      if (!searchQuery.trim()) {
        setError("Please enter a food name");
        return;
      }

      const responseFood = await axios.get("https://api.fda.gov/food/event.json", {
        params: {
          search: `products.name_brand:${searchQuery}*`, // Buscar por nombre del alimento
          limit: 100,
          api_key: import.meta.env.API_KEY
        },
      });


      // Resultados filtrados
      const filteredResultsFood = responseFood.data.results.filter(
        (result) => result.products[0].name_brand
      );

      setFullResults(filteredResultsFood);
      setDisplayResults(filteredResultsFood.slice(0, 9));
      setResultsCount(filteredResultsFood.length);
      setError(null);
    } catch (err) {
      console.error("Error fetching data from OpenFDA:", err);
      setError("Error fetching data from OpenFDA");
      setFullResults([]);
      setDisplayResults([]);
      setResultsCount(0);
    }
  };

  const debouncedSearchFood = debounce(handleSearchFood, 300);

  useEffect(() => {
    if (query.trim()) {
      debouncedSearchFood(query);
    }
  }, [query]);


  // Búsqueda por reactiones
  const handleSearchReaction = async (searchQuery) => {
    try {
      if (!searchQuery.trim()) {
        setError("Please enter a food name");
        return;
      }

      const responseReaction = await axios.get("https://api.fda.gov/food/event.json", {
        params: {
          search: `reactions:${searchQuery}*`, // Buscar por nombre de la reacción
          limit: 100, // Límite de resultados
          api_key: import.meta.env.API_KEY
        },
      });

      // Resultados filtrados
      const filteredResultsReaction = responseReaction.data.results.filter(
        (result) => result.reactions
      );
      setFullResults(filteredResultsReaction);
      setDisplayResults(filteredResultsReaction.slice(0, 9));
      setResultsCount(filteredResultsReaction.length);
      setError(null);
    } catch (err) {
      console.error("Error fetching data from OpenFDA:", err);
      setError("Error fetching data from OpenFDA");
      setFullResults([]);
      setDisplayResults([]);
      setResultsCount(0);
    }
  };

  const debouncedSearchReaction = debounce(handleSearchReaction, 300);

  useEffect(() => {
    if (query.trim()) {
      debouncedSearchReaction(query);
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

        {/* Contenido */}
        <Container maxWidth="md" style={{ marginTop: '20px'}}>
        <Grid container spacing={2} justifyContent="center" alignItems="center">
            <Grid item>
            <h1>
                Food incident <span style={{ color: '#7490FF' }}>Search</span>
            </h1>
            </Grid>
            <Grid item>
            <Avatar
            alt="Pills"
            src="public/pollo.png"
            sx={{ width: 50, height: 50, borderRadius: '0%' }}
            />
            </Grid>
        </Grid>
        </Container>

        {/* Seleccionar */}
        <FormControl>
        <FormLabel id="demo-row-radio-buttons-group-label">Search by</FormLabel>
        <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            value={searchType}
            name="row-radio-buttons-group"
            onChange={handleSearchTypeChange}

        >
            <FormControlLabel value="food" control={<Radio />} label="Food" />
            <FormControlLabel value="reaction" control={<Radio />} label="Reactions" />
        </RadioGroup>
        </FormControl>

        {/* Buscador por comida o por reacción*/}
        {searchType === "food" && (
        <Grid container spacing={2} alignItems="center" justifyContent="center" style={{ maxWidth: "300px", margin: "auto" }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="outlined-basic"
              label="Enter food name"
              variant="outlined"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </Grid>
        </Grid>
        )}

        {searchType === "reaction" && (
        <Grid container spacing={2} alignItems="center" justifyContent="center" style={{ maxWidth: "300px", margin: "auto" }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="outlined-basic"
              label="Enter reaction name"
              variant="outlined"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </Grid>
        </Grid>
        )}
        {error && <p>{error}</p>}
        

        {/* Resultados */}
        {searchType === "food" && (
        <Grid container spacing={2} style={{ maxWidth: "800px", margin: "20px auto" }}>
          {displayResults.map((result, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card elevation={3}>
                <CardContent>
                  <Link to={`/food/${result.report_number}`} >
                    <h3 style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {result.products[0].name_brand}
                    </h3>
                  </Link>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        )}

        {searchType === "reaction" && (
        <Grid container spacing={2} style={{ maxWidth: "800px", margin: "20px auto" }}>
        {displayResults.map((result, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
            <Card elevation={3}>
                <CardContent>
                <Link to={`/reaction/${result.report_number}`} >
                    <h3 style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {result.reactions.join(', ')}
                    </h3>
                </Link>
                </CardContent>
            </Card>
            </Grid>
        ))}
        </Grid>
        )}
        

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

export default FoodSearch;
