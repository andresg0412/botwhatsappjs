/**
 * Flujo de empresas
 */
const { addKeyword, EVENTS } = require('@bot-whatsapp/bot');
const { applyRandomDelay } = require('../utils/delay');
const antibanUtils = require('../utils/antibanUtils');
const { guardarInformacionEmpresa } = require('../utils/dataStorage');
const {
  saludoEmpresas,
  serviciosEmpresas,
  preguntaInteresado,
  pedirInfoEmpresa,
  cierreEmpresa
} = require('../responses/responsesConstants')

/**
 * Crea el flujo de empresas
 * @param {Object} provider - Proveedor de WhatsApp
 * @returns {Object} Flujo de empresas configurado
 */
const createEmpresasFlow = (provider, { unknownFlow } = {}) => {
  // Crear submenús para cada opción
  const empresaInteresadoSi = addKeyword([])
    .addAnswer(
      pedirInfoEmpresa,
      { capture: true, delay: 5000 },
      async (ctx, { flowDynamic, endFlow }) => {
        const chatId = ctx.from;
        const respuesta = ctx.body;
        console.log('Respuesta en submenú servicios:', respuesta);
        
        //Guardar informacion recibida asociada al chatid
        await guardarInformacionEmpresa(chatId, respuesta);

        //Responder diciendo que muchas gracias por la informacion, revisaremos la informacion y nos podremos en contacto contigo directamente en las proximas 48 horas
        await applyRandomDelay(async () => {
          await flowDynamic(antibanUtils.sanitizeMessage(
            cierreEmpresa
          ));
        });
        // Registrar mensaje enviado
        await antibanUtils.registerMessageSent(chatId);
        //Fin del flujo
        return endFlow();
      }
    );


  // Usamos una palabra clave específica para este flujo
  const empresasFlow = addKeyword([])
    // Mensaje inicial que siempre se mostrará
    .addAnswer(
      saludoEmpresas,
      { delay: 8000 },
      async (ctx) => {
        console.log('Entrando al flujo de empresas - Paso 1');
        const chatId = ctx.from;
        await antibanUtils.registerMessageSent(chatId);
      }
    )
    .addAnswer(
      serviciosEmpresas,
      { delay: 11000 },
      async (ctx) => {
        console.log('Entrando al flujo de empresas - Paso 2');
        const chatId = ctx.from;
        await antibanUtils.registerMessageSent(chatId);
      }
    )
    // Segundo paso: Mostrar el menú de opciones
    .addAnswer(
      preguntaInteresado,
      { capture: true, delay: 13500 },
      async (ctx, { flowDynamic, gotoFlow, fallBack, endFlow }) => {
        try {
          console.log('Procesando respuesta en el flujo de empresas - Paso 3');
          const chatId = ctx.from;
          const userResponse = ctx.body.trim();
          
          console.log(`Respuesta del usuario en el menú de empresas: "${userResponse}"`);
          
          // Verificar si es seguro enviar un mensaje (anti-ban)
          if (!(await antibanUtils.isSafeToSendMessage(chatId))) {
            console.log('No es seguro enviar mensaje de respuesta, saltando');
            return;
          }
          
          // Navegar al flujo correspondiente según la respuesta
          if (userResponse.includes('1') || userResponse.includes('si')) {
            console.log('El cliente esta interesado');
            return gotoFlow(empresaInteresadoSi);
          } 
          else if (userResponse.includes('2') || userResponse.includes('no')) {
            console.log('El cliente no esta interesado');
            await flowDynamic("Ok, gracias por tu tiempo. Escribe *hola* cuando necesites algo más.");
            return endFlow(); // ✅ Termina correctamente el flujo
          }
          else {
            // Respuesta no reconocida - Redirigir al flujo de respuestas desconocidas
            console.log('Respuesta no reconocida, redirigiendo al flujo de respuestas desconocidas');
            if (unknownFlow) return gotoFlow(unknownFlow);
          }
        } catch (error) {
          console.error('Error en el flujo de empresas (paso 2):', error);
          return endFlow();
        }
      }
    );
  empresasFlow.ref = {};
  return {
    empresasFlow,
    empresaInteresadoSi
  };
};

module.exports = createEmpresasFlow;