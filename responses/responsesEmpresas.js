const { getRandomMessageForFlow } = require('../utils/messageUtils')

//SALUDOS EMPRESA

const saludoEmpresas1 = `📢 ¡Gracias por tu interés en publicitar con Solteros y Parceros!

En el siguiente enlace puedes ver toda la información sobre nuestros servicios de publicidad para marcas y negocios 👇

🔗 https://www.canva.com/design/DAGi8ysn93k/WxddYPVskRBb8BQ6HP8sQg/view
`;

const saludoEmpresas2 = `🎉 ¡Qué emoción que quieras publicitar con Solteros y Parceros!

Aquí tienes el enlace con toda la info sobre cómo podemos hacer crecer tu marca 🚀👇

🔗 https://www.canva.com/design/DAGi8ysn93k/WxddYPVskRBb8BQ6HP8sQg/view
`;

const saludoEmpresas3 = `💥 ¡Gracias por confiar en Solteros y Parceros para tu marca!

Mira aquí todos los detalles de nuestros servicios de publicidad 🤩👇

🔗 https://www.canva.com/design/DAGi8ysn93k/WxddYPVskRBb8BQ6HP8sQg/view
`;

const saludoEmpresas4 = `✨ ¡Nos encanta que quieras sumarte a esta comunidad con tu negocio!

Aquí te comparto el enlace con todo lo que necesitas saber para publicitar con nosotros 📈👇

🔗 https://www.canva.com/design/DAGi8ysn93k/WxddYPVskRBb8BQ6HP8sQg/view
`;

const saludoEmpresas5 = `📣 ¡Tu interés en Solteros y Parceros nos emociona muchísimo!

Descubre aquí todas las formas en que podemos ayudarte a destacar tu marca 💼👇

🔗 https://www.canva.com/design/DAGi8ysn93k/WxddYPVskRBb8BQ6HP8sQg/view
`;

const saludoEmpresas6 = `🚀 ¡Qué buena onda que estés pensando en publicitar con nosotros!

Dale click al enlace y entérate de todo lo que ofrecemos para marcas increíbles como la tuya 🔍👇

🔗 https://www.canva.com/design/DAGi8ysn93k/WxddYPVskRBb8BQ6HP8sQg/view
`;

const saludoEmpresas = [
    saludoEmpresas1,
    saludoEmpresas2,
    saludoEmpresas3,
    saludoEmpresas4,
    saludoEmpresas5,
    saludoEmpresas6,
];

const saludoEmpresasRandom = getRandomMessageForFlow(saludoEmpresas);


//SERVICIOS EMPRESAS

const serviciosEmpresas1 = `💰 Estas son nuestras tarifas actuales:

🎬 Video en TikTok — $500
🎥 Video en Instagram — $450
📲 2 historias — $200
📲 3 historias — $300
🎁 Concurso flash (2 historias) — $250
📦 Combo TikTok + Instagram — $700
`;

const serviciosEmpresas2 = `💸 ¡Aquí tienes nuestras tarifas actualizadas para impulsar tu marca!

🎥 Instagram Reel — $450
🎬 TikTok — $500
📦 Combo TikTok + Instagram — $700
📲 2 historias — $200
📲 3 historias — $300
🎁 Concurso flash (2 historias) — $250
`;

const serviciosEmpresas3 = `🔥 ¡Estas son nuestras tarifas actuales para que tu marca se luzca con Solteros y Parceros!

🎬 Video en TikTok — $500
📦 Combo TikTok + Instagram — $700
🎥 Video en Instagram — $450
📲 Historias (2) — $200
📲 Historias (3) — $300
🎁 Concurso express (2 historias) — $250
`;

const serviciosEmpresas4 = `✨ ¡Estas son nuestras opciones para que brilles con nosotros!

📱 2 historias — $200
📱 3 historias — $300
🎬 TikTok — $500
🎥 Instagram — $450
🎁 Concurso flash (2 historias) — $250
📦 Combo TikTok + Instagram — $700
`;

const serviciosEmpresas5 = `📢 ¡Ya puedes elegir cómo quieres que tu marca aparezca en Solteros y Parceros!

🎬 TikTok — $500
🎥 Instagram — $450
📲 Historias (2) — $200
📲 Historias (3) — $300
🎁 Concurso relámpago — $250
📦 Pack TikTok + Instagram — $700
`;

const serviciosEmpresas6 = `🚀 ¡Estas son nuestras tarifas para llevar tu marca al siguiente nivel!

🎥 Video en Instagram — $450
🎬 Video en TikTok — $500
📲 2 historias — $200
📲 3 historias — $300
🎁 Concurso flash (2 historias) — $250
📦 Combo poderoso TikTok + Instagram — $700
`;


const serviciosEmpresas = [
    serviciosEmpresas1,
    serviciosEmpresas2,
    serviciosEmpresas3,
    serviciosEmpresas4,
    serviciosEmpresas5,
    serviciosEmpresas6,
];

const serviciosEmpresasRandom = getRandomMessageForFlow(serviciosEmpresas);


//PREGUNTA INTERESADO EMPRESA

const preguntaInteresado1 = `Si estás interesado y quieres más información personalizada, por favor responde con el número *1* nuevamente y te atenderé directamente 🤝`;

const preguntaInteresado2 = `¿Te interesa saber más y hablar directo conmigo? 🧐

Responde con el número *1* y te atiendo personalmente 🤗✨`;

const preguntaInteresado3 = `💬 Si te interesa y quieres que hablemos más a fondo, escribe *1*

Estoy lista para darte toda la info que necesites 🙌💖`;

const preguntaInteresado4 = `🙋‍♀️ Si quieres info más detallada y personalizada, ¡aquí estoy!

Solo escribe 1 y hablamos directamente tú y yo 📲💬`;


