// utils/dataStorage.js
const fs = require('fs').promises;
const path = require('path');

// Ruta al archivo de datos
const DATA_FILE = path.join(__dirname, '../data/empresas.json');

// Asegurar que el directorio data existe
async function ensureDirectoryExists() {
  const dir = path.dirname(DATA_FILE);
  try {
    await fs.access(dir);
  } catch (error) {
    // Si el directorio no existe, crearlo
    await fs.mkdir(dir, { recursive: true });
  }
}

// Cargar datos existentes
async function loadData() {
  try {
    await ensureDirectoryExists();
    
    try {
      const data = await fs.readFile(DATA_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      // Si el archivo no existe o hay un error al leerlo, devolver un objeto vacío
      return {};
    }
  } catch (error) {
    console.error('Error al cargar datos:', error);
    return {};
  }
}

// Guardar datos
async function saveData(data) {
  try {
    await ensureDirectoryExists();
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error al guardar datos:', error);
    throw error;
  }
}

/**
 * Guarda la información de una empresa asociada a un chatId
 * @param {string} chatId - ID del chat de WhatsApp
 * @param {string} informacion - Información proporcionada por el usuario
 */
async function guardarInformacionEmpresa(chatId, informacion) {
  try {
    // Cargar datos existentes
    const data = await loadData();
    
    // Crear un objeto con la información estructurada (versión simplificada)
    const empresaInfo = {
      chatId: chatId,
      fechaRegistro: new Date().toISOString(),
      informacion: informacion, // Todo el mensaje completo sin procesamiento
      estado: 'pendiente', // pendiente, contactado, finalizado, etc.
    };
    
    // Guardar en la estructura de datos
    if (!data.empresas) {
      data.empresas = {};
    }
    
    // Usar chatId como clave y guardar un array de interacciones
    // (permite múltiples solicitudes del mismo usuario)
    if (!data.empresas[chatId]) {
      data.empresas[chatId] = [];
    }
    
    data.empresas[chatId].push(empresaInfo);
    
    // Guardar datos actualizados
    await saveData(data);
    
    console.log(`Información de empresa guardada para chatId: ${chatId}`);
    return true;
  } catch (error) {
    console.error('Error al guardar información de empresa:', error);
    throw error;
  }
}

module.exports = {
  guardarInformacionEmpresa,
  loadData // Exportamos también esta función por si necesitas acceder a los datos en otro lugar
};