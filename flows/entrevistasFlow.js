/**
 * Flujo de empresas
 */
const { addKeyword, EVENTS } = require('@bot-whatsapp/bot');
const antibanUtils = require('../utils/antibanUtils');
const {
  saludoSolteros,
  preguntarInteresadoSoltero,
  enviarFormularioSoltero,
} = require('../responses/responsesConstants');
const {
  saludoEntrevistaRandom,
  preguntarIntereadoEntrevistasRandom,
  enviarFormularioEntrevistasRandom
} = require('../responses/responsesEntrevistas');

/**
 * Crea el flujo de empresas
 * @param {Object} provider - Proveedor de WhatsApp
 * @returns {Object} Flujo de empresas configurado
 */
const createEntrevistasFlow = (provider, { unknownFlow } = {}) => {
  // Crear submenús para cada opción
  const entrevistaInteresadoSi = addKeyword(EVENTS.ACTION)
    .addAnswer(
      enviarFormularioEntrevistasRandom(),
      { delay: 5000 },
      async (ctx, { endFlow }) => {
        const chatId = ctx.from;

        // Registrar mensaje enviado
        await antibanUtils.registerMessageSent(chatId);
        //Fin del flujo
        return endFlow();
      }
    );

  const pedirRespuestaCorrectaEntrevistas = addKeyword(EVENTS.ACTION)
    .addAnswer(
      'Opción incorrecta. Las opciones son (*1*) si estas interesado, y (*2*) si no lo estas. Vuelve a escribir tu respuesta por favor.',
      { capture: true, delay: 5000 },
      async (ctx, { flowDynamic, endFlow, gotoFlow }) => {
        try {
          console.log('Procesando respuesta en el flujo de empresas - Paso 3');
          const chatId = ctx.from;
          const userResponse = ctx.body.trim();
          
          // Verificar si es seguro enviar un mensaje (anti-ban)
          if (!(await antibanUtils.isSafeToSendMessage(chatId))) {
            console.log('No es seguro enviar mensaje de respuesta, saltando');
            return;
          }
          
          // Navegar al flujo correspondiente según la respuesta
          if (userResponse.includes('1') || userResponse.includes('si')) {
            console.log('El cliente esta interesado');
            return gotoFlow(entrevistaInteresadoSi);
          } 
          else if (userResponse.includes('2') || userResponse.includes('no')) {
            console.log('El cliente no esta interesado');
            await flowDynamic("Ok, gracias por tu tiempo. Escribe *hola* cuando necesites algo más.");
            return endFlow(); // ✅ Termina correctamente el flujo
          }
          else {
            // Respuesta no reconocida - Redirigir al flujo de respuestas desconocidas
            console.log('Respuesta no reconocida, redirigiendo al flujo de respuestas desconocidas');
            return gotoFlow(unknownFlow);
          }
        } catch (error) {
          console.error('Error en el flujo de empresas (paso 2):', error);
          return endFlow();
        }
      }
    );


  // Usamos una palabra clave específica para este flujo
  const entrevistaFlow = addKeyword(['entrevista', 'presentacion'])
    // Mensaje inicial que siempre se mostrará
    .addAnswer(
      saludoEntrevistaRandom(),
      { delay: 8000 },
      async (ctx) => {
        console.log('Entrando al flujo de solteros - Paso 1');
        const chatId = ctx.from;
        await antibanUtils.registerMessageSent(chatId);
      }
    )
    // Segundo paso: Mostrar el menú de opciones
    .addAnswer(
      preguntarIntereadoEntrevistasRandom(),
      { capture: true, delay: 13500 },
      async (ctx, { flowDynamic, gotoFlow, endFlow }) => {
        try {
          console.log('Procesando respuesta en el flujo de solteros - Paso 2');
          const chatId = ctx.from;
          const userResponse = ctx.body.trim();
          
          console.log(`Respuesta del usuario en el menú de solteros: "${userResponse}"`);
          
          // Verificar si es seguro enviar un mensaje (anti-ban)
          if (!(await antibanUtils.isSafeToSendMessage(chatId))) {
            console.log('No es seguro enviar mensaje de respuesta, saltando');
            return;
          }
          
          // Navegar al flujo correspondiente según la respuesta
          if (userResponse.includes('1') || userResponse.includes('si')) {
            console.log('El cliente esta interesado');
            return gotoFlow(entrevistaInteresadoSi);
          } 
          else if (userResponse.includes('2') || userResponse.includes('no')) {
            console.log('El cliente no esta interesado');
            await flowDynamic("Ok, gracias por tu tiempo. Escribe *hola* cuando necesites algo más.");
            return endFlow(); // ✅ Termina correctamente el flujo
          }
          else {
            // Respuesta no reconocida - Redirigir al flujo de respuestas desconocidas
            console.log('Respuesta no reconocida, redirigiendo al flujo de respuestas desconocidas');
            return gotoFlow(pedirRespuestaCorrectaEntrevistas);
          }
        } catch (error) {
          console.error('Error en el flujo de soltero (paso 2):', error);
          return endFlow();
        }
      }
    );
  entrevistaFlow.ref = {};
  return {
    entrevistaFlow,
    entrevistaInteresadoSi
  };
};

module.exports = createEntrevistasFlow;