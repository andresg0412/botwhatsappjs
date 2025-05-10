/**
 * Flujo del menú principal
 */
const { addKeyword, EVENTS } = require('@bot-whatsapp/bot');
const { getRandomResponse } = require('../utils/messageUtils');
const { applyRandomDelay } = require('../utils/delay');
//const { isWorkingHours, getOutOfHoursMessage } = require('../utils/timeUtils');
const antibanUtils = require('../utils/antibanUtils');

/**
 * Crea el flujo del menú principal
 * @param {Object} provider - Proveedor de WhatsApp
 * @returns {Object} Flujo del menú configurado
 */
const createSolterosAnonimosFlow = (provider) => {
  return addKeyword(['2'])
    .addAction(async (ctx, { flowDynamic, endFlow }) => {
      // Verificar si estamos en horario de atención
      /*if (!isWorkingHours()) {
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
      }*/
      
      // Seleccionar una respuesta aleatoria para el menú
      //const menuResponse = getRandomResponse(menuResponses);
      
      // Verificar si es seguro enviar un mensaje (anti-ban)
      if (!isSafeToSendMessage()) {
        console.log('No es seguro enviar mensaje, saltando respuesta');
        return endFlow();
      }
      
      // Enviar mensaje
        await applyRandomDelay(async () => {
          await flowDynamic(antibanUtils.sanitizeMessage('OPCION SOLTEROS'));
        });
        
        // Registrar mensaje enviado
        await antibanUtils.registerMessageSent(chatId);
        return endFlow();
    });
};

module.exports = createSolterosAnonimosFlow;