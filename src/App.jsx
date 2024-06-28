import { LoadingButton } from "@mui/lab";
import { Container, TextField, Typography, Box, List, ListItem, ListItemText, Button, Collapse } from "@mui/material";
import { useState, useEffect } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import axios from 'axios';

const API_WEATHER = `https://api.weatherapi.com/v1/current.json?key=${import.meta.env.VITE_API_KEY}&lang=es&q=`;

export default function App() {
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    error: false,
    message: "",
  });
  const [weather, setWeather] = useState({
    city: "",
    country: "",
    temp: "",
    condition: "",
    icon: "",
    conditionText: "",
  });
  const [cities, setCities] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get('http://localhost:3000/historial');
        setCities(response.data);
      } catch (error) {
        console.error('Error fetching cities', error);
      }
    };

    fetchCities();
  }, []);

  const saveCityToDB = async (cityName) => {
    try {
      await axios.post('http://localhost:3000/historial', { city: cityName, timestamp: new Date().toISOString() });
    } catch (error) {
      console.error('Error saving city to DB', error);
    }
  };

  useEffect(() => {
    localStorage.setItem("cities", JSON.stringify(cities));
  }, [cities]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError({
      error: false,
      message: "",
    });
    try {
      if (!city.trim()) throw { message: "El campo ciudad es obligatorio" };
      const response = await fetch(`${API_WEATHER}${city}`);
      const data = await response.json();

      if (data.error) throw { message: data.error.message };

      setWeather({
        city: data.location.name,
        country: data.location.country,
        temp: data.current.temp_c,
        condition: data.current.condition.code,
        icon: data.current.condition.icon,
        conditionText: data.current.condition.text,
      });

      await saveCityToDB(data.location.name);
      const newCities = [...cities, { name: data.location.name, timestamp: new Date().toISOString() }];
      setCities(newCities);

    } catch (error) {
      setError({
        error: true,
        message: error.message,
      });
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  return (
    <Container
      sx={{
        mt: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}
    >
      <Typography
        variant="h3"
        component="h1"
        align="center"
        gutterBottom
        sx={{ fontFamily: 'Arial, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', color:'black' }}
      >
        CLIMA NOW <WbSunnyIcon sx={{ ml: 1, color: '#EFF74D', fontSize: '45px' }} />
      </Typography>

      <Box
        sx={{ display: "grid", gap: 2, width: 500, backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: '20px', borderRadius: '8px' }}
        component="form"
        autoComplete="off"
        onSubmit={onSubmit}
      >
        <TextField
          id="city"
          label="Ciudad"
          variant="outlined"
          size="small"
          required
          fullWidth
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
            setSearched(false);
          }}
          error={error.error}
          helperText={error.message}
        />

        <LoadingButton
          type="submit"
          variant="contained"
          loading={loading}
          loadingIndicator="Cargando..." 
        >
          Buscar
        </LoadingButton>
      </Box>

      {searched && city && weather.city && (
        <Box
          sx={{
            mt: 2,
            display: "grid",
            gap: 2,
            textAlign: "center",
          }}
        >
          <Typography variant="h3" component="h2">
            {weather.city}, {weather.country}
          </Typography>

          <Box
            component="img"
            alt={weather.conditionText}
            src={weather.icon}
            sx={{ margin: "0 auto" }}
          />

          <Typography variant="h5" component="h3">
            {weather.temp} °C
          </Typography>

          <Typography variant="h6" component="h4">
            {weather.conditionText}
          </Typography>
        </Box>
      )}

      <Box sx={{ mt: 2, textAlign: 'center', backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: '10px', borderRadius: '8px' }}>
        <Button onClick={() => setShowHistory(!showHistory)} variant="outlined" sx={{ mr: 1 }}>
          {showHistory ? 'Ocultar Historial' : 'Mostrar Historial'}
        </Button>
        <Button onClick={() => setCities([])} variant="contained">
          <DeleteIcon />
        </Button>
        <Collapse in={showHistory}>
          {cities.length === 0 ? (
            <Typography variant="body1" align="center" sx={{ marginTop: 2, color: 'grey', fontSize: '20px', fontFamily: 'sans-serif' }}>
              Historial vacío
            </Typography>
          ) : (
            <List>
              {cities.map((city, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={`${city.name} - ${new Date(city.timestamp).toLocaleString()}`}
                    sx={{ textAlign: "center" }}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Collapse>
      </Box>
    </Container>
  );
}
