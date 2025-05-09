console.log("Estructura del proyecto Bot WhatsApp:");
console.log(`
├── .env                    # Variables de entorno
├── index.js                # Punto de entrada principal
├── config.js               # Configuraciones del bot
├── utils/
│   ├── delay.js            # Funciones para manejar delays
│   ├── timeUtils.js        # Utilidades de tiempo y horarios
│   ├── antibanUtils.js     # Estrategias anti-ban
│   └── messageUtils.js     # Utilidades para mensajes
├── responses/
│   ├── greetings.js        # Respuestas de saludos
│   ├── faqs.js             # Respuestas a preguntas frecuentes
│   └── general.js          # Respuestas generales
├── flows/
│   ├── welcomeFlow.js      # Flujo de bienvenida
│   ├── menuFlow.js         # Flujo del menú principal
│   └── serviceFlow.js      # Flujo de servicios
└── services/
    ├── weatherService.js   # Servicio de clima
    └── newsService.js      # Servicio de noticias
`);