import { promises as fs } from 'fs';

// TODO: Define a City class with name and id properties
class City {
  private name: string;
  private id: number;

  constructor(name: string, id: number) {
      this.name = name;
      this.id = id;
  }

  getName(): string {
      return this.name;
  }

  getId(): number {
      return this.id;
  }

  setName(name: string): void {
      this.name = name;
  }

  setId(id: number): void {
      this.id = id;
  }
}

// TODO: Complete the HistoryService class
class HistoryService {
  private filePath: string = 'searchHistory.json';
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read(): Promise<City[]> {
    try {
        const data = await fs.readFile(this.filePath, 'utf8');
        const rawCities = JSON.parse(data);
        return rawCities.map((city: any) => new City(city.name, city.id));
    } catch (error) {
        // If file doesn't exist or is empty, return empty array
        return [];
    }
}
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]): Promise<void> {
    const data = JSON.stringify(cities, null, 2);
    await fs.writeFile(this.filePath, data, 'utf8');
}
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities(): Promise<City[]> {
    return await this.read();
}
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(cityName: string): Promise<City> {
    const cities = await this.read();
    
    // Generate new ID (simple increment - you might want a more robust ID generation)
    const maxId = cities.reduce((max, city) => Math.max(max, city.getId()), 0);
    const newCity = new City(cityName, maxId + 1);
    
    cities.push(newCity);
    await this.write(cities);
    
    return newCity;
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string): Promise<boolean> {
    const cities = await this.read();
    const numericId = parseInt(id);
    
    const initialLength = cities.length;
    const filteredCities = cities.filter(city => city.getId() !== numericId);
    
    if (filteredCities.length !== initialLength) {
        await this.write(filteredCities);
        return true;
    }
    
    return false;
  }
}

export default new HistoryService();
