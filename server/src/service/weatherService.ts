import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  latitude: number;
  longitude: number;
}

// TODO: Define a class for the Weather object
class Weather {
  private temperature: number;
  private windSpeed: number;
  private humidity: number;
  private condition: string;

  constructor(temperature: number, windSpeed: number, humidity: number, condition: string){
    this.temperature = temperature;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
    this.condition = condition;
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

  setTemperature(temperature: number): void {
    this.temperature = temperature;
  }

  setWindSpeed(windSpeed: number): void {
    this.windSpeed = windSpeed;
  }

  setHumidity(humidity: number): void {
    this.humidity = humidity;
  }

  setCondition(condition: string): void {
    this.condition = condition;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL: string;
  private apiKey: string;
  private cityName: string;

  constructor(cityName: string) {
    this.baseURL = process.env.BASE_URL || '';
    this.apiKey = process.env.API_KEY || '';
    this.cityName = cityName;

    if (!this.apiKey) {
      throw new Error ('API key is not defined in environment variables');
    }
  }
  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string): Promise<any> {
    const response = await fetch(query);
    if (!response.ok) {
      throw new Error(`Failed to fetch location data using query: ${query}`);
    }

    return response.json();
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    const { lat: latitude, lon: longitude } = locationData.coord;
    return { latitude, longitude };
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(city:string): string {
    return `${this.baseURL}/weather?q=${encodeURIComponent(city)}&appid=${this.apiKey}`;
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    const { latitude, longitude } = coordinates;
    return `${this.baseURL}/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${this.apiKey}`;
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(city: string): Promise<Coordinates> {
    const geocodeQuery = this.buildGeocodeQuery(city);
    const response = await fetch(geocodeQuery);

    if (!response.ok) {
      throw new Error(`Failed to fetch location data for city: ${city}`);
    }

    const data = await response.json();
    const { lat: latitude, lon: longitude } = data.coord;
    return { latitude, longitude };
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const weatherQuery = this.buildWeatherQuery(coordinates);
    const response = await fetch(weatherQuery);

    if (!response.ok) {
      throw new Error(`Failed to fetch weather data for coordinates: ${coordinates.latitude}, ${coordinates.longitude}`);
    }

    return response.json();
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any): { temperature: number; windSpeed: number; humidity: number; condition: string } {
    const temperature = response.main.temp;
    const windSpeed = response.wind.speed;
    const humidity = response.main.humidity;
    const condition = response.weather[0].description;

    return { temperature, windSpeed, humidity, condition };
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]): Weather[] {
    const forecastArray: Weather[] = [currentWeather];

    weatherData.forEach((data: any) => {
      const coordinates: Coordinates = currentWeather.getCoordinates();
      const temperature = data.main.temp;
      const windSpeed = data.wind.speed;
      const humidity = data.main.humidity;
      const condition = data.weather[0].description;

      const forecastWeather = new Weather(coordinates, temperature, windSpeed, humidity, condition);
      forecastArray.push(forecastWeather);
    });

    return forecastArray;
  }
  // TODO: Complete getWeatherForCity method
  public async getWeatherForCity(city: string): Promise<Weather[]> {
    const coordinates = await this.fetchAndDestructureLocationData(city);
    const currentWeatherResponse = await this.fetchWeatherData(coordinates);
    const { temperature, windSpeed, humidity, condition } = this.parseCurrentWeather(currentWeatherResponse);
    const currentWeather = new Weather(coordinates, temperature, windSpeed, humidity, condition);
    const forecastData = await this.fetchWeatherData(coordinates); 
    const forecastArray = this.buildForecastArray(currentWeather, forecastData);

    return forecastArray; 
  }
}

export default new WeatherService ());
