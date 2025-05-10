const readline = require('readline');
const colors = require('colors/safe');

// Importar los flujos
const createWelcomeFlow = require('./flows/welcomeFlow');
const createEmpresasFlow = require('./flows/empresasFlow');
const createSolterosAnonimosFlow = require('./flows/solterosAnonimosFlow');
const createHistoriasFlow = require('./flows/historiasFlow');
const createEntrevistasFlow = require('./flows/entrevistasFlow');

// Crear un proveedor simulado
class MockProvider {
  constructor() {
    this.callbacks = {};
    this.sessionId = '123456789';
    this.userName = 'Usuario de Prueba';
  }

  sendMessage(message) {
    console.log(colors.green('\n[BOT] → '), typeof message === 'object' ? JSON.stringify(message, null, 2) : message);
    return Promise.resolve({ id: Date.now().toString() });
  }

  getInstance() {
    return this;
  }

  on(event, callback) {
    this.callbacks[event] = callback;
    return this;
  }
}

// Parchar las funciones de antibanUtils para pruebas
const antibanUtils = require('./utils/antibanUtils');
antibanUtils.isSafeToSendMessage = async () => true;
antibanUtils.registerMessageSent = async () => {};
antibanUtils.sanitizeMessage = (message) => message;

// Parchar las funciones de delay para pruebas
const delayUtils = require('./utils/delay');
delayUtils.applyRandomDelay = async (callback) => {
  console.log(colors.yellow('[SISTEMA] → Simulando delay...'));
  return callback();
};

// Crear una interfaz de línea de comandos
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Crear instancias de los flujos
const mockProvider = new MockProvider();
const welcomeFlow = createWelcomeFlow(mockProvider);
const empresasFlow = createEmpresasFlow(mockProvider);
const solterosAnonimosFlow = createSolterosAnonimosFlow(mockProvider);
const historiasFlow = createHistoriasFlow(mockProvider);
const entrevistasFlow = createEntrevistasFlow(mockProvider);

// Mapeo de flujos
const flows = {
  welcome: welcomeFlow,
  empresas: empresasFlow,
  solteros: solterosAnonimosFlow,
  historias: historiasFlow,
  entrevistas: entrevistasFlow
};

// Estado de la conversación
let currentFlow = null;
let waitingForResponse = false;
let flowStack = [];

// Función para procesar un mensaje
function processMessage(message) {
  console.log(colors.blue('\n[USUARIO] → '), message);
  
  // Crear un contexto simulado
  const ctx = {
    from: mockProvider.sessionId,
    body: message,
    pushName: mockProvider.userName
  };
  
  // Funciones simuladas para los flujos
  const flowFunctions = {
    flowDynamic: async (response) => {
      await mockProvider.sendMessage(response);
      return Promise.resolve();
    },
    fallBack: () => {
      console.log(colors.yellow('[SISTEMA] → Ejecutando fallBack...'));
      waitingForResponse = true;
      return Promise.resolve();
    },
    endFlow: () => {
      console.log(colors.yellow('[SISTEMA] → Finalizando flujo...'));
      currentFlow = null;
      waitingForResponse = false;
      if (flowStack.length > 0) {
        currentFlow = flowStack.pop();
      }
      return Promise.resolve();
    },
    gotoFlow: (flow) => {
      console.log(colors.yellow(`[SISTEMA] → Cambiando al flujo: ${flow ? flow.name || 'desconocido' : 'null'}`));
      if (currentFlow) {
        flowStack.push(currentFlow);
      }
      currentFlow = flow;
      waitingForResponse = false;
      return Promise.resolve();
    }
  };
  
  // Si no hay un flujo activo o estamos esperando una respuesta, buscar un flujo que coincida
  if (!currentFlow || !waitingForResponse) {
    // Verificar si el mensaje coincide con alguna palabra clave del flujo de bienvenida
    if (welcomeFlow.keywords?.some(keyword => message.toLowerCase().includes(keyword.toLowerCase()))) {
      currentFlow = welcomeFlow;
    }
    // Si no hay un flujo activo, usar el flujo de bienvenida por defecto
    else if (!currentFlow) {
      console.log(colors.yellow('[SISTEMA] → No se encontró un flujo específico, usando el flujo de bienvenida.'));
      currentFlow = welcomeFlow;
    }
    
    // Ejecutar la primera acción del flujo
    if (currentFlow && currentFlow.actions && currentFlow.actions.length > 0) {
      const action = currentFlow.actions[0];
      if (action.cb) {
        action.cb(ctx, flowFunctions);
        
        // Si el flujo tiene una respuesta esperada, marcar como esperando respuesta
        if (action.answer) {
          waitingForResponse = true;
        }
      }
    }
  }
  // Si estamos esperando una respuesta, procesar la respuesta con la acción correspondiente
  else if (waitingForResponse && currentFlow) {
    // Buscar la acción que captura respuestas
    const captureAction = currentFlow.actions.find(action => action.capture);
    if (captureAction && captureAction.cb) {
      captureAction.cb(ctx, flowFunctions);
    } else {
      console.log(colors.red('[ERROR] → No se encontró una acción para capturar la respuesta.'));
    }
  }
}

