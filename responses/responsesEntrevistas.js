const { getRandomMessageForFlow } = require('../utils/messageUtils')


//SALUDOS SOLTEROS


const saludoEntrevista1 = `💘 ¡Bienvenido a la Entrevista Personalizada de Solteros! 💘

¿Querés destacar y encontrar conexiones reales? Por *$500.000 COP*, hacemos una entrevista exclusiva contigo y la publicamos en nuestras redes para darte máxima visibilidad 🚀

🔥 ¿Qué incluye?
✅ Entrevista auténtica sobre vos y lo que buscás
✅ Publicación destacada en nuestras redes
✅ Más alcance y visibilidad real
✅ Presentación personalizada que refleja tu esencia
✅ ¡Conectá con personas afines que te escribirán directo! 💌

👉 ¿Te animás a dar el siguiente paso y brillar en nuestra comunidad?
`;

const saludoEntrevista2 = `🎙️ ¡Bienvenid@ a la Entrevista Personalizada de Solteros!

Por *$500.000 COP*, te hacemos una entrevista única y la compartimos con miles de personas en nuestras redes 😍

Incluye:
✅ Conversa real y sin filtros
✅ Publicación en Instagram y más
✅ Mayor visibilidad
✅ ¡Una oportunidad para encontrar a alguien especial! 💘

🚀 ¿Listo para dejar huella?
`;

const saludoEntrevista3 = `💡 ¿Querés algo diferente? ¡Esta es tu oportunidad!

Con la Entrevista Personalizada de Solteros, por solo *$500.000 COP*, te mostramos al mundo con una entrevista única publicada en nuestras redes 🎥

✅ Entrevista auténtica
✅ Publicación destacada
✅ Más visibilidad
✅ ¡Conectá con gente real que busca lo mismo que vos! 💌

🔥 ¿Vamos con todo?
`;

const saludoEntrevista4 = `💘 ¡Hola! Te damos la bienvenida a nuestra Entrevista Personalizada 💘

Por *$500.000 COP*, realizamos una entrevista contigo y la compartimos para que puedas conectar con más personas interesadas en vos 🚀

Incluye:
✅ Presentación auténtica
✅ Publicación en redes
✅ Visibilidad y conexiones reales 😍

👉 ¿Listo para que te vean como eres?
`;

const saludoEntrevista5 = `✨ ¿Te animás a contar tu historia?

Con nuestra Entrevista Personalizada, por solo *$500.000 COP*, te damos un espacio para expresarte y te presentamos en nuestras redes sociales 🎙️📲

✅ Conversa personal
✅ Publicación destacada
✅ Más visibilidad y oportunidades de conexión 💬

💘 ¡Es tu momento de brillar!
`;

const saludoEntrevista6 = `🎉 ¡Bienvenido a la experiencia más completa de Solteros!

Por *$500.000 COP*, te hacemos una entrevista especial, te mostramos como sos y conectás con personas afines a través de nuestras redes 🌟

✅ Entrevista personalizada
✅ Publicación con alto alcance
✅ Conexiones reales y significativas 💘

👉 ¿Te gustaría que todos te conozcan de verdad?
`;

const saludoEntrevista = [
    saludoEntrevista1,
    saludoEntrevista2,
    saludoEntrevista3,
    saludoEntrevista4,
    saludoEntrevista5,
    saludoEntrevista6
];

const saludoEntrevistaRandom = getRandomMessageForFlow(saludoEntrevista);



//PREGUNTAR INTERESADO SOLTERO

const preguntarInteresadoEntrevista1 = `Escribenos y te contamos cómo hacerlo paso a paso 💬

Por favor, elige una opción para continuar:

1️⃣ Estoy muy animado
2️⃣ No me interesaría el servicio
`;

const preguntarInteresadoEntrevista2 = `💬 ¡Escribenos y te explicamos todo paso a paso, sin complicaciones!

Seleccioná una opción para seguir:
1️⃣ ¡Estoy súper animado!
2️⃣ Prefiero no continuar con el servicio
`;

const preguntarInteresadoEntrevista3 = `📲 Te contamos cómo funciona todo, paso a paso. ¡Estamos para ayudarte!

Elegí una opción para avanzar:
1️⃣ Sí, me emociona esta idea
2️⃣ No estoy interesado en el servicio
`;

const preguntarInteresadoEntrevista4 = `💡 Si querés saber cómo funciona, te guiamos paso a paso con mucho gusto.

Por favor respondé con el número correspondiente:
1️⃣ ¡Sí, quiero saber más!
2️⃣ No me interesa por ahora
`;

const preguntarInteresadoEntrevista5 = `🙌 Te acompañamos en todo el proceso, paso a paso. Solo decinos qué querés hacer:

1️⃣ ¡Estoy listo para empezar!
2️⃣ No deseo continuar con el servicio
`;


const preguntarInteresadoEntrevista = [
    preguntarInteresadoEntrevista1,
    preguntarInteresadoEntrevista2,
    preguntarInteresadoEntrevista3,
    preguntarInteresadoEntrevista4,
    preguntarInteresadoEntrevista5
]

const preguntarIntereadoEntrevistasRandom = getRandomMessageForFlow(preguntarInteresadoEntrevista);


//ENVIAR FORMULARIO

const enviarFormularioEntrevista1 = `🌟 ¡Súper, me encanta!
Aquí te dejo un formulario para conocerte mejor:

🔗 https://www.canva.com/design/DAGi8ysn93k/WxddYPVskRBb8BQ6HP8sQg/view

Porfa, completalo y enviámelo cuando termines. En máximo *48 horas* lo reviso y me pongo en contacto para contarte los siguientes pasos 😊📲
`;

const enviarFormularioEntrevista2 = `🙌 ¡Qué emoción!
Te comparto este formulario para saber un poquito más de vos:

🔗 https://www.canva.com/design/DAGi8ysn93k/WxddYPVskRBb8BQ6HP8sQg/view

Apenas lo completes, me lo enviás. Lo revisaré en un plazo de 48 horas y te escribiré con los próximos pasos 💬✨
`;

const enviarFormularioEntrevista3 = `💖 ¡Genial! Me alegra que te animes
Dejame por acá este formulario para conocerte mejor:

🔗 https://www.canva.com/design/DAGi8ysn93k/WxddYPVskRBb8BQ6HP8sQg/view

Cuando lo tengas listo, enviámelo. En un máximo de 48 horas lo revisaré y te contactaré para avanzar 🚀📝
`;

const enviarFormularioEntrevista4 = `🎉 ¡Me encanta que te sumes!
Acá va el formulario para conocerte mejor y avanzar:

🔗 https://www.canva.com/design/DAGi8ysn93k/WxddYPVskRBb8BQ6HP8sQg/view

Una vez lo completes, mandámelo. Lo reviso dentro de 48 horas y te cuento cómo seguimos 💌🔥
`;

const enviarFormularioEntrevista = [
    enviarFormularioEntrevista1,
    enviarFormularioEntrevista2,
    enviarFormularioEntrevista3,
    enviarFormularioEntrevista4
];

const enviarFormularioEntrevistasRandom = getRandomMessageForFlow(enviarFormularioEntrevista);


module.exports = {
    saludoEntrevista,
    saludoEntrevistaRandom,
    preguntarInteresadoEntrevista,
    preguntarIntereadoEntrevistasRandom,
    enviarFormularioEntrevista,
    enviarFormularioEntrevistasRandom,
};