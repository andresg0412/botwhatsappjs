/**
 * Respuestas para preguntas frecuentes
 */

const faqs = {
    // Preguntas sobre el bot
    "¿Qué puedes hacer?": [
      "Puedo ayudarte con información sobre el clima, noticias recientes, responder preguntas frecuentes y más. Escribe 'menú' para ver todas las opciones.",
      "Estoy aquí para asistirte con consultas sobre clima, noticias y responder a tus preguntas. Escribe 'ayuda' para más detalles.",
      "Puedo brindarte información útil sobre el clima, noticias actuales y responder a tus dudas más comunes. Escribe 'menú' para explorar todas las opciones."
    ],
    
    "¿Cuál es tu horario de atención?": [
      "Estoy disponible de lunes a viernes, de 8:00 AM a 8:00 PM. Fuera de este horario, registraré tu mensaje y te responderemos en cuanto estemos de vuelta.",
      "Mi horario de servicio es de 8 AM a 8 PM, de lunes a viernes. Si me escribes fuera de este horario, te responderé al inicio del siguiente día hábil.",
      "Atiendo consultas de lunes a viernes entre 8:00 AM y 8:00 PM. Los mensajes recibidos fuera de este horario serán respondidos durante las horas de servicio."
    ],
    
    // Preguntas sobre servicios
    "¿Cómo consulto el clima?": [
      "Para consultar el clima, simplemente escribe 'clima' seguido del nombre de tu ciudad. Por ejemplo: 'clima Ciudad de México'.",
      "Puedes conocer el pronóstico del tiempo escribiendo 'clima' y el nombre de la ciudad que te interesa, como 'clima Guadalajara'.",
      "Para saber el clima actual, envía un mensaje con la palabra 'clima' y la ciudad que deseas consultar. Ejemplo: 'clima Monterrey'."
    ],
    
    "¿Cómo veo las noticias?": [
      "Para ver las noticias más recientes, solo escribe 'noticias'. También puedes especificar una categoría, como 'noticias deportes'.",
      "Consulta las últimas noticias escribiendo 'noticias'. Si buscas algo específico, puedes añadir una categoría: 'noticias tecnología'.",
      "Para acceder a las noticias del día, envía 'noticias'. Si te interesa un tema particular, especifícalo: 'noticias economía'."
    ],
    
    // Preguntas sobre contacto
    "¿Cómo puedo contactarlos?": [
      "Puedes contactarnos por este mismo chat durante nuestro horario de atención, o enviando un correo a contacto@ejemplo.com.",
      "Estamos disponibles en este chat de lunes a viernes (8 AM - 8 PM) o por correo electrónico: contacto@ejemplo.com.",
      "Contáctanos a través de este chat en horario laboral o escríbenos a contacto@ejemplo.com para atención por correo."
    ]
  };
  
  /**
   * Busca respuestas para una pregunta frecuente
   * @param {string} question - Pregunta del usuario
   * @returns {Array|null} Array de posibles respuestas o null si no se encuentra
   */
  const findFaqResponse = (question) => {
    const normalizedQuestion = question.toLowerCase().trim();
    
    // Buscar coincidencia exacta
    for (const [key, responses] of Object.entries(faqs)) {
      if (key.toLowerCase() === normalizedQuestion) {
        return responses;
      }
    }
    
    // Buscar coincidencia parcial
    for (const [key, responses] of Object.entries(faqs)) {
      if (normalizedQuestion.includes(key.toLowerCase()) || 
          key.toLowerCase().includes(normalizedQuestion)) {
        return responses;
      }
    }
    
    // Buscar palabras clave
    const keywords = {
      "horario": faqs["¿Cuál es tu horario de atención?"],
      "hacer": faqs["¿Qué puedes hacer?"],
      "funciones": faqs["¿Qué puedes hacer?"],
      "clima": faqs["¿Cómo consulto el clima?"],
      "noticias": faqs["¿Cómo veo las noticias?"],
      "contacto": faqs["¿Cómo puedo contactarlos?"],
      "contactar": faqs["¿Cómo puedo contactarlos?"],
      "email": faqs["¿Cómo puedo contactarlos?"],
      "correo": faqs["¿Cómo puedo contactarlos?"]
    };
    
    for (const [keyword, responses] of Object.entries(keywords)) {
      if (normalizedQuestion.includes(keyword)) {
        return responses;
      }
    }
    
    return null;
  };
  
  module.exports = {
    faqs,
    findFaqResponse
  };