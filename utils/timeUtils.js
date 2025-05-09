/**
 * Utilidades para manejar tiempo y horarios
 */
const { WORKING_HOURS, OUT_OF_HOURS_MESSAGE } = require('../config');

/**
 * Verifica si el bot debe estar activo en este momento
 * @returns {boolean} true si está dentro del horario de trabajo
 */
const isWorkingHours = () => {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
  
  // Verificar si es un día laboral
  if (!WORKING_HOURS.workDays.includes(day)) {
    return false;
  }
  
  // Verificar si está dentro del horario laboral
  return hour >= WORKING_HOURS.start && hour < WORKING_HOURS.end;
};

/**
 * Obtiene un mensaje aleatorio para responder fuera del horario laboral
 * @returns {string} Mensaje fuera de horario
 */
const getOutOfHoursMessage = () => {
  const index = Math.floor(Math.random() * OUT_OF_HOURS_MESSAGE.length);
  return OUT_OF_HOURS_MESSAGE[index];
};

/**
 * Obtiene el tiempo restante hasta el próximo horario laboral
 * @returns {Object} Objeto con horas y minutos restantes
 */
const getTimeUntilNextWorkingHour = () => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentDay = now.getDay();
  
  // Si estamos fuera del horario pero en un día laboral
  if (WORKING_HOURS.workDays.includes(currentDay) && currentHour < WORKING_HOURS.start) {
    const hoursRemaining = WORKING_HOURS.start - currentHour;
    return { hours: hoursRemaining, minutes: 60 - now.getMinutes() };
  }
  
  // Calcular el próximo día laboral
  let nextWorkDay = currentDay;
  let daysToAdd = 0;
  
  do {
    nextWorkDay = (nextWorkDay + 1) % 7;
    daysToAdd++;
  } while (!WORKING_HOURS.workDays.includes(nextWorkDay));
  
  // Si es el mismo día pero después del horario laboral
  if (daysToAdd === 7) {
    const hoursRemaining = 24 - currentHour + WORKING_HOURS.start;
    return { hours: hoursRemaining, minutes: 60 - now.getMinutes() };
  }
  
  // Si es otro día
  const hoursRemaining = 24 - currentHour + WORKING_HOURS.start + (daysToAdd - 1) * 24;
  return { hours: hoursRemaining, minutes: 60 - now.getMinutes() };
};

module.exports = {
  isWorkingHours,
  getOutOfHoursMessage,
  getTimeUntilNextWorkingHour
};