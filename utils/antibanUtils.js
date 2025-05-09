/**
 * Utilidades anti-ban con persistencia en archivo JSON
 * Implementación independiente del adaptador de base de datos
 * Versión mejorada con mejor manejo de errores y sincronización
 */
const fs = require('fs').promises;
const path = require('path');
const { ANTI_BAN_CONFIG } = require('../config');

// Ruta del archivo de datos (ahora con ruta absoluta más visible)
const DATA_FILE = path.join(process.cwd(), 'data', 'antiban-data.json');

// Caché en memoria
const conversationsCache = {};
let lastCacheFlush = Date.now();
let isInitialized = false;

/**
 * Asegura que el directorio exista
 * @param {string} filePath - Ruta del archivo
 */
const ensureDirectoryExists = async (filePath) => {
  const dirname = path.dirname(filePath);
  try {
    await fs.access(dirname);
  } catch (error) {
    // Si el directorio no existe, crearlo
    await fs.mkdir(dirname, { recursive: true });
    console.log(`Directorio creado: ${dirname}`);
  }
};

/**
 * Inicializa el módulo anti-ban
 */
const init = async () => {
  if (isInitialized) return;
  
  try {
    console.log(`Inicializando antibanUtils con archivo: ${DATA_FILE}`);
    
    // Asegurar que el directorio exista
    await ensureDirectoryExists(DATA_FILE);
    
    // Intentar cargar datos existentes
    await loadDataFromFile();
    
    // Configurar limpieza periódica de conversaciones inactivas
    setInterval(() => cleanupInactiveConversations(), 3600000); // Cada hora
    
    // Configurar sincronización periódica de caché con el archivo (ahora cada minuto)
    setInterval(() => flushCache(), 60000); // Cada minuto
    
    // Configurar reseteo de contadores
    setupCounterResets();
    
    isInitialized = true;
    console.log('AntibanUtils inicializado correctamente');
    
    // Forzar una sincronización inmediata para verificar que todo funciona
    await flushCache(true);
  } catch (error) {
    console.error('Error al inicializar antibanUtils:', error);
    // Continuar de todos modos, usando solo la caché en memoria
    isInitialized = true;
  }
};

/**
 * Carga los datos desde el archivo
 */
const loadDataFromFile = async () => {
  try {
    // Verificar si el archivo existe
    try {
      await fs.access(DATA_FILE);
      console.log(`Archivo de datos encontrado: ${DATA_FILE}`);
    } catch (error) {
      // Si no existe, crear un archivo vacío
      console.log(`Archivo de datos no encontrado. Creando nuevo archivo: ${DATA_FILE}`);
      await fs.writeFile(DATA_FILE, JSON.stringify({}));
      return; // No hay datos que cargar
    }
    
    // Leer el archivo
    const data = await fs.readFile(DATA_FILE, 'utf8');
    
    if (!data || data.trim() === '') {
      console.log('Archivo de datos vacío. Inicializando con objeto vacío.');
      await fs.writeFile(DATA_FILE, JSON.stringify({}));
      return;
    }
    
    try {
      const parsedData = JSON.parse(data);
      
      // Cargar datos en la caché
      Object.keys(parsedData).forEach(chatId => {
        conversationsCache[chatId] = {
          messageCountHour: parsedData[chatId].messageCountHour || 0,
          messageCountDay: parsedData[chatId].messageCountDay || 0,
          lastMessageTime: parsedData[chatId].lastMessageTime || 0,
          lastUpdated: parsedData[chatId].lastUpdated || Date.now(),
          modified: false
        };
      });
      
      console.log(`Datos cargados desde ${DATA_FILE}: ${Object.keys(conversationsCache).length} conversaciones`);
    } catch (parseError) {
      console.error('Error al parsear el archivo de datos:', parseError);
      // Hacer backup del archivo corrupto
      const backupFile = `${DATA_FILE}.backup.${Date.now()}`;
      await fs.copyFile(DATA_FILE, backupFile);
      console.log(`Se ha creado una copia de seguridad del archivo corrupto: ${backupFile}`);
      
      // Crear un nuevo archivo vacío
      await fs.writeFile(DATA_FILE, JSON.stringify({}));
      console.log('Se ha creado un nuevo archivo de datos vacío');
    }
  } catch (error) {
    console.error('Error al cargar datos desde archivo:', error);
    // Si hay un error, continuar con la caché vacía
  }
};

