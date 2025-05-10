/**
 * Flujo de bienvenida para nuevos usuarios
 */
const { addKeyword } = require('@bot-whatsapp/bot');
const { getRandomResponse, formatMessageWithName } = require('../utils/messageUtils');
const { applyRandomDelay } = require('../utils/delay');
const { isWorkingHours, getOutOfHoursMessage } = require('../utils/timeUtils');
const antibanUtils = require('../utils/antibanUtils');
const { greetings, getTimeBasedGreetings } = require('../responses/greetings');
const { menuOptions } = require('../responses/responsesConstants');

/**
 * Crea el flujo de bienvenida
 * @param {Object} provider - Proveedor de WhatsApp
 * @returns {Object} Flujo de bienvenida configurado
 */
const createWelcomeFlow = (provider, { empresasFlow, solterosAnonimosFlow, historiasFlow, entrevistasFlow } = {}) => {

  return addKeyword(['hola','Hola', 'buenos dias', 'buenas tardes', 'buenas noches', 'buenas', 'hey', 'ola', 'hi', 'hello', 'que tal', 'qué tal', 'que onda','qué onda','buenos días','hi','hello','saludos','menú','menu','info','información','inicio','quiero info','quiero información','necesito info','necesito información'])
    // Primer paso: Enviar el saludo
    .addAction(async (ctx, { flowDynamic, endFlow }) => {
      try {
        const chatId = ctx.from;
        
        // Verificar si estamos en horario de atención
        if (!isWorkingHours()) {
          const outOfHoursMessage = getOutOfHoursMessage();
          
          // Verificar si es seguro enviar un mensaje (anti-ban)
          if (!(await antibanUtils.isSafeToSendMessage(chatId))) {
            console.log('No es seguro enviar mensaje, saltando respuesta');
            return endFlow();
          }

          await applyRandomDelay(async () => {
            await flowDynamic(antibanUtils.sanitizeMessage(outOfHoursMessage));
          });
          
          // Registrar mensaje enviado
          await antibanUtils.registerMessageSent(chatId);
          return endFlow();
        }
        
        // Obtener el nombre del usuario si está disponible
        const userName = ctx.pushName || '';
        
        // Seleccionar un saludo apropiado según la hora
        const timeBasedGreetings = getTimeBasedGreetings();
        const allGreetings = [...timeBasedGreetings, ...greetings];
        let greeting = getRandomResponse(allGreetings);
        
        // Personalizar el saludo con el nombre del usuario
        greeting = formatMessageWithName(greeting, userName);
        
        // Verificar si es seguro enviar un mensaje (anti-ban)
        if (!(await antibanUtils.isSafeToSendMessage(chatId))) {
          console.log('No es seguro enviar mensaje, saltando respuesta');
          return endFlow();
        }

        // Enviar el saludo
        await applyRandomDelay(async () => {
          await flowDynamic(antibanUtils.sanitizeMessage(greeting));
        });
        
        // Registrar mensaje enviado
        await antibanUtils.registerMessageSent(chatId);

        // Esperar un momento antes de continuar
        await new Promise(resolve => setTimeout(resolve, 2300));
      } catch (error) {
        console.error('Error en el flujo de bienvenida (saludo):', error);
      }
    })

    // Segundo paso: Enviar el menú y ESPERAR la respuesta del usuario
    .addAnswer(menuOptions,
      { capture: true },
      // Callback para procesar la respuesta
      async (ctx, { gotoFlow, flowDynamic, fallBack }) => {
        try {
          const chatId = ctx.from;
          const userResponse = ctx.body.toLowerCase().trim();
          
          console.log(`Respuesta del usuario al menú: "${userResponse}"`);
          
          // Verificar si es seguro enviar un mensaje (anti-ban)
          if (!(await antibanUtils.isSafeToSendMessage(chatId))) {
            console.log('No es seguro enviar mensaje de respuesta, saltando');
            return;
          }
          
          // Navegar al flujo correspondiente según la respuesta
          if (userResponse.includes('1') || userResponse.includes('empresa')) {
            console.log('Navegando al flujo de empresas');
            if (empresasFlow) return gotoFlow(empresasFlow);
          } 
          else if (userResponse.includes('2') || userResponse.includes('solter')) {
            console.log('Navegando al flujo de solteros anónimos');
            if (solterosAnonimosFlow) return gotoFlow(solterosAnonimosFlow);
          } 
          else if (userResponse.includes('3') || userResponse.includes('historia')) {
            console.log('Navegando al flujo de historias');
            if (historiasFlow) return gotoFlow(historiasFlow);
          } 
          else if (userResponse.includes('4') || userResponse.includes('entrevista')) {
            console.log('Navegando al flujo de entrevistas');
            if (entrevistasFlow) return gotoFlow(entrevistasFlow);
          } 
          else {
            // Respuesta no reconocida
            await applyRandomDelay(async () => {
              await flowDynamic(antibanUtils.sanitizeMessage(
                'No he entendido tu respuesta. Por favor, selecciona una opción válida del menú (1-4).'
              ));
            });
            await antibanUtils.registerMessageSent(chatId);
            return fallBack();
          }
        } catch (error) {
          console.error('Error en el flujo de bienvenida (procesamiento de respuesta):', error);
          return fallBack();
        }
      }
    );

};

module.exports = createWelcomeFlow;