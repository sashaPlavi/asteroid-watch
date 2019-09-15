function MyAsteroids(asteroids) {
  this.aprocheDate = asteroids.close_approach_data[0].close_approach_date;
  this.name = asteroids.name;
  this.links = asteroids.links;
  this.kilometers_per_hour =
    asteroids.close_approach_data[0].relative_velocity.kilometers_per_hour;
  this.estimated_diameter_min =
    asteroids.estimated_diameter.kilometers.estimated_diameter_min;
  this.estimated_diameter_max =
    asteroids.estimated_diameter.kilometers.estimated_diameter_max;
}
export { MyAsteroids };
