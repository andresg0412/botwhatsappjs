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

/**
 * Crea el flujo de bienvenida
 * @param {Object} provider - Proveedor de WhatsApp
 * @returns {Object} Flujo de bienvenida configurado
 */
const createWelcomeFlow = (provider) => {
  // Crear instancias de los otros flujos
  const serviceFlow = createWeatherFlow(provider);
  const menuFlow = createMenuFlow(provider);

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
      { capture: true},
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
              // Opción 1: Ir al flujo de servicios
              console.log('Usuario eligió opción 1: Servicios');
              return gotoFlow(serviceFlow);
              
            case '2':
              // Opción 2: Ir al menú principal
              console.log('Usuario eligió opción 2: Menú principal');
              return gotoFlow(menuFlow);
              
            case '3':
              // Opción 3: Mostrar información
              console.log('Usuario eligió opción 3: Información');
              await applyRandomDelay(async () => {
                await flowDynamic(antibanUtils.sanitizeMessage(
                  "🏢 *Sobre Nosotros*\n\n" +
                  "Somos una empresa dedicada a proporcionar soluciones innovadoras para nuestros clientes. " +
                  "Fundada en 2010, hemos crecido constantemente gracias a la confianza de nuestros usuarios.\n\n" +
                  "Nuestra misión es ofrecer servicios de alta calidad con atención personalizada."
                ));
              });
              await antibanUtils.registerMessageSent(chatId);
              
              // Después de mostrar la información, volver a mostrar el menú
              await new Promise(resolve => setTimeout(resolve, 2000));
              return gotoFlow(createWelcomeFlow(provider));
              
            case '4':
              // Opción 4: Mostrar información de contacto
              console.log('Usuario eligió opción 4: Contacto');
              await applyRandomDelay(async () => {
                await flowDynamic(antibanUtils.sanitizeMessage(
                  "📞 *Información de Contacto*\n\n" +
                  "Puedes contactarnos a través de los siguientes medios:\n\n" +
                  "📧 Email: contacto@ejemplo.com\n" +
                  "☎️ Teléfono: +123 456 7890\n" +
                  "🌐 Sitio web: www.ejemplo.com\n\n" +
                  "Horario de atención: Lunes a Viernes de 8:00 AM a 8:00 PM"
                ));
              });
              await antibanUtils.registerMessageSent(chatId);
              
              // Después de mostrar la información de contacto, volver a mostrar el menú
              await new Promise(resolve => setTimeout(resolve, 2000));
              return gotoFlow(createWelcomeFlow(provider));
              
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