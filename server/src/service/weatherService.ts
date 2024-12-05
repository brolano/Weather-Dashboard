import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  latitude: number;
  longitude: number;
}

// TODO: Define a class for the Weather object
class Weather {
  private coordinates: Coordinates;
  private city: string;
  private temperature: number;
  private windSpeed: number;
  private humidity: number;
  private condition: string;

  constructor(coordinates: Coordinates, city: string, temperature: number, windSpeed: number, humidity: number, condition: string){
    this.coordinates = coordinates;
    this.city = city;
    this.temperature = temperature;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
    this.condition = condition;
  }

  getCoordinates(): Coordinates {
    return this.coordinates;
  }

  getCity(): string {
    return this.city;
  }

  getTemperature(): number {
    return this.temperature;
  }

  getWindSpeed(): number {
    return this.windSpeed;
  }

  getHumidity(): number {
    return this.humidity;
  }

  getCondition(): string {
    return this.condition;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL: string;
  private apiKey: string;
  private cityName: string;

  constructor(cityName: string = 'Unknown City', baseURL?: string, apiKey?: string) {
    this.baseURL = baseURL || process.env.API_BASE_URL || 'https://api.openweathermap.org/data/2.5';
    this.apiKey = apiKey || process.env.API_KEY || '';
    this.cityName = cityName;


    if (!this.apiKey) {
      throw new Error ('API key is not defined in environment variables');
    }
  }

  getCityName(): string {
    return this.cityName;
  }

  getBaseURL(): string {
    return this.baseURL;
  }

  getApiKey(): string {
    return this.apiKey;
  }

  // TODO: Create fetchLocationData method
  private async fetchLocationData(city: string): Promise<any> {
    const geocodeQuery = this.buildGeocodeQuery(city);
    const response = await fetch(geocodeQuery);

    if (!response.ok) {
      throw new Error(`Failed to fetch location data for city: ${city}`);
    }

    const data = await response.json();
    console.log("Location Data Response:", data); // Debugging
    return data;
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: any[]): Coordinates {
    if (!locationData || locationData.length === 0) {
      throw new Error('No location data found for the given city.');
    }

    const { lat, lon } = locationData[0]; // Use the first result
    return {
      latitude: lat,
      longitude: lon,
    };
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(city: string): string {
    const limit = 1; // Limit results to the top match
    return `${this.baseURL}/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=${limit}&appid=${this.apiKey}`;
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    const { latitude, longitude } = coordinates;
    return `${this.baseURL}/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${this.apiKey}`;
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(city: string): Promise<Coordinates> {
    try {
      const locationData = await this.fetchLocationData(city);
      return this.destructureLocationData(locationData);
    } catch (error) {
      throw new Error(`Failed to process location data for city: ${city}`);
    }
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const weatherQuery = this.buildWeatherQuery(coordinates);
    const response = await fetch(weatherQuery);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch weather data for coordinates: ${coordinates.latitude}, ${coordinates.longitude}`
      );
    }

    const data = await response.json();
    return data;
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any): {
    temperature: number;
    windSpeed: number;
    humidity: number;
    condition: string;
  } {
    if (!response.main || !response.wind || !response.weather || !response.weather[0]) {
      throw new Error("Invalid weather data structure");
    }

    const temperature = response.main.temp;
    const windSpeed = response.wind.speed;
    const humidity = response.main.humidity;
    const condition = response.weather[0].description;

    return { temperature, windSpeed, humidity, condition };
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(
    currentWeather: Weather,
    forecastData: any
  ): Weather[] {
    if (!forecastData.list || !Array.isArray(forecastData.list)) {
      throw new Error('Invalid forecast data structure');
    }

    const forecastArray: Weather[] = [currentWeather];
    const coordinates = currentWeather.getCoordinates();
    const city = currentWeather.getCity();

    forecastData.list.forEach((data: any) => {
      const temperature = data.main.temp;
      const windSpeed = data.wind.speed;
      const humidity = data.main.humidity;
      const condition = data.weather[0].description;

      const forecastWeather = new Weather(
        coordinates,
        city,
        temperature,
        windSpeed,
        humidity,
        condition
      );
      forecastArray.push(forecastWeather);
    });

    return forecastArray;
  }
  // TODO: Complete getWeatherForCity method
  public async getWeatherForCity(city: string): Promise<Weather[]> {
    const coordinates = await this.fetchAndDestructureLocationData(city);
    const currentWeatherResponse = await this.fetchWeatherData(coordinates);
    const { temperature, windSpeed, humidity, condition } =
      this.parseCurrentWeather(currentWeatherResponse);
    const currentWeather = new Weather(
      coordinates,
      city,
      temperature,
      windSpeed,
      humidity,
      condition
    );

    const forecastData = await this.fetchWeatherData(coordinates);
    const forecastArray = this.buildForecastArray(currentWeather, forecastData);

    return forecastArray;
  }
}

export default new WeatherService ();