// Función para mostrar el menú de comandos
function showHelp() {
  console.log(colors.cyan('\n=== COMANDOS DISPONIBLES ==='));
  console.log(colors.cyan('help') + ' - Muestra esta ayuda');
  console.log(colors.cyan('exit') + ' - Salir del simulador');
  console.log(colors.cyan('reset') + ' - Reiniciar la conversación');
  console.log(colors.cyan('flow [nombre]') + ' - Cambiar directamente a un flujo específico (welcome, empresas, solteros, historias, entrevistas)');
  console.log(colors.cyan('status') + ' - Mostrar el estado actual de la conversación');
  console.log(colors.cyan('Cualquier otro texto') + ' - Se enviará como mensaje al bot');
}

// Función para procesar comandos
function processCommand(command) {
  const parts = command.trim().split(' ');
  const cmd = parts[0].toLowerCase();
  
  switch (cmd) {
    case 'help':
      showHelp();
      break;
    case 'exit':
      console.log(colors.yellow('Saliendo del simulador...'));
      rl.close();
      process.exit(0);
      break;
    case 'reset':
      console.log(colors.yellow('Reiniciando conversación...'));
      currentFlow = null;
      waitingForResponse = false;
      flowStack = [];
      break;
    case 'flow':
      if (parts.length > 1 && flows[parts[1]]) {
        console.log(colors.yellow(`Cambiando al flujo: ${parts[1]}`));
        currentFlow = flows[parts[1]];
        waitingForResponse = false;
        flowStack = [];
        // Ejecutar la primera acción del flujo
        if (currentFlow && currentFlow.actions && currentFlow.actions.length > 0) {
          const action = currentFlow.actions[0];
          if (action.cb) {
            action.cb({
              from: mockProvider.sessionId,
              body: '',
              pushName: mockProvider.userName
            }, {
              flowDynamic: async (response) => {
                await mockProvider.sendMessage(response);
                return Promise.resolve();
              },
              fallBack: () => Promise.resolve(),
              endFlow: () => Promise.resolve(),
              gotoFlow: () => Promise.resolve()
            });
          }
        }
      } else {
        console.log(colors.red('Flujo no encontrado. Flujos disponibles: welcome, empresas, solteros, historias, entrevistas'));
      }
      break;
    case 'status':
      console.log(colors.cyan('\n=== ESTADO ACTUAL ==='));
      console.log(colors.cyan('Flujo actual: ') + (currentFlow ? currentFlow.name || 'Desconocido' : 'Ninguno'));
      console.log(colors.cyan('Esperando respuesta: ') + (waitingForResponse ? 'Sí' : 'No'));
      console.log(colors.cyan('Pila de flujos: ') + (flowStack.length > 0 ? flowStack.map(f => f.name || 'Desconocido').join(', ') : 'Vacía'));
      break;
    default:
      processMessage(command);
      break;
  }
}

// Iniciar el simulador
console.log(colors.cyan('\n=== SIMULADOR DE BOT DE WHATSAPP ==='));
console.log(colors.cyan('Escribe "help" para ver los comandos disponibles'));
console.log(colors.cyan('Escribe "hola" para iniciar una conversación con el bot'));

// Función para leer la entrada del usuario
function promptUser() {
  rl.question('\n> ', (input) => {
    processCommand(input);
    promptUser();
  });
}

// Iniciar la interacción
promptUser();