/**
 * Guarda los datos en el archivo
 * @param {boolean} force - Forzar guardado incluso si no hay modificaciones
 */
const saveDataToFile = async (force = false) => {
  try {
    // Preparar datos para guardar
    const dataToSave = {};
    let modifiedCount = 0;
    
    Object.keys(conversationsCache).forEach(chatId => {
      const data = conversationsCache[chatId];
      
      // Solo incluir si está modificado o se fuerza el guardado
      if (data.modified || force) {
        dataToSave[chatId] = {
          messageCountHour: data.messageCountHour,
          messageCountDay: data.messageCountDay,
          lastMessageTime: data.lastMessageTime,
          lastUpdated: Date.now()
        };
        
        // Marcar como no modificado después de guardar
        data.modified = false;
        modifiedCount++;
      }
    });
    
    // Solo guardar si hay datos modificados o se fuerza el guardado
    if (modifiedCount > 0 || force) {
      // Asegurar que el directorio exista
      await ensureDirectoryExists(DATA_FILE);
      
      // Si se fuerza el guardado, incluir todas las conversaciones
      if (force) {
        Object.keys(conversationsCache).forEach(chatId => {
          const data = conversationsCache[chatId];
          dataToSave[chatId] = {
            messageCountHour: data.messageCountHour,
            messageCountDay: data.messageCountDay,
            lastMessageTime: data.lastMessageTime,
            lastUpdated: Date.now()
          };
        });
      }
      
      // Guardar en el archivo
      await fs.writeFile(DATA_FILE, JSON.stringify(dataToSave, null, 2));
      console.log(`Datos guardados en ${DATA_FILE}: ${Object.keys(dataToSave).length} conversaciones`);
      
      // Verificar que el archivo se haya guardado correctamente
      try {
        await fs.access(DATA_FILE);
        const stats = await fs.stat(DATA_FILE);
        console.log(`Archivo guardado correctamente. Tamaño: ${stats.size} bytes`);
      } catch (error) {
        console.error('Error al verificar el archivo guardado:', error);
      }
    } else {
      console.log('No hay datos modificados para guardar');
    }
  } catch (error) {
    console.error('Error al guardar datos en archivo:', error);
  }
};

/**
 * Sincroniza la caché en memoria con el archivo
 * @param {boolean} force - Forzar sincronización incluso si no es necesario
 */
const flushCache = async (force = false) => {
  try {
    const now = Date.now();
    const cacheAge = now - lastCacheFlush;
    
    // Solo sincronizar si han pasado al menos 1 minuto, hay entradas modificadas, o se fuerza
    const modifiedEntries = Object.keys(conversationsCache).filter(chatId => 
      conversationsCache[chatId].modified
    );
    
    if (!force && cacheAge < 60000 && modifiedEntries.length === 0) {
      return;
    }
    
    console.log('Sincronizando caché anti-ban con archivo...');
    
    // Guardar en el archivo
    await saveDataToFile(force);
    
    lastCacheFlush = now;
    console.log(`Caché anti-ban sincronizada. ${modifiedEntries.length} conversaciones actualizadas.`);
  } catch (error) {
    console.error('Error al sincronizar caché anti-ban:', error);
  }
};

/**
 * Obtiene los datos de una conversación
 * @param {string} chatId - ID del chat
 * @returns {Object} Datos de la conversación
 */
const getConversationData = async (chatId) => {
  // Asegurarse de que el módulo esté inicializado
  if (!isInitialized) {
    await init();
  }
  
  // Verificar si ya está en caché
  if (conversationsCache[chatId]) {
    return conversationsCache[chatId];
  }
  
  // Inicializar nueva conversación
  conversationsCache[chatId] = {
    messageCountHour: 0,
    messageCountDay: 0,
    lastMessageTime: 0,
    lastUpdated: Date.now(),
    modified: true
  };
  
  console.log(`Nueva conversación inicializada para ${chatId}`);
  
  // Forzar sincronización para guardar la nueva conversación
  await flushCache(true);
  
  return conversationsCache[chatId];
};

/**
 * Limpia las conversaciones inactivas
 */
