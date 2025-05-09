/**
 * Utilidades para manejar delays en las respuestas
 */
const { DELAY_CONFIG } = require('../config');

/**
 * Genera un delay aleatorio entre los valores mínimo y máximo configurados
 * @returns {number} Tiempo de delay en milisegundos
 */
const getRandomDelay = () => {
  const { min, max } = DELAY_CONFIG;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Aplica un delay aleatorio antes de ejecutar una función
 * @param {Function} callback - Función a ejecutar después del delay
 * @returns {Promise} Promesa que se resuelve después del delay
 */
const applyRandomDelay = async (callback) => {
  const delay = getRandomDelay();
  console.log(`Aplicando delay de ${delay}ms`);
  
  return new Promise(resolve => {
    setTimeout(() => {
      const result = callback();
      resolve(result);
    }, delay);
  });
};

module.exports = {
  getRandomDelay,
  applyRandomDelay
};