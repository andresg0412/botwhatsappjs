/**
 * Configuración del Bot de WhatsApp
 */

// Horario de funcionamiento (24h)
const WORKING_HOURS = {
    start: 8, // 8:00 AM
    end: 23,  // 8:00 PM
    timezone: 'America/Mexico_City', // Ajusta a tu zona horaria
    workDays: [1, 2, 3, 4, 5, 6], // Lunes a Viernes (0 = Domingo, 6 = Sábado)
  };
  
  // Configuración de delays para respuestas
  const DELAY_CONFIG = {
    min: 2000,    // Delay mínimo (2 segundos)
    max: 10000,   // Delay máximo (10 segundos)
    typing: true, // Mostrar "escribiendo..."
  };
  
  // Configuración anti-ban
  const ANTI_BAN_CONFIG = {
    maxMessagesPerHour: 50,      // Máximo de mensajes por hora
    maxMessagesPerDay: 300,      // Máximo de mensajes por día
    messageInterval: 2000,      // Intervalo mínimo entre mensajes (10 segundos)
    avoidSuspiciousPatterns: true, // Evitar patrones sospechosos
    randomizeResponses: true,    // Aleatorizar respuestas
  };
  
  // Mensajes fuera de horario
  const OUT_OF_HOURS_MESSAGE = [
    "Hola! Nuestro horario de atención es de 8am a 8pm de lunes a viernes. Te responderemos tan pronto como estemos disponibles.",
    "Gracias por tu mensaje. En este momento estamos fuera de horario. Nuestro equipo te atenderá durante nuestro horario laboral: lunes a viernes de 8am a 8pm.",
    "Hemos recibido tu mensaje. Te responderemos durante nuestro horario de atención (L-V 8am-8pm). ¡Gracias por tu paciencia!"
  ];
  
  module.exports = {
    WORKING_HOURS,
    DELAY_CONFIG,
    ANTI_BAN_CONFIG,
    OUT_OF_HOURS_MESSAGE
  };