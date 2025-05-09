/**
 * Flujo de empresas
 */
const { addKeyword } = require('@bot-whatsapp/bot');
const { applyRandomDelay } = require('../utils/delay');
const antibanUtils = require('../utils/antibanUtils');

/**
 * Crea el flujo de empresas
 * @param {Object} provider - Proveedor de WhatsApp
 * @returns {Object} Flujo de empresas configurado
 */
const createEmpresasFlow = (provider) => {
  // Usamos una palabra clave específica para este flujo
  return addKeyword(['empresas', 'empresa', 'negocios', 'negocio', 'corporativo'])
    // Primer paso: Mostrar el mensaje de bienvenida y el menú
    .addAction(async (ctx, { flowDynamic }) => {
      try {
        console.log('Entrando al flujo de empresas - Paso 1');
        const chatId = ctx.from;
        
        // Verificar si es seguro enviar un mensaje (anti-ban)
        if (!(await antibanUtils.isSafeToSendMessage(chatId))) {
          console.log('No es seguro enviar mensaje, saltando respuesta');
          return;
        }
        
        // Enviar mensaje inicial del flujo de empresas
        await applyRandomDelay(async () => {
          await flowDynamic(antibanUtils.sanitizeMessage('🏢 *SECCIÓN DE EMPRESAS* 🏢\n\nBienvenido a nuestra sección especializada para empresas. Aquí encontrarás información sobre nuestros servicios corporativos.'));
        });
        
        // Registrar mensaje enviado
        await antibanUtils.registerMessageSent(chatId);
        
        // Esperar un momento antes de mostrar el menú
        await new Promise(resolve => setTimeout(resolve, 1500));
      } catch (error) {
        console.error('Error en el flujo de empresas (paso 1):', error);
      }
    })
    // Segundo paso: Mostrar el menú de opciones
    .addAnswer('Por favor, selecciona una opción:\n\n*1*. Servicios para empresas\n*2*. Solicitar cotización\n*3*. Casos de éxito\n*4*. Volver al menú principal',
      { capture: true },
      async (ctx, { flowDynamic, fallBack }) => {
        try {
          console.log('Procesando respuesta en el flujo de empresas - Paso 2');
          const chatId = ctx.from;
          const userResponse = ctx.body.trim();
          
          console.log(`Respuesta del usuario en el menú de empresas: "${userResponse}"`);
          
          // Verificar si es seguro enviar un mensaje (anti-ban)
          if (!(await antibanUtils.isSafeToSendMessage(chatId))) {
            console.log('No es seguro enviar mensaje de respuesta, saltando');
            return;
          }
          
          // Procesar la respuesta del usuario
          switch (userResponse) {
            case '1':
              // Opción 1: Servicios para empresas
              console.log('Usuario eligió opción 1: Servicios para empresas');
              await applyRandomDelay(async () => {
                await flowDynamic(antibanUtils.sanitizeMessage(
                  "📊 *Nuestros Servicios para Empresas*\n\n" +
                  "• Consultoría estratégica\n" +
                  "• Desarrollo de software a medida\n" +
                  "• Soluciones de marketing digital\n" +
                  "• Optimización de procesos\n" +
                  "• Capacitación de personal\n\n" +
                  "¿Deseas más información sobre algún servicio específico?"
                ));
              });
              await antibanUtils.registerMessageSent(chatId);
              break;
              
            case '2':
              // Opción 2: Solicitar cotización
              console.log('Usuario eligió opción 2: Solicitar cotización');
              await applyRandomDelay(async () => {
                await flowDynamic(antibanUtils.sanitizeMessage(
                  "💼 *Solicitud de Cotización*\n\n" +
                  "Para solicitar una cotización personalizada, por favor envíanos los siguientes datos:\n\n" +
                  "• Nombre de la empresa\n" +
                  "• Servicio que te interesa\n" +
                  "• Breve descripción de tus necesidades\n\n" +
                  "Un asesor se pondrá en contacto contigo a la brevedad."
                ));
              });
              await antibanUtils.registerMessageSent(chatId);
              break;
              
            case '3':
              // Opción 3: Casos de éxito
              console.log('Usuario eligió opción 3: Casos de éxito');
              await applyRandomDelay(async () => {
                await flowDynamic(antibanUtils.sanitizeMessage(
                  "🏆 *Casos de Éxito*\n\n" +
                  "• Empresa ABC: Incremento del 200% en ventas tras implementar nuestra estrategia de marketing.\n\n" +
                  "• Corporación XYZ: Reducción del 40% en costos operativos gracias a nuestra consultoría.\n\n" +
                  "• Startup 123: Lanzamiento exitoso con más de 10,000 usuarios en el primer mes.\n\n" +
                  "Estos son solo algunos ejemplos de cómo hemos ayudado a nuestros clientes a alcanzar sus objetivos."
                ));
              });
              await antibanUtils.registerMessageSent(chatId);
              break;
              
            case '4':
              // Opción 4: Volver al menú principal
              console.log('Usuario eligió opción 4: Volver al menú principal');
              await applyRandomDelay(async () => {
                await flowDynamic(antibanUtils.sanitizeMessage(
                  "🔄 Volviendo al menú principal...\n\nPor favor, escribe *hola* para ver el menú principal."
                ));
              });
              await antibanUtils.registerMessageSent(chatId);
              break;
              
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
          console.error('Error en el flujo de empresas (paso 2):', error);
          return fallBack();
        }
      }
    );
};

module.exports = createEmpresasFlow;