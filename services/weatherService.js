/**
 * Servicio para obtener información del clima
 * Nota: Este es un servicio simulado. En un entorno real, se conectaría a una API de clima.
 */

/**
 * Obtiene información del clima para una ciudad específica
 * @param {string} city - Nombre de la ciudad
 * @returns {Promise<string>} Información del clima formateada
 */
const getWeatherInfo = async (city) => {
    // Simulación de delay de API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Normalizar el nombre de la ciudad
    const normalizedCity = city.toLowerCase().trim();
    
    // Datos simulados para algunas ciudades
    const weatherData = {
      'ciudad de méxico': {
        temp: Math.floor(Math.random() * 10) + 15, // 15-25°C
        condition: ['soleado', 'parcialmente nublado', 'nublado'][Math.floor(Math.random() * 3)],
        humidity: Math.floor(Math.random() * 30) + 40, // 40-70%
        wind: Math.floor(Math.random() * 15) + 5 // 5-20 km/h
      },
      'guadalajara': {
        temp: Math.floor(Math.random() * 10) + 18, // 18-28°C
        condition: ['soleado', 'parcialmente nublado', 'lluvioso'][Math.floor(Math.random() * 3)],
        humidity: Math.floor(Math.random() * 30) + 35, // 35-65%
        wind: Math.floor(Math.random() * 10) + 5 // 5-15 km/h
      },
      'monterrey': {
        temp: Math.floor(Math.random() * 15) + 20, // 20-35°C
        condition: ['soleado', 'caluroso', 'parcialmente nublado'][Math.floor(Math.random() * 3)],
        humidity: Math.floor(Math.random() * 20) + 30, // 30-50%
        wind: Math.floor(Math.random() * 15) + 10 // 10-25 km/h
      }
    };
    
    // Verificar si tenemos datos para la ciudad solicitada
    if (weatherData[normalizedCity]) {
      const data = weatherData[normalizedCity];
      
      // Formatear la respuesta
      return `🌤️ *Clima actual en ${city}*\n\n` +
             `🌡️ Temperatura: ${data.temp}°C\n` +
             `🌫️ Condición: ${data.condition}\n` +
             `💧 Humedad: ${data.humidity}%\n` +
             `💨 Viento: ${data.wind} km/h\n\n` +
             `Actualizado hace unos minutos.`;
    } else {
      // Generar datos aleatorios para ciudades no registradas
      const temp = Math.floor(Math.random() * 20) + 10; // 10-30°C
      const conditions = ['soleado', 'parcialmente nublado', 'nublado', 'lluvioso', 'tormentoso'];
      const condition = conditions[Math.floor(Math.random() * conditions.length)];
      const humidity = Math.floor(Math.random() * 50) + 30; // 30-80%
      const wind = Math.floor(Math.random() * 20) + 5; // 5-25 km/h
      
      return `🌤️ *Clima actual en ${city}*\n\n` +
             `🌡️ Temperatura: ${temp}°C\n` +
             `🌫️ Condición: ${condition}\n` +
             `💧 Humedad: ${humidity}%\n` +
             `💨 Viento: ${wind} km/h\n\n` +
             `Actualizado hace unos minutos.`;
    }
  };
  
  module.exports = {
    getWeatherInfo
  };