const cleanupInactiveConversations = async () => {
  try {
    console.log('Limpiando conversaciones inactivas...');
    const now = Date.now();
    const maxInactiveTime = 86400000; // 24 horas
    
    // Contar conversaciones antes de limpiar
    const beforeCount = Object.keys(conversationsCache).length;
    
    // Limpiar caché
    Object.keys(conversationsCache).forEach(chatId => {
      const data = conversationsCache[chatId];
      if (now - data.lastMessageTime > maxInactiveTime) {
        delete conversationsCache[chatId];
      }
    });
    
    // Contar conversaciones después de limpiar
    const afterCount = Object.keys(conversationsCache).length;
    const removedCount = beforeCount - afterCount;
    
    if (removedCount > 0) {
      // Guardar cambios en el archivo
      await saveDataToFile(true);
      console.log(`Limpieza completada: ${removedCount} conversaciones inactivas eliminadas`);
    } else {
      console.log('Limpieza completada: No se encontraron conversaciones inactivas');
    }
  } catch (error) {
    console.error('Error al limpiar conversaciones inactivas:', error);
  }
};

/**
 * Verifica si es seguro enviar un mensaje a un chat específico
 * @param {string} chatId - ID del chat
 * @returns {Promise<boolean>} true si es seguro enviar un mensaje
 */
