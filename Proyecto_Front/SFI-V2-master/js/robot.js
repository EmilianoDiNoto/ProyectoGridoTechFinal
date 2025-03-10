// Configuración del chatbot
const GEMINI_API_KEY = 'AIzaSyBkS5mTI25fVaN5Jj07V89etcuJdyPCZ4Y'; // Tu API key
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Contexto del chatbot - conocimiento específico de Grido
const GRIDO_KNOWLEDGE = `
- Grido Tech Advance es un sistema de gestión y control de producción para la empresa Grido.
- El sistema permite monitorear el balance de masas, la producción por temporada, y las órdenes de trabajo.
- Políticas de la empresa: priorizar la calidad del producto, optimizar recursos, y mantener los niveles de stock adecuados.
- Protocolo de producción: seguir las órdenes de trabajo, registrar correctamente los materiales utilizados, y reportar cualquier desviación.
- Puedo ayudar con consultas sobre inventario, producción, órdenes de trabajo, y balance de masas.
- La empresa valora la eficiencia y precisión en todas las etapas de producción.
`;

// Datos predefinidos para las opciones del chatbot
const CHAT_OPTIONS = {
    ordenes: {
        title: "Órdenes de Trabajo",
        intro: "Puedo ayudarte con información sobre órdenes de trabajo. Aquí algunas consultas comunes:",
        options: [
            "¿Cómo crear una nueva orden de trabajo?",
            "¿Cómo ver el estado de una orden de trabajo?",
            "¿Cómo asignar materiales a una orden de trabajo?",
            "¿Cómo cerrar una orden de trabajo finalizada?"
        ]
    },
    produccion: {
        title: "Producción de Tortas",
        intro: "Te puedo ayudar con información sobre la producción de tortas. Algunas consultas frecuentes:",
        options: [
            "¿Cómo declarar la producción diaria?",
            "¿Cómo ver el historial de producción?",
            "¿Cómo revisar el performance de producción?",
            "¿Cómo optimizar la producción de un producto?"
        ]
    },
    balances: {
        title: "Balances de Masas",
        intro: "Puedo ayudarte con consultas sobre balances de masas. Algunas preguntas comunes:",
        options: [
            "¿Qué es el balance de masas?",
            "¿Cómo interpretar los desvíos en el balance?",
            "¿Cómo optimizar el balance de masas?",
            "¿Cómo generar un reporte de balance de masas?"
        ]
    },
    incidentes: {
        title: "Incidentes",
        intro: "Te puedo ayudar con el manejo de incidentes. Algunas consultas frecuentes:",
        options: [
            "¿Cómo reportar un incidente de producción?",
            "¿Cómo hacer seguimiento a un incidente?",
            "¿Cómo resolver un incidente de calidad?",
            "¿Cómo generar un reporte de incidentes?"
        ]
    },
    solicitudes: {
        title: "Solicitudes",
        intro: "Puedo ayudarte con información sobre solicitudes. Algunas preguntas comunes:",
        options: [
            "¿Cómo crear una nueva solicitud de materiales?",
            "¿Cómo ver el estado de mis solicitudes?",
            "¿Cómo aprobar solicitudes pendientes?",
            "¿Cómo cancelar una solicitud?"
        ]
    }
};

