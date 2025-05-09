/**
 * Utilidades para el manejo de mensajes
 */

/**
 * Selecciona una respuesta aleatoria de un array de posibles respuestas
 * @param {Array} responses - Array de posibles respuestas
 * @returns {string} Respuesta seleccionada aleatoriamente
 */
const getRandomResponse = (responses) => {
    if (!Array.isArray(responses) || responses.length === 0) {
      return "Lo siento, no tengo una respuesta para eso en este momento.";
    }
    
    const index = Math.floor(Math.random() * responses.length);
    return responses[index];
  };
  
  /**
   * Detecta la intención del mensaje del usuario
   * @param {string} message - Mensaje del usuario
   * @returns {string} Intención detectada
   */
  const detectIntent = (message) => {
    const lowerMsg = message.toLowerCase();
    
    // Detectar saludos
    if (/^(hola|buenos dias|buenas tardes|buenas noches|hey|saludos|hi|hello)/i.test(lowerMsg)) {
      return 'greeting';
    }
    
    // Detectar despedidas
    if (/^(adios|chao|hasta luego|bye|nos vemos|hasta pronto)/i.test(lowerMsg)) {
      return 'farewell';
    }
    
    // Detectar agradecimientos
    if (/^(gracias|te agradezco|thanks|thank you)/i.test(lowerMsg)) {
      return 'thanks';
    }
    
    // Detectar solicitud de ayuda
    if (/^(ayuda|help|ayudame|necesito ayuda|como funciona)/i.test(lowerMsg)) {
      return 'help';
    }
    
    // Detectar solicitud de menú
    if (/^(menu|opciones|que puedes hacer|servicios|funciones)/i.test(lowerMsg)) {
      return 'menu';
    }
    
    // Detectar consulta de clima
    if (/clima|temperatura|lluvia|pronostico/i.test(lowerMsg)) {
      return 'weather';
    }
    
    // Detectar consulta de noticias
    if (/noticias|noticia|news|actualidad|que hay de nuevo/i.test(lowerMsg)) {
      return 'news';
    }
    
    // Por defecto
    return 'unknown';
  };
  
  /**
   * Formatea un mensaje para incluir el nombre del usuario
   * @param {string} message - Mensaje a formatear
   * @param {string} name - Nombre del usuario
   * @returns {string} Mensaje formateado
   */
  const formatMessageWithName = (message, name) => {
    return message.replace('{name}', name || 'amigo');
  };
  
  module.exports = {
    getRandomResponse,
    detectIntent,
    formatMessageWithName
  };