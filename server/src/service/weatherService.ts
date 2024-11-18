import dotenv from 'dotenv';
import { runInThisContext } from 'node:vm';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  latitude: number;
  longitude: number;
}

// TODO: Define a class for the Weather object
class Weather {
  private coordinates: Coordinates;
  private temperature: number;
  private condition: string;

  constructor(coordinates: Coordinates, temperature: number, condition: string) {
    this.coordinates = coordinates;
    this.temperature = temperature;
    this. condition = condition;
  }

  getCoordinates(): Coordinates {
    return this.coordinates;
  }

  getTemperature(): number {
    return this.temperature;
  }

  getCondition(): string {
    return this.condition;
  }
  setCoordinates(coordinates: Coordinates): void {
    this.coordinates = coordinates;
  }

  setTemperature(temperature: number): void {
    this.temperature = temperature;
  }

  setCondition(condition: string): void {
    this.condition = condition;
  }

  displayWeather(): string {
    return `Locatino: Latitude ${this.coordinates.latitude}, Longitude ${this.coordinates.longitude}\n` + 
    `Temperature: ${this.temperature}°\nCondition: ${this.condition}`;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  // TODO: Create fetchLocationData method
  // private async fetchLocationData(query: string) {}
  // TODO: Create destructureLocationData method
  // private destructureLocationData(locationData: Coordinates): Coordinates {}
  // TODO: Create buildGeocodeQuery method
  // private buildGeocodeQuery(): string {}
  // TODO: Create buildWeatherQuery method
  // private buildWeatherQuery(coordinates: Coordinates): string {}
  // TODO: Create fetchAndDestructureLocationData method
  // private async fetchAndDestructureLocationData() {}
  // TODO: Create fetchWeatherData method
  // private async fetchWeatherData(coordinates: Coordinates) {}
  // TODO: Build parseCurrentWeather method
  // private parseCurrentWeather(response: any) {}
  // TODO: Complete buildForecastArray method
  // private buildForecastArray(currentWeather: Weather, weatherData: any[]) {}
  // TODO: Complete getWeatherForCity method
  // async getWeatherForCity(city: string) {}
}

export default new WeatherService();
