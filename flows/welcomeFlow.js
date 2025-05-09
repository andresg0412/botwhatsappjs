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

// Importar los otros flujos que queremos usar
const { createWeatherFlow } = require('./serviceFlow');
const createMenuFlow = require('./menuFlow');
const createEmpresasFlow = require('./empresasFlow');
const createSolterosAnonimosFlow = require('./solterosAnonimosFlow');
const createHistoriasFlow = require('./historiasFlow');
const createEntrevistasFlow = require('./entrevistasFlow');

/**
 * Crea el flujo de bienvenida
 * @param {Object} provider - Proveedor de WhatsApp
 * @returns {Object} Flujo de bienvenida configurado
 */
const createWelcomeFlow = (provider) => {
  // Crear instancias de los otros flujos
  //const serviceFlow = createWeatherFlow(provider);
  //const menuFlow = createMenuFlow(provider);
  const empresasFlow = createEmpresasFlow(provider);
  const solterosAnonimosFlow = createSolterosAnonimosFlow(provider);
  const historiasFlow = createHistoriasFlow(provider);
  const entrevistasFlow = createEntrevistasFlow(provider);

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
          const userResponse = ctx.body.trim();
          
          console.log(`Respuesta del usuario al menú: "${userResponse}"`);
          
          // Verificar si es seguro enviar un mensaje (anti-ban)
          if (!(await antibanUtils.isSafeToSendMessage(chatId))) {
            console.log('No es seguro enviar mensaje de respuesta, saltando');
            return;
          }
          
          // Procesar la respuesta del usuario
          switch (userResponse) {
            case '1':
              // Opción 1: Ir al flujo de Empresas
              console.log('Usuario eligió opción 1: Empresas');
              return gotoFlow(empresasFlow);
              
            case '2':
              // Opción 2: Ir al flujo de Solteros Anonimos
              console.log('Usuario eligió opción 2: Solteros Anonimos');
              return gotoFlow(solterosAnonimosFlow);
              
            case '3':
              // Opción 3: Ir al flujo de Historias
              console.log('Usuario eligió opción 3: Historias');
              return gotoFlow(historiasFlow);
              
            case '4':
              // Opción 4: Ir al flujo de Entrevistas
              console.log('Usuario eligió opción 4: Entrevistas');
              return gotoFlow(entrevistasFlow);
              
            default:
              // Opción no válida
              console.log('Usuario eligió una opción no válida:', userResponse);
              await applyRandomDelay(async () => {
                await flowDynamic(antibanUtils.sanitizeMessage(
                  "⚠️ Opción no válida. Por favor, elige una opción del 1 al 4."
                ));
              });
              await antibanUtils.registerMessageSent(chatId);
              
              // Usar fallBack para volver a mostrar el menú y esperar otra respuesta
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