/**
 * Flujo para servicios específicos (clima, noticias, etc.)
 */
const { addKeyword } = require('@bot-whatsapp/bot');
const { getRandomResponse } = require('../utils/messageUtils');
const { applyRandomDelay } = require('../utils/delay');
const { isWorkingHours, getOutOfHoursMessage } = require('../utils/timeUtils');
const { isSafeToSendMessage, registerMessageSent, sanitizeMessage } = require('../utils/antibanUtils');
const { serviceUnavailableResponses } = require('../responses/general');
const { getWeatherInfo } = require('../services/weatherService');
const { getLatestNews } = require('../services/newsService');

/**
 * Crea el flujo para el servicio de clima
 * @param {Object} provider - Proveedor de WhatsApp
 * @returns {Object} Flujo del servicio de clima configurado
 */
const createWeatherFlow = (provider) => {
  return addKeyword(['clima', 'temperatura', 'pronostico'])
    .addAction(async (ctx, { flowDynamic, endFlow }) => {
      // Verificar si estamos en horario de atención
      if (!isWorkingHours()) {
        const outOfHoursMessage = getOutOfHoursMessage();
        
        // Verificar si es seguro enviar un mensaje (anti-ban)
        if (!isSafeToSendMessage()) {
          console.log('No es seguro enviar mensaje, saltando respuesta');
          return endFlow();
        }
        
        // Registrar mensaje enviado
        registerMessageSent();
        
        // Enviar mensaje fuera de horario con delay aleatorio
        return await applyRandomDelay(async () => {
          await flowDynamic(sanitizeMessage(outOfHoursMessage));
        });
      }
      
      // Extraer la ciudad del mensaje
      const message = ctx.body.toLowerCase();
      const cityMatch = message.match(/clima\s+(?:en|de)?\s+(.+)/i);
      const city = cityMatch ? cityMatch[1].trim() : null;
      
      let response;
      
      if (city) {
        try {
          // Obtener información del clima
          response = await getWeatherInfo(city);
        } catch (error) {
          console.error('Error al obtener el clima:', error);
          response = getRandomResponse(serviceUnavailableResponses);
        }
      } else {
        response = "Por favor, indica la ciudad para la que quieres conocer el clima. Por ejemplo: 'clima Ciudad de México'";
      }
      
      // Verificar si es seguro enviar un mensaje (anti-ban)
      if (!isSafeToSendMessage()) {
        console.log('No es seguro enviar mensaje, saltando respuesta');
        return endFlow();
      }
      
      // Registrar mensaje enviado
      registerMessageSent();
      
      // Enviar respuesta con delay aleatorio
      return await applyRandomDelay(async () => {
        await flowDynamic(sanitizeMessage(response));
      });
    });
};

/**
 * Crea el flujo para el servicio de noticias
 * @param {Object} provider - Proveedor de WhatsApp
 * @returns {Object} Flujo del servicio de noticias configurado
 */
const createNewsFlow = (provider) => {
  return addKeyword(['noticias', 'noticia', 'news'])
    .addAction(async (ctx, { flowDynamic, endFlow }) => {
      // Verificar si estamos en horario de atención
      if (!isWorkingHours()) {
        const outOfHoursMessage = getOutOfHoursMessage();
        
        // Verificar si es seguro enviar un mensaje (anti-ban)
        if (!isSafeToSendMessage()) {
          console.log('No es seguro enviar mensaje, saltando respuesta');
          return endFlow();
        }
        
        // Registrar mensaje enviado
        registerMessageSent();
        
        // Enviar mensaje fuera de horario con delay aleatorio
        return await applyRandomDelay(async () => {
          await flowDynamic(sanitizeMessage(outOfHoursMessage));
        });
      }
      
      // Extraer la categoría del mensaje
      const message = ctx.body.toLowerCase();
      const categoryMatch = message.match(/noticias\s+(?:de|sobre)?\s+(.+)/i);
      const category = categoryMatch ? categoryMatch[1].trim() : null;
      
      let response;
      
      try {
        // Obtener noticias recientes
        response = await getLatestNews(category);
      } catch (error) {
        console.error('Error al obtener noticias:', error);
        response = getRandomResponse(serviceUnavailableResponses);
      }
      
      // Verificar si es seguro enviar un mensaje (anti-ban)
      if (!isSafeToSendMessage()) {
        console.log('No es seguro enviar mensaje, saltando respuesta');
        return endFlow();
      }
      
      // Registrar mensaje enviado
      registerMessageSent();
      
      // Enviar respuesta con delay aleatorio
      return await applyRandomDelay(async () => {
        await flowDynamic(sanitizeMessage(response));
      });
    });
};

module.exports = {
  createWeatherFlow,
  createNewsFlow
};