const isSafeToSendMessage = async (chatId) => {
  try {
    const now = Date.now();
    const conversationData = await getConversationData(chatId);
    
    // Verificar límites de mensajes para esta conversación
    if (conversationData.messageCountHour >= ANTI_BAN_CONFIG.maxMessagesPerHour) {
      console.log(`Límite de mensajes por hora alcanzado para el chat ${chatId}`);
      return false;
    }
    
    if (conversationData.messageCountDay >= ANTI_BAN_CONFIG.maxMessagesPerDay) {
      console.log(`Límite de mensajes por día alcanzado para el chat ${chatId}`);
      return false;
    }
    
    // Verificar intervalo entre mensajes para esta conversación
    if (now - conversationData.lastMessageTime < ANTI_BAN_CONFIG.messageInterval) {
      console.log(`Intervalo entre mensajes demasiado corto para el chat ${chatId}`);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Error al verificar si es seguro enviar mensaje a ${chatId}:`, error);
    // En caso de error, permitir el envío para no bloquear la funcionalidad
    return true;
  }
};

/**
 * Registra un mensaje enviado para el monitoreo anti-ban
 * @param {string} chatId - ID del chat
 */
const registerMessageSent = async (chatId) => {
  try {
    const conversationData = await getConversationData(chatId);
    
    // Actualizar contadores para esta conversación
    conversationData.messageCountHour++;
    conversationData.messageCountDay++;
    conversationData.lastMessageTime = Date.now();
    conversationData.modified = true;
    
    console.log(`Mensaje enviado a ${chatId}. Mensajes: ${conversationData.messageCountHour}/h, ${conversationData.messageCountDay}/día`);
    
    // Forzar sincronización después de cada mensaje para asegurar que se guarden los datos
    // Esto puede afectar el rendimiento, pero garantiza que los datos se guarden
    await flushCache(true);
  } catch (error) {
    console.error(`Error al registrar mensaje enviado a ${chatId}:`, error);
  }
};

/**
 * Resetea los contadores de mensajes por hora para todas las conversaciones
 */
const resetHourCounters = async () => {
  try {
    // Resetear en caché
    Object.keys(conversationsCache).forEach(chatId => {
      conversationsCache[chatId].messageCountHour = 0;
      conversationsCache[chatId].modified = true;
    });
    
    // Sincronizar con el archivo
    await flushCache(true);
    
    console.log('Contadores de mensajes por hora reseteados');
  } catch (error) {
    console.error('Error al resetear contadores por hora:', error);
  }
};

/**
 * Resetea los contadores de mensajes por día para todas las conversaciones
 */
const resetDayCounters = async () => {
  try {
    // Resetear en caché
    Object.keys(conversationsCache).forEach(chatId => {
      conversationsCache[chatId].messageCountDay = 0;
      conversationsCache[chatId].modified = true;
    });
    
    // Sincronizar con el archivo
    await flushCache(true);
    
    console.log('Contadores de mensajes por día reseteados');
  } catch (error) {
    console.error('Error al resetear contadores por día:', error);
  }
};

/**
 * Sanitiza un mensaje para evitar patrones sospechosos
 * @param {string} message - Mensaje a sanitizar
 * @returns {string} Mensaje sanitizado
 */
const sanitizeMessage = (message) => {
  if (!ANTI_BAN_CONFIG.avoidSuspiciousPatterns) {
    return message;
  }
  
  // Evitar caracteres repetidos
  let sanitized = message.replace(/(.)\1{4,}/g, '$1$1$1');
  
  // Evitar muchos emojis juntos
  sanitized = sanitized.replace(/([\u{1F300}-\u{1F6FF}]){5,}/gu, (match) => {
    return match.substring(0, 3);
  });
  
  // Limitar longitud del mensaje
  if (sanitized.length > 1000) {
    sanitized = sanitized.substring(0, 1000) + '...';
  }
  
  return sanitized;
};

/**
 * Obtiene estadísticas de uso para todas las conversaciones
 * @returns {Promise<Object>} Estadísticas de uso
 */
const getUsageStats = async () => {
  try {
    // Asegurarse de que el módulo esté inicializado
    if (!isInitialized) {
      await init();
    }
    
    const stats = {
      activeConversations: Object.keys(conversationsCache).length,
      dataFilePath: DATA_FILE,
      conversationStats: {}
    };
    
    // Recopilar estadísticas de cada conversación
    Object.keys(conversationsCache).forEach(chatId => {
      const data = conversationsCache[chatId];
      
      stats.conversationStats[chatId] = {
        messagesHour: data.messageCountHour || 0,
        messagesDay: data.messageCountDay || 0,
        lastMessageTime: new Date(data.lastMessageTime || 0).toISOString(),
        lastUpdated: new Date(data.lastUpdated || 0).toISOString()
      };
    });
    
    return stats;
  } catch (error) {
    console.error('Error al obtener estadísticas de uso:', error);
    return { error: 'Error al obtener estadísticas' };
  }
};

/**
 * Verifica el estado del archivo de datos
 * @returns {Promise<Object>} Estado del archivo
 */
const checkFileStatus = async () => {
  try {
    // Asegurarse de que el módulo esté inicializado
    if (!isInitialized) {
      await init();
    }
    
    const status = {
      filePath: DATA_FILE,
      exists: false,
      size: 0,
      lastModified: null,
      conversationsInCache: Object.keys(conversationsCache).length,
      conversationsInFile: 0
    };
    
    try {
      // Verificar si el archivo existe
      await fs.access(DATA_FILE);
      status.exists = true;
      
      // Obtener estadísticas del archivo
      const stats = await fs.stat(DATA_FILE);
      status.size = stats.size;
      status.lastModified = new Date(stats.mtime).toISOString();
      
      // Leer el contenido del archivo
      const data = await fs.readFile(DATA_FILE, 'utf8');
      const parsedData = JSON.parse(data);
      status.conversationsInFile = Object.keys(parsedData).length;
    } catch (error) {
      console.error('Error al verificar estado del archivo:', error);
    }
    
    return status;
  } catch (error) {
    console.error('Error al verificar estado del archivo:', error);
    return { error: 'Error al verificar estado del archivo' };
  }
};

// Configurar temporizadores para resetear contadores
const setupCounterResets = () => {
  // Resetear contadores por hora
  const resetHourly = () => {
    resetHourCounters();
    
    // Calcular tiempo hasta la próxima hora exacta
    const now = new Date();
    const nextHour = new Date(now);
    nextHour.setHours(nextHour.getHours() + 1);
    nextHour.setMinutes(0);
    nextHour.setSeconds(0);
    nextHour.setMilliseconds(0);
    
    const timeToNextHour = nextHour - now;
    setTimeout(() => {
      resetHourly();
    }, timeToNextHour);
  };
  
  // Resetear contadores por día
  const resetDaily = () => {
    resetDayCounters();
    
    // Calcular tiempo hasta la medianoche
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0);
    tomorrow.setMinutes(0);
    tomorrow.setSeconds(0);
    tomorrow.setMilliseconds(0);
    
    const timeToMidnight = tomorrow - now;
    setTimeout(() => {
      resetDaily();
    }, timeToMidnight);
  };
  
  // Iniciar temporizadores
  resetHourly();
  resetDaily();
};
const antibanUtils = {
  init,
  isSafeToSendMessage,
  registerMessageSent,
  sanitizeMessage,
  getUsageStats,
  flushCache,
  setupCounterResets,
  checkFileStatus
};

module.exports = antibanUtils;