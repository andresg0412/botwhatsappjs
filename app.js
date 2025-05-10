/**
 * Bot de WhatsApp con Baileys
 * Características:
 * - Respuestas variables y aleatorias
 * - Delay aleatorio en respuestas
 * - Horario de atención configurable
 * - Estrategias anti-ban
 * - Funcionalidades interesantes para el usuario
 */

// Importar dependencias del framework
const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot');
const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys');
const JsonFileAdapter = require('@bot-whatsapp/database/json');

// Importar configuraciones
const { WORKING_HOURS, DELAY_CONFIG, ANTI_BAN_CONFIG } = require('./config');

// Importar utilidades
const { getRandomResponse, detectIntent, formatMessageWithName } = require('./utils/messageUtils');
const { applyRandomDelay } = require('./utils/delay');
const { isWorkingHours, getOutOfHoursMessage } = require('./utils/timeUtils');
const antibanUtils = require('./utils/antibanUtils');
const { findFaqResponse } = require('./responses/faqs');
const { unknownResponses } = require('./responses/general');

// Importar flujos
const createWelcomeFlow = require('./flows/welcomeFlow');
const createMenuFlow = require('./flows/menuFlow');
const createEmpresasFlow = require('./flows/empresasFlow');
const createSolterosAnonimosFlow = require('./flows/solterosAnonimosFlow');
const createHistoriasFlow = require('./flows/historiasFlow');
const createEntrevistasFlow = require('./flows/entrevistasFlow');
const createUnknownFlow = require('./flows/unknownFlow');

// Flujo principal para capturar mensajes que no coinciden con otros flujos
/*const mainFlow = addKeyword([])
  .addAction(async (ctx, { flowDynamic, endFlow }) => {
    const chatId = ctx.from;
    console.log('Mensaje recibido:', ctx.body);
    
    // Verificar si estamos en horario de atención
    if (!isWorkingHours()) {
      // Solo responder al primer mensaje fuera de horario
      if (ctx.body.toLowerCase().match(/^(hola|buenos dias|buenas tardes|buenas noches|hey|menu|ayuda|help)/i)) {
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
      
      // No responder a otros mensajes fuera de horario
      return endFlow();
    }
    
    // Detectar la intención del mensaje
    const intent = detectIntent(ctx.body);
    console.log('Intención detectada:', intent);
    
    // Buscar respuesta en las FAQs
    const faqResponse = findFaqResponse(ctx.body);
    
    let response;
    
    if (faqResponse) {
      // Si encontramos una respuesta en las FAQs
      response = getRandomResponse(faqResponse);
    } else {
      // Si no encontramos una respuesta específica
      switch (intent) {
        case 'greeting':
        case 'farewell':
        case 'thanks':
        case 'help':
        case 'menu':
        case 'weather':
        case 'news':
          // Estos intents son manejados por otros flujos
          return endFlow();
        default:
          // Respuesta para mensajes desconocidos
          response = getRandomResponse(unknownResponses);
      }
    }
    
    // Obtener el nombre del usuario si está disponible
    const userName = ctx.pushName || '';
    
    // Personalizar la respuesta con el nombre del usuario
    response = formatMessageWithName(response, userName);
    
    // Verificar si es seguro enviar un mensaje (anti-ban)
    if (!(await antibanUtils.isSafeToSendMessage(chatId))) {
        console.log('No es seguro enviar mensaje, saltando respuesta');
        return endFlow();
    }
    await applyRandomDelay(async () => {
        await flowDynamic(antibanUtils.sanitizeMessage(response));
    });
      
    // Registrar mensaje enviado
    await antibanUtils.registerMessageSent(chatId);
    return endFlow();
    
  });*/

// Función principal para iniciar el bot
const main = async () => {
  // Mostrar configuración del bot
  console.log('Iniciando Bot de WhatsApp con la siguiente configuración:');
  console.log('Horario de trabajo:', WORKING_HOURS);
  console.log('Configuración de delays:', DELAY_CONFIG);
  console.log('Configuración anti-ban:', ANTI_BAN_CONFIG);

  await antibanUtils.init();
  
  // Crear el proveedor (Baileys)
  const adapterDB = new JsonFileAdapter();

  const adapterProvider = createProvider(BaileysProvider);
  
  // Crear flujos de conversación
  const menuFlow = createMenuFlow(adapterProvider);
  const unknownFlow = createUnknownFlow(adapterProvider);

  const empresasFlows = createEmpresasFlow(adapterProvider, { unknownFlow });
  const { empresasFlow, empresaInteresadoSi } = empresasFlows;

  const solterosAnonimosFlows = createSolterosAnonimosFlow(adapterProvider, { unknownFlow });
  const { solterosFlow, solteroInteresadoSi} = solterosAnonimosFlows;

  const historiasFlows = createHistoriasFlow(adapterProvider, { unknownFlow });
  const { historiasFlow, historiasInteresadoSi } = historiasFlows;

  const entrevistasFlows = createEntrevistasFlow(adapterProvider, { unknownFlow });
  const { entrevistaFlow, entrevistaInteresadoSi } = entrevistasFlows;

  unknownFlow.ref = {
    welcomeFlow: null,
    empresasFlow,
    solterosFlow,
    historiasFlow,
    entrevistaFlow
  };

  // Crear welcomeFlow con referencias a los otros flujos
  const welcomeFlow = createWelcomeFlow(adapterProvider, {
    empresasFlow,
    solterosFlow,
    historiasFlow,
    entrevistaFlow,
    unknownFlow
  });

  unknownFlow.ref.welcomeFlow = welcomeFlow;

  // Actualizar las referencias en los otros flujos
  empresasFlow.ref = { welcomeFlow, unknownFlow };
  solterosFlow.ref = { welcomeFlow, unknownFlow };
  historiasFlow.ref = { welcomeFlow, unknownFlow };
  entrevistaFlow.ref = { welcomeFlow, unknownFlow };
  
  // Crear el bot con todos los flujos
  const bot = await createBot({
    flow: createFlow([
      welcomeFlow,
      menuFlow,
      empresasFlow,
      empresaInteresadoSi,
      solterosFlow,
      solteroInteresadoSi,
      historiasFlow,
      historiasInteresadoSi,
      entrevistaFlow,
      entrevistaInteresadoSi,
      unknownFlow
      //mainFlow // Flujo principal para capturar mensajes que no coinciden con otros flujos
    ]),
    provider: adapterProvider,
    database: adapterDB
  });
  QRPortalWeb();
  
  // Mensaje de inicio exitoso
  console.log('¡Bot de WhatsApp iniciado correctamente!');
  console.log('Escanea el código QR para iniciar sesión');
  return bot;
};

// Iniciar el bot
main();