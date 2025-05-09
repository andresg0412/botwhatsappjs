/**
 * Respuestas generales para diferentes situaciones
 */

// Respuestas para cuando no se entiende el mensaje
const unknownResponses = [
    "Lo siento, no entendí tu mensaje. ¿Podrías reformularlo?",
    "Disculpa, no estoy seguro de lo que necesitas. ¿Podrías ser más específico?",
    "No logro entender tu consulta. ¿Podrías explicarme de otra manera?",
    "Hmm, no estoy seguro de cómo ayudarte con eso. ¿Podrías darme más detalles?",
    "No comprendo completamente tu mensaje. ¿Podrías intentar de nuevo con otras palabras?"
  ];
  
  // Respuestas para el menú principal
  const menuResponses = [
    "Estos son nuestros servicios disponibles:\n\n1️⃣ Consultar el clima\n2️⃣ Ver noticias recientes\n3️⃣ Información de contacto\n4️⃣ Preguntas frecuentes\n\nResponde con el número o nombre del servicio que te interesa.",
    "Puedo ayudarte con lo siguiente:\n\n1️⃣ Clima actual y pronóstico\n2️⃣ Noticias del día\n3️⃣ Datos de contacto\n4️⃣ FAQ\n\n¿Qué te gustaría consultar?",
    "Estos son los servicios que ofrezco:\n\n1️⃣ Información meteorológica\n2️⃣ Noticias destacadas\n3️⃣ Contacto\n4️⃣ Preguntas frecuentes\n\nIndícame qué opción prefieres."
  ];
  
  // Respuestas para ayuda
  const helpResponses = [
    "Estoy aquí para ayudarte. Puedes preguntarme sobre:\n\n• El clima en tu ciudad\n• Noticias recientes\n• Información de contacto\n• O simplemente escribe 'menú' para ver todas las opciones.",
    "¿Cómo puedo ayudarte hoy? Puedes:\n\n• Consultar el clima escribiendo 'clima en [tu ciudad]'\n• Ver las noticias más recientes con 'noticias'\n• Obtener información de contacto\n• Escribir 'menú' para ver todas las opciones disponibles.",
    "Puedo asistirte de varias formas. Intenta:\n\n• 'Clima [ciudad]' para el pronóstico\n• 'Noticias' para las últimas novedades\n• 'Contacto' para información de contacto\n• 'Menú' para ver todas las opciones"
  ];
  
  // Respuestas para cuando el servicio no está disponible
  const serviceUnavailableResponses = [
    "Lo siento, este servicio no está disponible en este momento. Por favor, intenta más tarde.",
    "Disculpa las molestias, pero no puedo procesar esta solicitud ahora. Inténtalo de nuevo más tarde.",
    "Este servicio se encuentra temporalmente fuera de servicio. Por favor, intenta con otra opción o más tarde."
  ];
  
  // Respuestas para confirmaciones
  const confirmationResponses = [
    "¡Perfecto! Tu solicitud ha sido procesada correctamente.",
    "¡Listo! He completado tu solicitud con éxito.",
    "¡Excelente! Tu petición ha sido atendida correctamente."
  ];
  
  module.exports = {
    unknownResponses,
    menuResponses,
    helpResponses,
    serviceUnavailableResponses,
    confirmationResponses
  };