const preguntaInteresado = [
    preguntaInteresado1,
    preguntaInteresado2,
    preguntaInteresado3,
    preguntaInteresado4,
];

const preguntaInteresadoEmpresasRandom = getRandomMessageForFlow(preguntaInteresado);



//PEDIR INFORMACION EMPRESA
const pedirInfoEmpresa1 = `¡Genial! Gracias por tu interés en promocionar con Solteros y Parceros.

Para continuar con el proceso, por favor envíanos la siguiente información:

📌 Nombre de la empresa o negocio
📍 Ubicación completa (País, ciudad y dirección)
🏢 Tipo de negocio
💡 Idea o enfoque que te gustaría que usemos para tu promoción

Agradecemos nos puedas responder con esta información en un (1) mismo mensaje
`;

const pedirInfoEmpresa2 = `🎉 ¡Perfecto! Gracias por tu interés en promocionar con Solteros y Parceros.

Para seguir adelante, por favor compártenos esta info en *un solo mensaje*:

📌 Nombre de tu marca o empresa
📍 Ciudad, país y dirección completa
🏢 ¿Qué tipo de negocio es?
💡 ¿Qué enfoque te gustaría darle a la promoción?

¡Con eso comenzamos! 🙌
`;

const pedirInfoEmpresa3 = `🙌 ¡Qué bueno contar con tu interés en Solteros y Parceros!

Para avanzar con tu promoción, necesitamos que nos compartas lo siguiente (todo en un solo mensaje):

📌 Nombre del negocio o empresa
📍 Ubicación completa (país, ciudad, dirección)
🏪 Tipo de negocio
💡 Enfoque o idea para la promo

¡Estamos listos para darle vida a tu marca! 🚀
`;

const pedirInfoEmpresa4 = `✨ ¡Gracias por elegir a Solteros y Parceros para tu promoción!

Para continuar, envíanos esta info en *un solo mensaje*:

🔹 Nombre de tu empresa o marca
📍 País, ciudad y dirección
🏬 Tipo de negocio
💭 ¿Qué idea o concepto quieres que usemos?

¡Con gusto te ayudaremos a brillar! 🌟
`;

const pedirInfoEmpresa5 = `📢 ¡Gracias por querer hacer parte de Solteros y Parceros!

Para continuar con el proceso, por favor envíanos en *un solo mensaje*:

📌 Nombre comercial
📍 Ubicación exacta (país, ciudad, dirección)
🏢 Rubro o tipo de negocio
🎯 Qué enfoque o estilo quieres para tu promoción

¡Estamos emocionados de trabajar contigo! 💖
`;

const pedirInfoEmpresa6 = `🚀 ¡Gracias por tu interés en anunciar con Solteros y Parceros!

Para seguir, por favor mándanos la siguiente información (todo juntito en un mensaje):

📌 Nombre de tu marca
📍 País, ciudad y dirección completa
🏪 Qué tipo de negocio tienes
💡 Qué idea o tono quieres para la promoción

¡Nos encantará ayudarte a destacar! 🔥
`;


const pedirInfoEmpresa = [
    pedirInfoEmpresa1,
    pedirInfoEmpresa2,
    pedirInfoEmpresa3,
    pedirInfoEmpresa4,
    pedirInfoEmpresa5,
    pedirInfoEmpresa6,
];

const pedirInfoEmpresasRandom = getRandomMessageForFlow(pedirInfoEmpresa);


//CIERRE EMPRESA


const cierreEmpresa1 = `🙏 Gracias por confiar en nosotros.

Hemos recibido la información, ahora la analizaremos y en un plazo máximo de 48 horas me comunicaré contigo para revisar las opciones más adecuadas según tus gustos, objetivos y con base en nuestra experiencia en la promoción de negocios y marcas 🧠✨
`;

const cierreEmpresa2 = `🙌 ¡Gracias por confiar en nosotros!

Ya recibimos tu información y la estaremos revisando con atención.
En máximo 48 horas me pondré en contacto contigo para proponerte las opciones más alineadas a tus objetivos, gustos y nuestra experiencia con marcas 💡📈
`;

const cierreEmpresa3 = `🙏 ¡Mil gracias por compartirnos tus datos!

Tu información ya está en nuestras manos, y en las próximas 48 horas me comunicaré contigo para mostrarte las mejores alternativas según tu marca, tu enfoque y todo lo que hemos aprendido promoviendo negocios como el tuyo 💼✨
`;

const cierreEmpresa4 = `🤗 ¡Recibido! Gracias por confiar en Solteros y Parceros.

Ahora vamos a revisar todo con mucho detalle, y en máximo 48 horas te escribiré para compartirte las ideas más adecuadas para tu promoción, basadas en tu estilo y nuestra experiencia 💭📊
`;

const cierreEmpresa5 = `🎉 ¡Gracias por enviarnos la info y confiar en nosotros!

La revisaremos cuidadosamente y, en un plazo de hasta 48 horas, me pondré en contacto contigo para compartir las opciones que más se ajusten a tu visión y lo que sabemos que funciona 😉🧠
`;

const cierreEmpresa = [
    cierreEmpresa1,
    cierreEmpresa2,
    cierreEmpresa3,
    cierreEmpresa4,
    cierreEmpresa5,
];

const cierreEmpresasRandom = getRandomMessageForFlow(cierreEmpresa);

module.exports = {
    saludoEmpresas,
    saludoEmpresasRandom,
    serviciosEmpresas,
    serviciosEmpresasRandom,
    preguntaInteresado,
    preguntaInteresadoEmpresasRandom,
    pedirInfoEmpresa,
    pedirInfoEmpresasRandom,
    cierreEmpresa,
    cierreEmpresasRandom
};