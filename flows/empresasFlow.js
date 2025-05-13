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
} = require('../responses/responsesConstants');
const {
  saludoEmpresasRandom,
  serviciosEmpresasRandom,
  preguntaInteresadoEmpresasRandom,
  pedirInfoEmpresasRandom,
  cierreEmpresasRandom,
} = require('../responses/responsesEmpresas');



/**
 * Envía una notificación al administrador sobre un cliente interesado
 * @param {Object} provider - Proveedor de WhatsApp
 * @param {string} clienteNumero - Número del cliente
 * @param {string} clienteNombre - Nombre del cliente
 * @param {string} clienteInfo - Información proporcionada por el cliente
 */
const notificarAdministrador = async (provider, clienteNumero, clienteNombre, clienteInfo) => {
  try {
    // Número del administrador (reemplaza con el número real, incluyendo código de país)
    const adminNumber = "573209123058" // Ejemplo: "34612345678" para España

    // Crear mensaje de notificación
    const mensaje =
      `🔔 *Nuevo cliente interesado*\n\n` +
      `🔔 *Servicio*: Pauta Empresas\n\n` +
      `*Nombre:* ${clienteNombre}\n` +
      `*Teléfono:* ${clienteNumero}\n` +
      `*Información:* ${clienteInfo}\n` +
      `*Fecha:* ${new Date().toLocaleString()}`

    // Enviar mensaje al administrador
    await provider.getInstance().sendMessage(`${adminNumber}@c.us`, { text: mensaje })
    console.log("✅ Notificación enviada al administrador")
  } catch (error) {
    console.error("❌ Error al enviar notificación al administrador:", error)
  }
}


/**
 * Crea el flujo de empresas
 * @param {Object} provider - Proveedor de WhatsApp
 * @returns {Object} Flujo de empresas configurado
 */
const createEmpresasFlow = (provider, { unknownFlow } = {}) => {
  // Crear submenús para cada opción
  const empresaInteresadoSi = addKeyword(EVENTS.ACTION)
    .addAnswer(
      pedirInfoEmpresasRandom(),
      { capture: true, delay: 5000 },
      async (ctx, { flowDynamic, endFlow }) => {
        const chatId = ctx.from;
        const respuesta = ctx.body;
        const nombreCliente = ctx.pushName || "Cliente"
        console.log('Respuesta en submenú servicios:', respuesta);
        
        //Guardar informacion recibida asociada al chatid
        await guardarInformacionEmpresa(chatId, respuesta);

        // Enviar notificación al administrador
        await notificarAdministrador(provider, chatId, nombreCliente, respuesta)

        //Responder diciendo que muchas gracias por la informacion, revisaremos la informacion y nos podremos en contacto contigo directamente en las proximas 48 horas
        await applyRandomDelay(async () => {
          await flowDynamic(antibanUtils.sanitizeMessage(
            cierreEmpresasRandom()
          ));
        });
        // Registrar mensaje enviado
        await antibanUtils.registerMessageSent(chatId);
        //Fin del flujo
        return endFlow();
      }
    );

  const pedirRespuestaCorrecta = addKeyword(EVENTS.ACTION)
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
            return gotoFlow(unknownFlow);
          }
        } catch (error) {
          console.error('Error en el flujo de empresas (paso 2):', error);
          return endFlow();
        }
      }
    );


  // Usamos una palabra clave específica para este flujo
  const empresasFlow = addKeyword(['empresas', 'empresa', 'negocios', 'negocio', 'servicios'])
    // Mensaje inicial que siempre se mostrará
    .addAnswer(
      saludoEmpresasRandom(),
      { delay: 8000 },
      async (ctx) => {
        console.log('Entrando al flujo de empresas - Paso 1');
        const chatId = ctx.from;
        await antibanUtils.registerMessageSent(chatId);
      }
    )
    .addAnswer(
      serviciosEmpresasRandom(),
      { delay: 11000 },
      async (ctx) => {
        console.log('Entrando al flujo de empresas - Paso 2');
        const chatId = ctx.from;
        await antibanUtils.registerMessageSent(chatId);
      }
    )
    // Segundo paso: Mostrar el menú de opciones
    .addAnswer(
      preguntaInteresadoEmpresasRandom(),
      { capture: true, delay: 13500 },
      async (ctx, { flowDynamic, gotoFlow, endFlow }) => {
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
            return gotoFlow(pedirRespuestaCorrecta);
            //if (unknownFlow) return gotoFlow(unknownFlow);
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