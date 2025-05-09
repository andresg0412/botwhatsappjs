/**
 * Respuestas para saludos y despedidas
 */

// Saludos variados
const greetings = [
    "¡Hola {name}! Soy Conny, creadora de Solteros y Parceros 💘\nGracias por escribirnos 🙌\n\n📲 A través de nuestros canales en Instagram y TikTok conectamos a solteros y solteras de todo el mundo 🌍 y también ofrecemos espacios para que marcas se den a conocer",
    "¡Hola {name}! Soy Conny, la mente detrás de Solteros y Parceros 💘\n¡Gracias por pasarte por aquí! 🙌\n📱 En Instagram y TikTok unimos solteros de todas partes del mundo 🌍\nAdemás, creamos espacios donde las marcas pueden brillar ✨",
    "¡Hola {name}! Soy Conny, fundadora de Solteros y Parceros 💘\n¡Qué bueno tenerte por acá! 🙌\nEn nuestras redes como Instagram y TikTok conectamos corazones solteros 🌍\nY también ayudamos a marcas a mostrarse en grande 🚀",
    "¡Hola {name}! Soy Conny, quien está detrás de Solteros y Parceros 💘\nGracias por escribirnos 🙌\nEn Instagram y TikTok reunimos solteros y solteras del mundo 🌍\nY también damos visibilidad a marcas que quieren llegar más lejos 💥",
    "¡Hey {name}! Soy Conny, la creadora de Solteros y Parceros 💘\n¡Gracias por contactarnos! 🙌\nConectamos a solteros por el mundo vía Instagram y TikTok 🌍\nY además, ofrecemos espacios para que las marcas se luzcan ✨",
    "¡Hola {name}! Aquí Conny, creadora de Solteros y Parceros 💘\nGracias por escribirnos 🙌\nUsamos Instagram y TikTok para unir solteros de todo el mundo 🌍\nY también apoyamos a marcas que quieren destacar 🚀"
  ];
  
  // Saludos según la hora del día
  const morningGreetings = [
    "¡Buenos días, {name}! 🌞 Soy Conny, creadora de Solteros y Parceros 💘\nGracias por tu mensaje 🙏\n📲 En Instagram y TikTok conectamos a solteros y solteras de todo el mundo 🌎\nY también ayudamos a que marcas se den a conocer con más fuerza 💼✨",
    "¡Buenos días, {name}! 🌅 Soy Conny, fundadora de Solteros y Parceros 💘\nGracias por empezar tu día con nosotros 🙌\nEn nuestras redes como Instagram y TikTok conectamos a corazones libres 🌍\nY también ofrecemos espacios para que las marcas se hagan notar 🎯",
    "¡Muy buenos días, {name}! 🌅 Soy Conny, fundadora de Solteros y Parceros 💘\nGracias por saludarnos 🙋‍♀️\n📱 En nuestras redes como Instagram y TikTok conectamos corazones solteros por todo el mundo 🌐\nY también damos visibilidad a marcas que quieren destacar 🚀📢"
  ];
  
  const afternoonGreetings = [
    "¡Buenas tardes {name}! Soy Conny, creadora de Solteros y Parceros 💘\nGracias por escribirnos esta tarde 🙌\n📲 En Instagram y TikTok conectamos solteros y solteras de todo el mundo 🌍\nY también creamos espacios geniales para que las marcas se den a conocer 🎯",
    "¡Hola {name}! 😄 Soy Conny de Solteros y Parceros 💘\nGracias por tu mensajito 📨\n📱 En nuestras redes unimos solteros de todas partes 🌍\nY también ayudamos a marcas a tener más visibilidad 🔎✨",
    "¡Buenas tardes! 😊 Soy Conny, la mente detrás de Solteros y Parceros 💘\nQué bueno leerte esta tarde ☕\n📲 En Instagram y TikTok conectamos a solteros y solteras del mundo 🌍\nY ofrecemos espacios ideales para que las marcas se destaquen 💡"
  ];
  
  const eveningGreetings = [
    "¡Buenas noches {name}! 🌙 Soy Conny, la creadora de Solteros y Parceros 💘\nGracias por escribirnos antes de terminar el día ✨\n📲 En Instagram y TikTok ayudamos a conectar solteros de todo el mundo 🌍\nY también damos visibilidad a marcas con actitud 🔥",
    "¡Hola {name}! Espero que hayas tenido un buen día. 🌜 Soy Conny, fundadora de Solteros y Parceros 💘\nGracias por escribirnos esta noche 💬\n📱 Unimos corazones solteros en nuestras redes y apoyamos a marcas que quieren destacarse 🌍💼",
    "¡Buenas noches! 🌌 Soy Conny, quien está detrás de Solteros y Parceros 💘\nQué bueno recibir tu mensaje esta noche 💖\n📲 En Instagram y TikTok conectamos solteros por el mundo 🌍\nY también ofrecemos espacios donde las marcas pueden brillar ⭐"
  ];
  
  // Despedidas
  const farewells = [
    "¡Hasta pronto {name}! Ha sido un placer ayudarte.",
    "¡Adiós {name}! No dudes en contactarnos si necesitas algo más.",
    "¡Que tengas un excelente día {name}! Estamos aquí para cuando nos necesites.",
    "¡Hasta luego {name}! Gracias por contactarnos.",
    "¡Adiós! Recuerda que estamos disponibles en nuestro horario habitual si necesitas más ayuda."
  ];
  
  // Agradecimientos
  const thanks = [
    "¡De nada {name}! Estoy aquí para ayudarte.",
    "Es un placer poder asistirte {name}.",
    "No hay de qué {name}. ¿Necesitas algo más?",
    "Para eso estamos {name}. ¿Hay algo más en lo que pueda ayudarte?",
    "¡Encantado de ayudar {name}! Si tienes más preguntas, no dudes en contactarnos."
  ];
  
  /**
   * Obtiene un saludo apropiado según la hora del día
   * @returns {Array} Array de saludos apropiados
   */
  const getTimeBasedGreetings = () => {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
      return morningGreetings;
    } else if (hour >= 12 && hour < 19) {
      return afternoonGreetings;
    } else {
      return eveningGreetings;
    }
  };
  
  module.exports = {
    greetings,
    morningGreetings,
    afternoonGreetings,
    eveningGreetings,
    farewells,
    thanks,
    getTimeBasedGreetings,
  };