// Función para inicializar el chatbot
document.addEventListener('DOMContentLoaded', function() {
    // Referencia a elementos del DOM
    const chatContainer = document.getElementById('robot-grido-container');
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-message');
    const toggleButton = document.getElementById('toggle-chat');
    const expandButton = document.getElementById('expand-chat');
    const clearButton = document.getElementById('clear-chat');
    const chatOverlay = document.getElementById('chat-overlay');
    const optionCards = document.getElementById('option-cards');
    
    // Historia de conversación para mantener contexto en la interfaz
    let conversationHistory = [];
    
    // Inicializar con mensaje de bienvenida
    if (!chatMessages.querySelector('.bot-message')) {
        addMessageToChat('bot', 'Hola, soy Robot Grido. ¿En qué puedo ayudarte hoy?');
    }
    
    // Manejar el botón de minimizar/maximizar
    toggleButton.addEventListener('click', function() {
        chatContainer.classList.toggle('minimized');
        const icon = toggleButton.querySelector('i');
        if (chatContainer.classList.contains('minimized')) {
            icon.classList.remove('zmdi-chevron-down');
            icon.classList.add('zmdi-chevron-up');
            
            // Si está en modo expandido, salir de ese modo primero
            if (chatContainer.classList.contains('expanded')) {
                chatContainer.classList.remove('expanded');
                chatOverlay.classList.remove('visible');
                expandButton.querySelector('i').classList.remove('zmdi-fullscreen-exit');
                expandButton.querySelector('i').classList.add('zmdi-fullscreen');
            }
        } else {
            icon.classList.remove('zmdi-chevron-up');
            icon.classList.add('zmdi-chevron-down');
        }
    });
    
    // Añadir evento para abrir el chatbot al hacer click en cualquier parte de él cuando está minimizado
    chatContainer.addEventListener('click', function(e) {
        // Si el chatbot está minimizado y el clic no fue en el botón de toggle
        if (chatContainer.classList.contains('minimized') && e.target !== toggleButton && !toggleButton.contains(e.target)) {
            toggleButton.click(); // Simular clic en el botón de toggle
        }
    });
    
    // Manejar el botón de expandir/contraer (pantalla completa)
    expandButton.addEventListener('click', function() {
        chatContainer.classList.toggle('expanded');
        chatOverlay.classList.toggle('visible');
        
        // Asegurar que no esté minimizado
        if (chatContainer.classList.contains('minimized')) {
            chatContainer.classList.remove('minimized');
            toggleButton.querySelector('i').classList.remove('zmdi-chevron-up');
            toggleButton.querySelector('i').classList.add('zmdi-chevron-down');
        }
        
        // Cambiar el icono según el estado
        const icon = expandButton.querySelector('i');
        if (chatContainer.classList.contains('expanded')) {
            icon.classList.remove('zmdi-fullscreen');
            icon.classList.add('zmdi-fullscreen-exit');
        } else {
            icon.classList.remove('zmdi-fullscreen-exit');
            icon.classList.add('zmdi-fullscreen');
        }
    });
    
    // Cerrar el modo expandido al hacer clic en el overlay
    chatOverlay.addEventListener('click', function() {
        if (chatContainer.classList.contains('expanded')) {
            expandButton.click();
        }
    });
    
    // Manejar el botón de borrar conversación
    clearButton.addEventListener('click', function() {
        // Borrar todos los mensajes excepto el primero
        while (chatMessages.childNodes.length > 1) {
            chatMessages.removeChild(chatMessages.lastChild);
        }
        
        // Restaurar el mensaje de bienvenida si no existe
        if (chatMessages.childNodes.length === 0) {
            const welcomeMessage = document.createElement('div');
            welcomeMessage.className = 'message bot-message';
            
            const contentDiv = document.createElement('div');
            contentDiv.className = 'message-content';
            
            const paragraph = document.createElement('p');
            paragraph.textContent = 'Hola, soy Robot Grido. ¿En qué puedo ayudarte hoy?';
            
            contentDiv.appendChild(paragraph);
            welcomeMessage.appendChild(contentDiv);
            chatMessages.appendChild(welcomeMessage);
        }
        
        // Mostrar las tarjetas de opciones nuevamente
        showOptionCards();
        
        // Limpiar historial de conversación
        conversationHistory = [];
        
        // Desplazar hacia arriba
        chatMessages.scrollTop = 0;
    });
    
    // Función para mostrar las tarjetas de opciones
    function showOptionCards() {
        // Verifica si las tarjetas ya existen
        let existingCards = document.getElementById('option-cards');
        if (existingCards) {
            existingCards.remove();
        }
        
        // Crea un nuevo contenedor para las tarjetas
        const optionsContainer = document.createElement('div');
        optionsContainer.id = 'option-cards';
        optionsContainer.className = 'option-cards';
        
        // Agrega cada tarjeta con su ícono y texto
        const options = [
            { id: 'ordenes', icon: 'zmdi-assignment', text: 'Órdenes de Trabajo' },
            { id: 'produccion', icon: 'zmdi-washing-machine', text: 'Producción de tortas' },
            { id: 'balances', icon: 'zmdi-chart', text: 'Balances de masas' },
            { id: 'incidentes', icon: 'zmdi-alert-triangle', text: 'Incidentes' },
            { id: 'solicitudes', icon: 'zmdi-file-text', text: 'Solicitudes' }
        ];
        
        options.forEach(opt => {
            const card = document.createElement('div');
            card.className = 'option-card';
            card.setAttribute('data-option', opt.id);
            
            const icon = document.createElement('i');
            icon.className = `zmdi ${opt.icon}`;
            
            const span = document.createElement('span');
            span.textContent = opt.text;
            
            card.appendChild(icon);
            card.appendChild(span);
            
                            // Agregar evento click
            card.addEventListener('click', function() {
                handleOptionSelection(opt.id);
            });
            
            optionsContainer.appendChild(card);
            
            // Verificar en consola que las tarjetas se crearon correctamente
            console.log('Tarjeta creada:', opt.id, card);
        });
        
        // Agrega el contenedor al chat
        chatMessages.appendChild(optionsContainer);
        
        // Desplaza hacia abajo para mostrar las tarjetas
        setTimeout(() => {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 50);
        
        return optionsContainer;
    }
    
    // Manejar clics en las tarjetas de opciones
    document.querySelectorAll('.option-card').forEach(card => {
        card.addEventListener('click', function() {
            const option = this.getAttribute('data-option');
            handleOptionSelection(option);
        });
    });
    
    // Función para manejar la selección de opciones
    function handleOptionSelection(option) {
        const optionData = CHAT_OPTIONS[option];
        
        if (optionData) {
            // Agregar mensaje con la introducción de la opción
            addMessageToChat('bot', `**${optionData.title}**\n\n${optionData.intro}`);
            
            // Mostrar opciones como botones
            const optionsHtml = document.createElement('div');
            optionsHtml.className = 'message bot-message';
            
            const contentDiv = document.createElement('div');
            contentDiv.className = 'message-content options-list';
            
            optionData.options.forEach(optionText => {
                const optionButton = document.createElement('button');
                optionButton.className = 'option-button';
                optionButton.textContent = optionText;
                
                // Aplicar estilos directamente para garantizar la visibilidad
                optionButton.style.backgroundColor = '#d1ecff';
                optionButton.style.color = '#000';
                optionButton.style.fontWeight = '500';
                optionButton.style.border = '1px solid #a8d8ff';
                optionButton.style.padding = '10px 15px';
                optionButton.style.margin = '5px 0';
                optionButton.style.width = '100%';
                optionButton.style.textAlign = 'left';
                optionButton.style.borderRadius = '18px';
                
                optionButton.addEventListener('click', function() {
                    // Agregar la pregunta como mensaje del usuario
                    addMessageToChat('user', optionText);
                    
                    // Generar respuesta
                    showTypingIndicator();
                    
                    // Intentar primero con la API de backend
                    getBotResponse(optionText).catch(error => {
                        console.error("Error en API de backend, usando API directa:", error);
                        // Si falla, usar la API directa de Gemini como respaldo
                        getDirectGeminiResponse(optionText);
                    });
                });
                
                contentDiv.appendChild(optionButton);
                
                // Verificar en consola
                console.log('Botón de opción creado:', optionText);
            });
            
            optionsHtml.appendChild(contentDiv);
            chatMessages.appendChild(optionsHtml);
            
            // Desplazar hacia abajo
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }
    
    // Manejar el envío de mensajes
    function handleSendMessage() {
        const message = userInput.value.trim();
        if (message === '') return;
        
        // Agregar mensaje del usuario a la interfaz
        addMessageToChat('user', message);
        
        // Limpiar input
        userInput.value = '';
        
        // Mostrar indicador de escritura
        showTypingIndicator();
        
        // Agregar mensaje a la historia de conversación
        conversationHistory.push({ sender: 'user', message: message });
        
        // Intentar primero con la API de backend
        getBotResponse(message).catch(error => {
            console.error("Error en API de backend, usando API directa:", error);
            // Si falla, usar la API directa de Gemini como respaldo
            getDirectGeminiResponse(message);
        });
    }
    
    // Manejar clic en botón enviar
    sendButton.addEventListener('click', handleSendMessage);
    
    // Manejar tecla Enter en input
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    });
    
    // Función para agregar mensajes al chat
    function addMessageToChat(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        // Convertir formato markdown simple a HTML
        const formattedText = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>');
        
        contentDiv.innerHTML = formattedText;
        
        messageDiv.appendChild(contentDiv);
        chatMessages.appendChild(messageDiv);
        
        // Forzar un reflow para asegurar que se actualice el scrollHeight
        void chatMessages.offsetHeight;
        
        // Desplazar hacia abajo para ver el mensaje más reciente con una pequeña demora
        setTimeout(() => {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 50);
        
        // Asegurar que el chat esté maximizado al recibir mensajes
        if (chatContainer.classList.contains('minimized')) {
            toggleButton.click();
        }
    }
    
    // Mostrar indicador de "escribiendo..."
    function showTypingIndicator() {
        const indicatorDiv = document.createElement('div');
        indicatorDiv.className = 'message bot-message';
        indicatorDiv.id = 'typing-indicator';
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content typing-indicator';
        
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('span');
            contentDiv.appendChild(dot);
        }
        
        indicatorDiv.appendChild(contentDiv);
        chatMessages.appendChild(indicatorDiv);
        
        // Desplazar hacia abajo
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Ocultar indicador de escritura
    function hideTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }
    
    // Obtener respuesta del backend de .NET
    async function getBotResponse(userMessage) {
        try {
            const response = await fetch('http://localhost:63152/api/chatbot/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: userMessage
                })
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error("Error en respuesta del servidor:", response.status, errorText);
                throw new Error(`Error en la respuesta del servidor: ${response.status} ${errorText}`);
            }
            
            const data = await response.json();
            
            // Ocultar indicador de escritura
            hideTypingIndicator();
            
            if (data && data.response) {
                const botResponse = data.response;
                
                // Agregar respuesta a la historia de conversación
                conversationHistory.push({ sender: 'bot', message: botResponse });
                
                // Agregar respuesta al chat
                addMessageToChat('bot', botResponse);
            } else {
                // Manejar error o respuesta vacía
                addMessageToChat('bot', 'Lo siento, tuve un problema al procesar tu solicitud. ¿Podrías intentarlo de nuevo?');
            }
        } catch (error) {
            console.error('Error al obtener respuesta del chatbot:', error);
            hideTypingIndicator();
            throw error; // Re-lanzar el error para que se pueda manejar con getDirectGeminiResponse
        }
    }
    
    // Obtener respuesta directamente de Gemini (alternativa de respaldo)
    async function getDirectGeminiResponse(userMessage) {
        try {
            // Crear el prompt
            const prompt = `${GRIDO_KNOWLEDGE}
            
            Eres Robot Grido, un asistente virtual para el sistema Grido Tech Advance. 
            Tu objetivo es ayudar a los usuarios a utilizar el sistema y responder preguntas específicas sobre 
            producción, inventario, órdenes de trabajo, y políticas de la empresa.
            
            Responde de manera concisa, profesional y amigable. 
            Si no sabes algo específico sobre Grido, puedes responder basándote en conocimientos generales
            sobre sistemas de producción y gestión de inventarios.
            
            Pregunta del usuario: ${userMessage}`;
            
            const fullUrl = `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`;
            
            console.log("Utilizando API directa de Gemini");
            
            const response = await fetch(fullUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                { text: prompt }
                            ]
                        }
                    ],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 800
                    }
                })
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error("Error en respuesta de Gemini:", response.status, errorText);
                throw new Error(`Error en la respuesta de Gemini: ${response.status} ${errorText}`);
            }
            
            const data = await response.json();
            
            // Ocultar indicador de escritura
            hideTypingIndicator();
            
            if (data.candidates && data.candidates[0].content.parts[0].text) {
                const botResponse = data.candidates[0].content.parts[0].text;
                
                // Agregar respuesta a la historia de conversación
                conversationHistory.push({ sender: 'bot', message: botResponse });
                
                // Agregar respuesta al chat
                addMessageToChat('bot', botResponse);
            } else {
                // Manejar error o respuesta vacía
                addMessageToChat('bot', 'Lo siento, tuve un problema al procesar tu solicitud. ¿Podrías intentarlo de nuevo?');
            }
        } catch (error) {
            console.error('Error al obtener respuesta directa de Gemini:', error);
            hideTypingIndicator();
            addMessageToChat('bot', 'Lo siento, no puedo conectarme con mi servicio de inteligencia en este momento. Por favor, intenta más tarde.');
        }
    }
    
    // Agregar estilos para opciones de respuesta
    const style = document.createElement('style');
    style.textContent = `
        .options-list {
            display: flex;
            flex-direction: column;
            gap: 8px;
            width: 100%;
            max-width: 100%;
        }
        .option-button {
            background-color: #d1ecff !important;
            border: 1px solid #a8d8ff !important;
            border-radius: 18px !important;
            padding: 10px 15px !important;
            text-align: left !important;
            cursor: pointer !important;
            transition: background-color 0.2s !important;
            font-size: 14px !important;
            color: #000 !important;
            font-weight: 600 !important;
            margin: 5px 0 !important;
            width: 100% !important;
        }
        .option-button:hover {
            background-color: #a8d8ff !important;
        }
    `;
    document.head.appendChild(style);
    
    // Opcional: Guardar historial en almacenamiento local
    function saveChatHistory() {
        localStorage.setItem('gridoChatHistory', JSON.stringify(conversationHistory));
    }
    
    // Guardar historial cuando el usuario cierre la página
    window.addEventListener('beforeunload', saveChatHistory);
});

