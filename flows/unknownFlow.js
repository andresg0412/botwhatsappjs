// unknownFlow.js
const { addKeyword } = require('@bot-whatsapp/bot');
const { applyRandomDelay } = require('../utils/delay');
const antibanUtils = require('../utils/antibanUtils');

/**
 * Crea un flujo para manejar respuestas desconocidas
 * @param {Object} provider - Proveedor de WhatsApp
 * @param {Object} flows - Otros flujos disponibles
 * @returns {Object} Flujo para respuestas desconocidas
 */
const createUnknownFlow = (provider, { welcomeFlow, empresasFlow, solterosFlow, historiasFlow, entrevistaFlow } = {}) => {
  return addKeyword([])
    .addAnswer(
      'No he entendido lo que necesitas. ¿Podrías explicarme en pocas palabras qué es lo que te interesa?',
      { capture: true },
      async (ctx, { gotoFlow, flowDynamic, endFlow }) => {
        try {
          const chatId = ctx.from;
          const userResponse = ctx.body.toLowerCase().trim();
          
          console.log(`[UNKNOWN] Respuesta detallada del usuario: "${userResponse}"`);
          
          // Verificar si es seguro enviar un mensaje
          if (!(await antibanUtils.isSafeToSendMessage(chatId))) {
            console.log('[UNKNOWN] No es seguro enviar mensaje, saltando');
            return endFlow();
          }
          
          // Analizar la respuesta para detectar intenciones
          if (userResponse.includes('empresa') || 
              userResponse.includes('negocio') || 
              userResponse.includes('servicio') || 
              userResponse.includes('publicidad') ||
              userResponse.includes('marketing') ||
              userResponse.includes('pauta')) {
            
            console.log('[UNKNOWN] Detectada intención relacionada con empresas');
            await applyRandomDelay(async () => {
              await flowDynamic(antibanUtils.sanitizeMessage(
                'Entiendo que estás interesado en nuestros servicios para empresas. Te redirijo a esa sección.'
              ));
            });
            await antibanUtils.registerMessageSent(chatId);
            
            if (empresasFlow) return gotoFlow(empresasFlow);
          } 
          else if (userResponse.includes('solter') || 
                  userResponse.includes('pareja') || 
                  userResponse.includes('cita') || 
                  userResponse.includes('amor') ||
                  userResponse.includes('novia') ||
                  userResponse.includes('novio') ||
                  userResponse.includes('relacion')) {
            
            console.log('[UNKNOWN] Detectada intención relacionada con solteros');
            await applyRandomDelay(async () => {
              await flowDynamic(antibanUtils.sanitizeMessage(
                'Veo que estás interesado en nuestro servicio para encontrar pareja. Te redirijo a esa sección.'
              ));
            });
            await antibanUtils.registerMessageSent(chatId);
            
            if (solterosFlow) return gotoFlow(solterosFlow);
          }
          else if (userResponse.includes('historia') || 
                  userResponse.includes('cuento') || 
                  userResponse.includes('relato') || 
                  userResponse.includes('anecdota')) {
            
            console.log('[UNKNOWN] Detectada intención relacionada con historias');
            await applyRandomDelay(async () => {
              await flowDynamic(antibanUtils.sanitizeMessage(
                'Parece que te interesan nuestras historias. Te redirijo a esa sección.'
              ));
            });
            await antibanUtils.registerMessageSent(chatId);
            
            if (historiasFlow) return gotoFlow(historiasFlow);
          }
          else if (userResponse.includes('entrevista') || 
                  userResponse.includes('podcast') || 
                  userResponse.includes('radio') || 
                  userResponse.includes('programa')) {
            
            console.log('[UNKNOWN] Detectada intención relacionada con entrevistas');
            await applyRandomDelay(async () => {
              await flowDynamic(antibanUtils.sanitizeMessage(
                'Entiendo que te interesan nuestras entrevistas. Te redirijo a esa sección.'
              ));
            });
            await antibanUtils.registerMessageSent(chatId);
            
            if (entrevistaFlow) return gotoFlow(entrevistaFlow);
          }
          else if (userResponse.includes('menu') || 
                  userResponse.includes('inicio') || 
                  userResponse.includes('opciones') || 
                  userResponse.includes('principal')) {
            
            console.log('[UNKNOWN] Usuario quiere volver al menú principal');
            await applyRandomDelay(async () => {
              await flowDynamic(antibanUtils.sanitizeMessage(
                'Te redirijo al menú principal.'
              ));
            });
            await antibanUtils.registerMessageSent(chatId);
            
            if (welcomeFlow) return gotoFlow(welcomeFlow);
          }
          else {
            // No se pudo determinar la intención
            console.log('[UNKNOWN] No se pudo determinar la intención del usuario');
            await applyRandomDelay(async () => {
              await flowDynamic(antibanUtils.sanitizeMessage(
                'Lo siento, no he podido entender exactamente lo que necesitas. Para brindarte una mejor atención, te recomiendo contactar directamente con uno de nuestros asesores al número 123-456-7890 o escribir "menu" para ver las opciones disponibles.'
              ));
            });
            await antibanUtils.registerMessageSent(chatId);
            
            return endFlow();
          }
        } catch (error) {
          console.error('[UNKNOWN] Error en el flujo de respuestas desconocidas:', error);
          return endFlow();
        }
      }
    );
};

module.exports = createUnknownFlow;