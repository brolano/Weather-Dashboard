import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';



// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  try {
      const { cityName } = req.body.cityName;

      if (!cityName) {
          return res.status(400).json({ error: 'City name is required' });
      }
  // TODO: GET weather data from city name
  const weatherData = await WeatherService.getWeatherForCity(cityName);

        if (!weatherData || weatherData.length === 0) {
            return res.status(404).json({ error: 'Weather data not found' });
        }
  // TODO: save city to search history
  const savedCity = await HistoryService.addCity(cityName);
  const formattedWeatherData = weatherData.map(weather => ({
            coordinates: weather.getCoordinates(),
            temperature: weather.getTemperature(),
            windSpeed: weather.getWindSpeed(),
            humidity: weather.getHumidity(),
            condition: weather.getCondition()
        }));

        return res.status(201).json({
            city: {
                id: savedCity.getId(),
                name: savedCity.getName()
            },
            weather: formattedWeatherData
        });
    } catch (error) {
        console.error('Error processing weather request:', error);
        return res.status(500).json({ error: 'Failed to process weather request' });
    }
});

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
      const cities = await HistoryService.getCities();
      
      const response = cities.map(city => ({
          id: city.getId(),
          name: city.getName()
      }));
      
      res.status(200).json(response);
  } catch (error) {
      console.error('Error fetching search history:', error);
      res.status(500).json({ error: 'Failed to fetch search history' });
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  try {
      const { id } = req.params;

      if (!id) {
          return res.status(400).json({ error: 'City ID is required' });
      }

      const wasRemoved = await HistoryService.removeCity(id);
      
      if (!wasRemoved) {
          return res.status(404).json({ error: 'City not found' });
      }
      
      return res.status(204).send();
  } catch (error) {
      console.error('Error deleting city:', error);
      return res.status(500).json({ error: 'Failed to delete city' });
  }
});

export default router;
