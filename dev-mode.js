const readline = require('readline');

// Crear una interfaz de línea de comandos
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Importar los flujos reales (con manejo de errores)
let welcomeFlow, empresasFlow;
try {
  console.log('[DEBUG] Intentando importar welcomeFlow...');
  const createWelcomeFlow = require('./flows/welcomeFlow');
  console.log('[DEBUG] createWelcomeFlow importado correctamente');
  
  console.log('[DEBUG] Intentando importar empresasFlow...');
  const createEmpresasFlow = require('./flows/empresasFlow');
  console.log('[DEBUG] createEmpresasFlow importado correctamente');
  
  // Crear instancias de los flujos (sin pasar provider por ahora)
  console.log('[DEBUG] Creando instancias de flujos...');
  welcomeFlow = createWelcomeFlow();
  empresasFlow = createEmpresasFlow();
  console.log('[DEBUG] Instancias de flujos creadas correctamente');
} catch (error) {
  console.error('[ERROR] Error al importar o crear flujos:', error);
  process.exit(1);
}

// Función para simular el envío de un mensaje al flujo
async function simulateMessage(flow, message) {
  console.log(`\n[DEBUG] Simulando mensaje "${message}" al flujo ${flow.name || 'desconocido'}`);
  
  // Crear un contexto simulado
  const ctx = {
    from: '123456789',
    body: message,
    pushName: 'Usuario de Prueba'
  };
  
  // Crear funciones simuladas
  const mockFunctions = {
    flowDynamic: async (response) => {
      console.log('\n[BOT] → ', typeof response === 'object' ? JSON.stringify(response, null, 2) : response);
      return Promise.resolve();
    },
    endFlow: () => {
      console.log('\n[SISTEMA] → Flujo terminado');
      return Promise.resolve();
    },
    gotoFlow: (newFlow) => {
      console.log(`\n[SISTEMA] → Cambiando al flujo: ${newFlow ? (newFlow.name || 'desconocido') : 'null'}`);
      currentFlow = newFlow;
      return Promise.resolve();
    },
    fallBack: () => {
      console.log('\n[SISTEMA] → Ejecutando fallBack');
      return Promise.resolve();
    }
  };
  
  // Verificar si el flujo tiene acciones
  if (!flow.actions || !Array.isArray(flow.actions) || flow.actions.length === 0) {
    console.error('[ERROR] El flujo no tiene acciones definidas o no es un array');
    return;
  }
  
  // Ejecutar la primera acción del flujo
  try {
    console.log('[DEBUG] Ejecutando la primera acción del flujo');
    await flow.actions[0].cb(ctx, mockFunctions);
    console.log('[DEBUG] Primera acción ejecutada correctamente');
  } catch (error) {
    console.error('[ERROR] Error al ejecutar la acción:', error);
  }
}

// Función para inspeccionar la estructura de un objeto
function inspectObject(obj, name = 'objeto') {
  console.log(`\n[DEBUG] Inspeccionando ${name}:`);
  
  if (!obj) {
    console.log(`  ${name} es null o undefined`);
    return;
  }
  
  console.log(`  Tipo: ${typeof obj}`);
  
  if (typeof obj === 'object') {
    console.log(`  Propiedades: ${Object.keys(obj).join(', ')}`);
    
    if (Array.isArray(obj)) {
      console.log(`  Es un array con ${obj.length} elementos`);
    }
    
    // Inspeccionar algunas propiedades específicas
    if (obj.actions) {
      console.log(`  actions: Array con ${obj.actions.length} elementos`);
      
      // Inspeccionar la primera acción
      if (obj.actions.length > 0) {
        const firstAction = obj.actions[0];
        console.log(`  Primera acción: ${typeof firstAction}`);
        console.log(`  Propiedades de la primera acción: ${Object.keys(firstAction).join(', ')}`);
        console.log(`  Tiene callback: ${typeof firstAction.cb === 'function'}`);
      }
    }
    
    if (obj.keywords) {
      console.log(`  keywords: ${JSON.stringify(obj.keywords)}`);
    }
  }
}

// Inspeccionar los flujos
console.log('\n=== INSPECCIÓN DE FLUJOS ===');
inspectObject(welcomeFlow, 'welcomeFlow');
inspectObject(empresasFlow, 'empresasFlow');

// Iniciar el simulador simple
console.log('\n=== SIMULADOR SIMPLE DE BOT DE WHATSAPP ===');
console.log('Este simulador intentará ejecutar directamente las acciones de tus flujos');
console.log('Escribe "exit" o "salir" para terminar');
console.log('Escribe "welcome" para probar el flujo de bienvenida');
console.log('Escribe "empresas" para probar el flujo de empresas');
console.log('Escribe "inspect" seguido del nombre del flujo para inspeccionarlo');

// Función para procesar la entrada del usuario
function processInput(input) {
  if (input.toLowerCase() === 'exit' || input.toLowerCase() === 'salir') {
    console.log('Finalizando simulador...');
    rl.close();
    process.exit(0);
  } else if (input.toLowerCase() === 'welcome') {
    simulateMessage(welcomeFlow, 'hola');
  } else if (input.toLowerCase() === 'empresas') {
    simulateMessage(empresasFlow, 'empresas');
  } else if (input.toLowerCase().startsWith('inspect ')) {
    const flowName = input.substring(8).trim();
    if (flowName === 'welcome') {
      inspectObject(welcomeFlow, 'welcomeFlow');
    } else if (flowName === 'empresas') {
      inspectObject(empresasFlow, 'empresasFlow');
    } else {
      console.log(`Flujo "${flowName}" no reconocido`);
    }
  } else {
    console.log('Comando no reconocido. Prueba con "welcome", "empresas", "inspect [nombre]", o "exit"');
  }
  
  // Continuar esperando comandos
  rl.question('\n> ', processInput);
}

// Iniciar la interacción
rl.question('\n> ', processInput);