// Funciones para almacenamiento de historial
const chatStorage = {
    dbName: 'gridoChatDB',
    storeName: 'chatHistory',
    
    // Inicializar la base de datos
    init: function() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1);
            
            request.onerror = event => {
                console.error('Error al abrir la DB:', event.target.error);
                reject(event.target.error);
            };
            
            request.onsuccess = event => {
                const db = event.target.result;
                resolve(db);
            };
            
            request.onupgradeneeded = event => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName, { keyPath: 'id', autoIncrement: true });
                }
            };
        });
    },
    
    // Guardar conversación
    saveConversation: async function(userId, history) {
        try {
            const db = await this.init();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([this.storeName], 'readwrite');
                const store = transaction.objectStore(this.storeName);
                
                // Buscar conversación existente
                const getRequest = store.get(userId);
                
                getRequest.onsuccess = event => {
                    const data = event.target.result;
                    if (data) {
                        // Actualizar conversación existente
                        data.history = history;
                        data.updated = new Date();
                        store.put(data);
                    } else {
                        // Crear nueva conversación
                        store.add({
                            id: userId,
                            history: history,
                            created: new Date(),
                            updated: new Date()
                        });
                    }
                };
                
                transaction.oncomplete = () => resolve(true);
                transaction.onerror = event => reject(event.target.error);
            });
        } catch (error) {
            console.error('Error al guardar conversación:', error);
            return false;
        }
    },
    
    // Obtener conversación
    getConversation: async function(userId) {
        try {
            const db = await this.init();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([this.storeName], 'readonly');
                const store = transaction.objectStore(this.storeName);
                const request = store.get(userId);
                
                request.onsuccess = event => {
                    const data = event.target.result;
                    resolve(data ? data.history : null);
                };
                
                request.onerror = event => reject(event.target.error);
            });
        } catch (error) {
            console.error('Error al obtener conversación:', error);
            return null;
        }
    }
};