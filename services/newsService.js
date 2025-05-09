/**
 * Servicio para obtener noticias recientes
 * Nota: Este es un servicio simulado. En un entorno real, se conectaría a una API de noticias.
 */

/**
 * Obtiene las noticias más recientes, opcionalmente filtradas por categoría
 * @param {string|null} category - Categoría de noticias (opcional)
 * @returns {Promise<string>} Noticias formateadas
 */
const getLatestNews = async (category = null) => {
    // Simulación de delay de API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Noticias simuladas por categoría
    const newsData = {
      'general': [
        {
          title: 'Nuevas medidas económicas anunciadas por el gobierno',
          summary: 'El gobierno ha anunciado un paquete de medidas para impulsar la economía en los próximos meses.'
        },
        {
          title: 'Descubren nueva especie en la selva amazónica',
          summary: 'Científicos han descubierto una nueva especie de rana que podría ayudar en tratamientos médicos.'
        },
        {
          title: 'Récord de asistencia en festival cultural',
          summary: 'El festival cultural de la ciudad ha registrado un récord de asistencia con más de 50,000 visitantes.'
        }
      ],
      'deportes': [
        {
          title: 'Equipo local clasifica a la final del torneo',
          summary: 'Después de una emocionante semifinal, el equipo local ha asegurado su lugar en la final del torneo.'
        },
        {
          title: 'Nuevo récord mundial en maratón',
          summary: 'El atleta keniano ha establecido un nuevo récord mundial en el maratón de la ciudad.'
        },
        {
          title: 'Anuncian sede del próximo mundial',
          summary: 'La federación internacional ha anunciado la sede del próximo campeonato mundial.'
        }
      ],
      'tecnología': [
        {
          title: 'Nueva versión de sistema operativo popular',
          summary: 'La empresa ha lanzado la nueva versión de su sistema operativo con mejoras significativas en seguridad.'
        },
        {
          title: 'Avances en inteligencia artificial',
          summary: 'Investigadores han logrado un avance importante en el campo de la inteligencia artificial.'
        },
        {
          title: 'Nuevo smartphone revoluciona el mercado',
          summary: 'El último smartphone lanzado al mercado incluye características nunca antes vistas.'
        }
      ],
      'salud': [
        {
          title: 'Descubren tratamiento prometedor para enfermedad común',
          summary: 'Científicos han descubierto un tratamiento que podría cambiar la forma en que se trata esta enfermedad.'
        },
        {
          title: 'Recomendaciones para prevenir enfermedades estacionales',
          summary: 'Expertos comparten recomendaciones para mantenerse saludable durante la temporada.'
        },
        {
          title: 'Nuevos hallazgos sobre beneficios de la dieta mediterránea',
          summary: 'Un estudio confirma los beneficios de la dieta mediterránea para la salud cardiovascular.'
        }
      ]
    };
    
    // Normalizar la categoría si se proporciona
    let normalizedCategory = 'general';
    if (category) {
      const lowerCategory = category.toLowerCase().trim();
      if (lowerCategory.includes('deport')) normalizedCategory = 'deportes';
      else if (lowerCategory.includes('tecno') || lowerCategory.includes('tech')) normalizedCategory = 'tecnología';
      else if (lowerCategory.includes('salud') || lowerCategory.includes('health')) normalizedCategory = 'salud';
    }
    
    // Verificar si tenemos noticias para la categoría solicitada
    if (newsData[normalizedCategory]) {
      const news = newsData[normalizedCategory];
      
      // Formatear la respuesta
      let response = `📰 *Noticias recientes de ${normalizedCategory}*\n\n`;
      
      news.forEach((item, index) => {
        response += `*${index + 1}. ${item.title}*\n`;
        response += `${item.summary}\n\n`;
      });
      
      response += `Actualizado hace unos minutos.`;
      return response;
    } else {
      // Si no tenemos la categoría, devolver noticias generales
      return getLatestNews('general');
    }
  };
  
  module.exports = {
    getLatestNews
  };