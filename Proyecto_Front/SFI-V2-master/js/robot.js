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
Objetivo del sistema: optimizar la carga de datos, minimizar errores operativos y garantizar la integración automática con SAP para la gestión de inventarios.


Procesos principales:

Recepción de materia prima: Registro de pedidos, scrap y devoluciones, asegurando control de consumos.

Gestión de almacenes: Entrega y recepción de insumos y mix, abasteciendo líneas productivas.

Gestión de semielaborados: Control y registro del uso de mix en tanques y su trazabilidad.

Gestión de reprocesos: Recepción y tratamiento de scrap de helado para reutilización.

Trazabilidad: Registro detallado de lotes de materias primas, insumos y productos finales.

Mantenimiento y limpieza de equipos: Revisión periódica de maquinaria para asegurar eficiencia y evitar contaminación cruzada.

Control de temperatura: Supervisión en cada etapa de producción y almacenamiento para garantizar la calidad del producto.


Políticas de la empresa:

Priorizar la calidad del producto bajo certificación HACCP.

Optimización de recursos y reducción de desperdicios.

Mantenimiento de niveles de stock adecuados.

Uso obligatorio de EPP en planta y cumplimiento de normas de seguridad.

Planificación de producción anual con revisiones semestrales.

Control de acceso y seguridad en áreas de producción.

Estrictos protocolos de higiene y manipulación de alimentos.


Controles de calidad:

Revisión de sabor, textura y temperatura cada 3 horas.

Uso de detectores de metales en el producto final.

Balance de masas: comparación de consumo teórico vs real por turno.

Verificación de codificadora y túnel de frío cada 4 horas.

Pruebas microbiológicas y análisis de composición en laboratorio.

Registro de incidentes y no conformidades con seguimiento de resolución.


(((Funciones del sistema))))

Gestión de inventario por secciones y clasificación de materiales.

Registro de ajustes de stock y emisión de informes.

Generación de órdenes de producción y seguimiento en SAP.

Control del balance de masas y trazabilidad de productos.

Soporte en consultas sobre inventario, producción y órdenes de trabajo.

Registro y notificación de desvíos en la producción.

Monitoreo en tiempo real de consumos y desperdicios.

Control y autorización de lotes listos para despacho.

Acceso a documentación y protocolos de producción.


Órdenes de Trabajo:

Tipos de órdenes:

Órdenes de producción estándar: Se generan según la planificación anual.

Órdenes urgentes: Se activan ante picos de demanda o desabastecimiento.

Órdenes de reproceso: Se generan para reutilizar scrap o producto con desvíos corregibles.


Flujo de una orden de trabajo:

Generación en el sistema SAP.

Validación de insumos y stock disponible.

Asignación de personal y equipos.

Registro de producción y consumo de materiales.

Cierre y análisis de eficiencia.


Procesos de Producción:

Recepción de materia prima:

Inspección visual y verificación de temperatura.

Registro en el sistema con lote y fecha de vencimiento.

Almacenamiento en áreas específicas según temperatura y rotación.

Preparación de mezcla (mix):

Dosificación de ingredientes según fórmula estandarizada.

Homogeneización y pasteurización de la mezcla.

Enfriamiento y maduración antes del uso en producción.


Línea de producción de tortas:

Carga de bases y armado de capas con helado.

Agregado de ingredientes adicionales como galletas o salsas.

Moldeado y estabilización en túneles de frío.

Decoración, codificación y empaque final.


Almacenamiento y despacho:

Control de temperatura en cámaras de congelado.

Registro de stock por lote y fecha de producción.

Despacho bajo el método FIFO (First In, First Out).


Protocolos de Producción:

Control de calidad:

Análisis sensorial y físico-químico de la mezcla y producto final.

Pruebas microbiológicas periódicas.

Uso de detectores de metales en la línea final.


Normas de higiene y seguridad:

Uso obligatorio de elementos de protección personal (EPP).

Lavado y desinfección de manos antes de manipular alimentos.

Limpieza y sanitización de equipos y superficies cada turno.


Gestión de residuos y reprocesos:

Identificación y clasificación de scrap reutilizable.

Procedimientos para reducir desperdicios sin comprometer calidad.

Eliminación segura de productos no conformes.


Manejo de Stock

Clasificación de inventarios:

Materia prima: ingredientes principales y secundarios.

Materiales de empaque: cajas, etiquetas y envases.

Producto final: tortas listas para distribución.


Control de stock:

Registro en SAP con lotes y fechas de vencimiento.

Inventarios físicos semanales para control de diferencias.

Alertas de reabastecimiento y ajustes en tiempo real.


Política de almacenamiento:

Respetar la temperatura y condiciones de cada insumo.

Separación por categorías para evitar contaminación cruzada.

Implementación de FIFO para evitar vencimientos.

Procedimiento Completo de Producción de Tortas

Planificación: Se define qué tortas producir según demanda y stock disponible.

Preparación de insumos: Se pesan y preparan los ingredientes necesarios.


Producción:

Armado de bases y agregado de helado.

Integración de ingredientes adicionales (chocolates, frutas, salsas).

Moldeado y congelado en túneles de frío.


Decoración y empaque:

Agregado de coberturas, glaseados o decoraciones finales.

Codificación con fecha de producción y lote.

Empaque en cajas específicas según tamaño y formato.

Control de calidad final: Revisión de peso, temperatura y presentación.

Almacenamiento y distribución: Ingreso a cámara de congelado y asignación para despacho.



--------OBJETIVO DEL PROYECTO:
Proveer una solución integral para la gestión de almacenes en Helacor S.A., utilizando como modelo la línea de producción de tortas heladas. El sistema "Grido Tech Advance" busca optimizar la carga de datos, minimizar errores operativos y garantizar la integración automática con SAP para la gestión de inventarios facilitando un flujo eficiente de información para operarios, supervisores y jefes de producción.


---------ÁMBITO DE APLICACIÓN:
El ámbito de aplicación del presente proyecto se circunscribe a la empresa Helacor S.A, conocida comercialmente como GRIDO. La empresa utiliza SAP en la mayoría de sus departamentos, pero el área de producción, el sector más extenso, no cuenta con un módulo integrado en dicho sistema. En su lugar, utiliza hojas de cálculo en Excel vinculadas a través de SharePoint para gestionar su información. Bajo este contexto, se requiere optimizar y modernizar el procesamiento de información dentro del área de producción, integrando efectivamente el sistema a desarrollar de modo tal que se logre consolidar la información y mejorar la eficiencia operativa de la empresa, siendo los usuarios finales los empleados y encargados de la planta.


--------FUNCIONES:
Dirección:  
?	Recibe y analiza la información del área comercial y en base a ella, se encarga de plantear los objetivos de la temporada.
Jefe de Producción:
?	Planificar la producción de la temporada, desglosándolo en meses, semanas y días.
?	Determinar al área de capital humano la necesidad del personal necesario.
?	Enviar el plan elaborado al área de compras y de esta forma generar la necesidad de las materias primas e insumos para ejecutar el cronograma.
?	Ejecutar el plan de producción planificado.
?	Controlar el cumplimiento de los objetivos planteados para la temporada.
?	Analiza el cumplimiento de objetivos y en base a ella reelabora las estrategias para cumplir con las metas propuestas. 
Líder de línea:
?	Programa las tareas y recursos que necesita para implementar el proyecto solicitado, informando al jefe de producción de lo que requiere.  
?	Organización de turnos y grupos de trabajo para cumplir con los objetivos. 
?	Controla el proceso y eficacia de la producción a través de los informes que genera el administrativo de producción, basado en datos preestablecidos. 
?	Toma de decisiones en las estrategias a implementar para lograr los objetivos propuestos en base a la información recibida del área administrativa de producción. 
?	Realiza la valoración individual de desempeño de los colaboradores de la línea (Sistema Rankmi ) 
?	Cumplimentación de las Buenas Prácticas de Manufacturas (BPM).
 
Encargado de turno:
?	Distribución de las tareas diarias a los operarios de su turno a cargo. 
?	Solicitud de materia prima e insumo a través de un remito al sector de depósito interno.  
?	Solicitud de mix  (base de sabores de helado para cada producto) indicado al sector maduración. 
?	Manejo de maquinarias para garantizar la eficiencia de producción de acuerdo a las especificaciones del producto a elaborar. 
?	Control de especificaciones del producto.
?	 Carga de datos y valoraciones durante su turno de producción. 
?	Cumplimentación de las Buenas Prácticas de Manufacturas (BPM)
Operarios:
?	Realización de la tarea designada por su encargado de turno. 
?	Cumplimentación de las Buenas Prácticas de Manufacturas (BPM)


-------POLÍTICAS DEL SECTOR
A continuación, detallaremos las políticas detectadas en trabajo de campo:
4.1	POLÍTICAS PERSONAL:
A nivel empresa el personal se dividió en tres grupos, presenciales, mixta y remoto. Mientras que, en la línea de tortas, maneja a su vez otra política pueden ser colaboradores permanentes o temporarios. Permanente se considera al personal fijo de la línea, mientras que el temporario tiene un tipo de contrato de trabajo por algunos meses, aproximadamente 11 meses.
4.2	POLÍTICAS DE CALIDAD:
La producción de los 3 ítems se encuentra supervisados con las normas de calidad HACCP la cual se encuentra certificada en planta. La certificación HACCP proporciona un enfoque estructurado de la inocuidad alimentaria, ayudando a establecer procesos de producción preventivos y correctivos.
4.3	POLÍTICAS DE PRODUCCIÓN:
 Se planifica la producción anualmente, con revisión cada 6 meses. Esta agrupada en dos esquemas o procesos principales: 
1.	Proceso Granel.
2.	Proceso Impulsivo.
Cada proceso consiste básicamente en 5 etapas:
1.	Concentrado.
2.	Pasteurizado.
3.	Maduración.
4.	Producción.
5.	Paletizado.
4.4	POLÍTICAS DE HIGIENE Y SEGURIDAD:
Cada colaborador involucrado en los procesos de producción debe tener los elementos de protección personal brindada por la empresa.
4.5	POLÍTICA DE EQUIPAMIENTO:
Los equipos productivos que participan en los procesos deben cumplir con un mantenimiento preventivo al finalizar la semana y así evitar detenciones durante los turnos de producción. También se debe realizar un mantenimiento anual en el cual se realiza una revisión total de todos los recursos tecnológicos.
4.6	POLÍTICAS DE VISITA:
Para el ingreso de visitas a la planta de producción se les exige sacarse aros, anillos, relojes, anillos y cadenas. A su vez deben colocarse guardapolvo blanco, elementos de protección descartables (cofia, barbijo, cubre calzado y barba). Además, durante el ingreso a planta se prohíbe tomar fotos y grabar videos.
4.7	POLÍTICAS DE ABASTECIMIENTO:
Las órdenes de compras se comprometen a 6 meses. Antes se hacía a 30 días. En el cual consta de comprar todas las materias prima e insumos que van a consumir según el cálculo teórico de la ficha técnica especificada.


------PROCESOS INVOLUCRADOS:
1.	ESTRUCTURAS DE PRODUCTO.
Evento: Migración de datos.
Objetivo: Obtener estructura del producto.
Actividades:
•	Integración con SAP.
Participantes: Sistema SAP y Modulo Producción.
2.	RECEPCIÓN DE MATERIA PRIMA DESDE SAP.
Evento: Registro de los pedidos, scrap y devoluciones de materias primas e insumos.
Objetivo: Control de consumos.
Actividades:
•	En el almacén principal, hace entrega de materia prima e insumos por transferencia desde SAP, con la entrega de una MIGO, comprobante físico de SAP.
•	El almacén principal hace entregas parciales a las secciones (depósito interno, pasteurizado y chocolate) para su consumo.
•	Los scrap y devoluciones desde las secciones regresan a almacén principal.

Participantes: Responsables de turnos y lideres de deposito interno, pasteurizado y chocolate.
3.	GESTIÓN DE ALMACENES.
Evento: Recepción de materias primas, insumos y mix.
Objetivo: Abastecer de materia prima, insumos y mix para el consumo.
Actividades:
•	Existe un depósito interno y dentro líneas que consumen materiales.
•	En cada línea indirecta se le entregan materiales, que consume ese stock cuando declara producción de semielaborados.
•	Debe permitir el ajuste de inventario.
Participantes: Responsables de turnos y líder de depósito interno. 
4.	GESTIÓN DE SEMIELABORADOS.
Evento: Registro de la recepción, el cierre y el consumo del tanque.
Objetivo: Abastecer de semielaborados para consumo.
Actividades:
•	Recepción en tanque.
•	Los consumos de semielaborados que se gestiona en los tanques, se realizan a partir de que se libera hasta que se finaliza. Se lava y desinfecta, quedando nuevamente disponible.
•	Cierre de tanque para unificación de lotes: en un tanque se pueden mezclar varios lotes de un mismo semielaborado/materia prima y el sistema debe generar un lote hijo que agrupe a todos lotes padres.
•	Debe permitir la reutilización del sobrante, para un nuevo semielaborado.
Participantes: Responsables de turnos y líderes de maduración, chocolate, concentrado, reproceso y pasteurizado.

5.	GESTIÓN DE REPROCESOS Y DECOMISOS.
Evento: recepción de scrap de helado.
Objetivo: volver al circuito el scrap de mix generado por las líneas directas.
Actividades:
•	Recepción del helado de scrap.
•	Según el sabor se le da destino puede ser reproceso o decomiso.
•	Envía el semielaborado reproceso al proceso de pasteurizado.
Participantes: Responsables de turnos y líder de reproceso. 
 
6.	DECLARACIÓN DE PRODUCCIÓN REAL:
Evento: Registro de la producción realizada.
Objetivo: Control de resultados.
Actividades:
•	Producto terminado y emisión vale de fabricación por pallets.
•	Semielaborados intermedios: emisión de vales de fabricación por lotes.
Participantes: Responsables de turnos y líderes. 
7.	DECLARACIÓN DE CONSUMOS REALES DE MATERIALES. 
Evento: Registro de la producción real.
Objetivo: Control de consumos reales.
Actividades:
•	En productos terminados Paletizado Impulsivo: Se declaran los pallets del producto terminado consumiendo en forma automática en base a la estructura del articulo FIFO (Los semielaborados son consumidos desde el tanque correspondiente).
•	Semielaborados: Consumos manual en base a la estructura en el mismo proceso declaración de alta de semielaborado; permitiendo editar la cantidad e ítems sugeridos y sugiriendo lotes según FIFO del almacén.
Participantes: Responsables de turnos y líderes de Paletizado y Albace.
8.      TRAZABILIDAD.
Evento: Registro de lotes de materias primas, insumos y semielaborados.
Objetivo: Rastrear todos los procesos, materias primas e insumos que se utilizaron en un determinado producto.
Actividades:
•	De materia prima (en gráneles fecha y proveedor = lote)
•	De productos terminados: Trazabilidad de lotes de fabricación por pallets hasta Cámara.
Participantes: Responsables de turnos y líderes.
9.	BALANCE DE MASA DE CONSUMO.
Evento: reporte de balance de masa.
Objetivo: Control de consumo de materias primas e insumos en los procesos.
Actividades:
•	Comparación de consumo teórico versus consumos reales.
Participantes: Lideres de todas las lineas.


-----CONTROLES:
1	CONTROLES DE CALIDAD.
Cada 3 horas se controla el sabor, las texturas y la temperatura del helado de cada una de las maquinas Cada producto final atraviesa por un detector de metal, se pesa cada 30 minutos.
2	CONTROLES DE BALANCE DE MASA.
Cada 3 horas se hace el control de las dosificaciones de cada insumo. Al finalizar el turno, en la planilla se puede observar la comparación del consumo real con el consumo teórico. El mismo control se realiza semanal y mensualmente.
3	CONTROLES DE PRODUCCIÓN.
Cada 4 horas se realiza chequeo sobre el funcionamiento del detector de metal, y la temperatura del túnel de frio. Cada 30 minutos se hace un chequeo sobre el funcionamiento de la codificadora (fechadora). Además, se tiene en cuenta el tiempo detenido por alguna falla de la maquina detallando: tiempo, falla, solución y mecánico.
Estos 3 controles, se cargan en una planilla de Excel, llamada “Registro digital de proceso de línea tortas”. Estos datos son cargados por el encargado de turno y posteriormente son revisados por el líder de la línea.
 

------MAPA GLOBAL DE PROCESOS: 
El mapa global de procesos muestra el flujo de producción de una planta, comenzando con la "Oficina de Producción Cronograma", que coordina las actividades. A partir de ahí, se dirigen los insumos hacia el "Pausterizado" y "Reproceso", con algunos productos pasando por "Maduración" y "Concentrado" antes de almacenarse en el "Depósito Interno". Desde el depósito, los productos son enviados a las "Líneas Directas", que incluyen diversas líneas de producción como "Torta", "Tetrapak", "Palitos", "Glaciar", y diferentes presentaciones de "Pote" y "Granel". Además, algunas líneas están categorizadas bajo "Chocolate". Posteriormente, los productos pueden dirigirse a "Paletizado Impulsivo" o "Albace" para su distribución.


------TECNOLOGÍA A IMPLEMENTAR:
Teniendo en cuenta que las máquinas de carga de datos utilizan sistema operativo Windows, se decide implementar tecnologías compatibles con .Net Framework, se incorporará un sistema de base de datos y el desarrollo del sistema será realizado en lenguaje de programación de Microsoft, brindando información a una base intermedia, que posteriormente será utilizada por el módulo MRP SAP.
Las tecnologías a implementar son:
•	HTML.
•	Css.
•	Bootstrap.
•	Java Script.
•	C#
•	.Net.
•	ADO.
•	Entity Framework.
•	MVC.
•	Microsoft SQL Server Management.
•	Git Hub.


----------AMBIENTE DE IMPLEMENTACIÓN:
La arquitectura de implementación para nuestro sistema es el siguiente: Entorno físico son de 2 Switch de distribución los cuales tendrán cada uno su Switch de acceso y 1 Wifi Access Point. Constará de 16 equipos, un servidor y tres impresoras. 
Los equipos serán con las siguientes especificaciones: 
¦	2 notebooks Lenovo 840-70(Intel Core i5_5200u, memoria RAM 6 GB, HDD 1tb). 
¦	14 computadoras (Intel® Core™ i3-7100 CPU@ 390GHz 3.91GHz memoria RAM 4 G). 
¦	14 monitores Samsung 24’. 
¦	Sistema operativo Windows 10 Pro de 64 bits. 
¦	1 impresora Brother DCP-8080DN. 
¦	2 impresoras industriales Zebra ZT411. 
Esta arquitectura será la encargada de realizar todas las interacciones entre el usuario, la aplicación, la base de datos y sus complementos. La misma cumple con los requerimientos para su instalación y es ideal para la utilización de la aplicación. 


-------PRUEBA DEL SISTEMA:
1	INTRODUCCIÓN
La fase de prueba del sistema en el proyecto "Grido Tech Advance" es fundamental para garantizar que el nuevo software funcione correctamente en todos los niveles operativos de la planta de producción de Helacor SA. Este proceso tiene como objetivo verificar la precisión, eficiencia e integración del sistema con SAP, asegurando que cada funcionalidad cumpla con los requerimientos planteados. Para ello, se diseñarán lotes de prueba que simulen datos de producción reales, permitiendo evaluar el rendimiento, la confiabilidad y la usabilidad del sistema en condiciones similares a las del entorno de producción. Esta etapa abarca desde la planificación y especificación de casos de prueba, hasta la documentación de resultados, con el fin de identificar y corregir cualquier error previo a la implementación total del sistema en la planta.
2	RESPONSABLES DE PRUEBAS
Tester Principal: Diana Zavaleta, quien será responsable de diseñar los casos de prueba, supervisar su ejecución y documentar los resultados obtenidos.
Equipo de Apoyo: Integrado por los desarrolladores (Emiliano Di Noto, Valentín Ríos y Emmanuel González), y supervisado por la Scrum Master, Sofía Roure. Este equipo se encargará de colaborar en la ejecución de las pruebas y en la identificación de cualquier fallo o ajuste necesario.
3	PROCESO DE TESTING
Especificación de casos de prueba
Verificar que el sistema pueda realizar correctamente las principales tareas operativas, como el registro de avances en producción y la declaración de consumos de materias primas.
Dado que el sistema debe integrarse con SAP, se especificarán casos para asegurar que los datos ingresados en "Grido Tech Advance" se reflejen correctamente en SAP, y viceversa.
En el caso de rendimiento y carga se evaluará la capacidad del sistema para manejar grandes volúmenes de datos, con el fin de garantizar un funcionamiento eficiente durante los picos de producción.
También habrá pruebas que verificarán la facilidad de uso y accesibilidad del sistema para los operarios y supervisores, evaluando que la interfaz sea intuitiva y que las tareas se realicen de manera ágil.
4	PLANIFICACIÓN DEL TESTING
El proceso de pruebas se organizará en fases, comenzando con pruebas unitarias de cada módulo, seguidas por pruebas de integración y finalmente pruebas de usuario en condiciones reales de trabajo.
Se utilizará un entorno similar al de producción, que incluirá el hardware necesario y la infraestructura de red configurada de acuerdo con los requerimientos de Helacor SA.
Cada miembro del equipo de testing tendrá asignadas tareas específicas según los casos de prueba y su experiencia en el sistema, para maximizar la eficiencia y precisión del proceso.
5	EJECUCIÓN DEL TESTING
Cada funcionalidad será probada con antelación para garantizar su correcto funcionamiento. Esto incluye la entrada de datos de producción, la emisión de informes, etc.
También se evaluará la integración entre el sistema y SAP, verificando que los datos fluyan correctamente y que los procesos de intercambio de información se realicen sin errores.
Los operadores y supervisores utilizarán el sistema en un entorno controlado para simular situaciones reales de producción. Esta etapa permitirá obtener retroalimentación sobre la usabilidad y la eficiencia de las operaciones.
6	DOCUMENTACIÓN DEL RESULTADO
Cada caso de prueba se documentará, indicando lo que ha pasado o fallado y proporcionando detalles sobre cualquier incidencia observada.
Se generará un informe que detallará los errores identificados y sus respectivas soluciones o recomendaciones para ajustes en el sistema.
Y habrá un informe final de pruebas consolidado que resumirá los resultados generales de todas las pruebas, los errores corregidos y cualquier sugerencia para mejorar el funcionamiento del sistema en el entorno de producción.


--------IMPLEMENTACIÓN:
Es la fase del proyecto en la que se lleva a cabo la instalación y configuración del sistema "Grido Tech Advance" en la planta de producción de Helacor S.A. Incluye la integración de la aplicación con el entorno físico y digital, la migración de los datos desde los archivos Excel a la nueva plataforma, la puesta en funcionamiento del software en los equipos de la planta y la capacitación de los usuarios para asegurar su correcto uso.
1	FORMACIÓN O CAPACITACIÓN PARA LA IMPLEMENTACIÓN
Se realizará una capacitación completa del personal involucrado en la operación del nuevo sistema. Esta formación se dividirá en dos niveles:
Nivel Operativo: Dirigido a operarios y encargados de turno, donde se les enseñará cómo registrar los datos de producción en el sistema y cómo utilizar las nuevas interfaces en lugar de las planillas Excel.
Nivel Administrativo y de Supervisión: Para jefes de producción y personal administrativo, donde se abordará la integración con SAP y cómo realizar el seguimiento y control de los datos desde la plataforma.
2	PREPARACIÓN DE LA INSTALACIÓN
Antes de la instalación del sistema, se realizarán las siguientes actividades:
Revisión de infraestructura: Verificar que los equipos cumplan con las especificaciones técnicas necesarias (compatibilidad con el sistema operativo Windows 10 Pro, capacidad de memoria y procesamiento).
Configuración del entorno de red: Verificar que la red Wi-Fi, los interruptores y los puntos de acceso estén configurados adecuadamente para soportar la conectividad del sistema.
Pruebas preliminares: Realizar pruebas en un entorno de desarrollo para garantizar que el sistema funcione correctamente antes de la instalación en la planta.
3	REALIZACIÓN DE LA INSTALACIÓN
La instalación del sistema se hará siguiendo los siguientes pasos:
Instalación del software en las estaciones de trabajo: El sistema será instalado en los 16 equipos que se utilizarán en la planta de producción.
Configuración de la base de datos: Se configurará la base de datos en SQL Server para almacenar la información de producción y permitir la integración con SAP.
Integración con SAP: Se realizarán las conexiones necesarias para que los datos de producción ingresen automáticamente al sistema SAP.
4	PRUEBA DE ACEPTACIÓN:
Una vez instalado el sistema, se realizará una prueba de aceptación para garantizar que cumple con los requerimientos establecidos y funciona correctamente. Lo que incluye:
Pruebas funcionales: Verificar que todas las funcionalidades del sistema operen como se espera, incluyendo el registro de producción, el manejo de inventarios y la integración con SAP.
Pruebas de rendimiento: Asegurar que el sistema sea capaz de manejar la carga de trabajo de la planta sin afectar la productividad.
Pruebas de usuario: Los operarios y encargados utilizarán el sistema durante un período de prueba bajo supervisión para identificar posibles errores o dificultades.

Evaluación y ajuste:
Durante la fase de prueba, se recopilará retroalimentación del personal que utilizará el sistema para evaluar su funcionalidad y facilidad de uso. A partir de esta retroalimentación, se realizarán modificaciones y mejoras necesarias antes de proceder con la implementación completa.
Corrección de Errores: Se abordarán los problemas identificados durante las pruebas para garantizar un funcionamiento adecuado del sistema.
Optimización del Sistema: Se harán ajustes destinados a incrementar la velocidad y mejorar la eficiencia en las operaciones diarias.


---------DIAGRAMAS DE TRANSICION DE ESTADOS:
ALMACEN DE PRODUCCION (PRODUCTION STORE): El diagrama representa el flujo del proceso en la clase ProductionStore , comenzando con la recepción de una solicitud. Una vez recibida, se procede a la evaluación del material. Si el material no es aprobado, se descarta; en cambio, si es aprobado, se transfiere y posteriormente sale del sistema. El proceso concluye con la salida del material o su descarte, representado por el nodo final del diagrama.
ORDENES DE TRABAJO (WORK ORDERS): El diagrama muestra el flujo de estados en la clase Work.Orders.Status , iniciando cuando se declara una orden de trabajo como Pendiente . Luego, el trabajo comienza y pasa al estado En Proceso . Una vez completada, la orden se marca como Finalizado . Alternativamente, si la orden es cancelada en cualquier momento, pasa al estado Cancelado , donde finaliza el proceso.
PRODUCCION: El diagrama representa el flujo de estados en la clase Production , iniciando cuando se declara la producción en estado En espera . Luego, cuando comienza la producción, pasa al estado En Producción . Finalmente, una vez que el proceso se completa, la producción alcanza el estado Completado , concluyendo así el flujo del proceso.


---------ESTUDIO DE FACTIBILIDAD:
1	FACTIBILIDAD TÉCNICA
La organización cuenta con una PC de escritorio con los siguientes componentes: Microprocesador Intel (R) Core (TM®3-7100 CPU @390GHZ, memoria RAM 4GB, Sistema operativo Windows 10 Pro de 64 bits. También posee una impresora, una red WI-FI y prestadora de servicios de server.
En el momento de la implementación del sistema nos vemos con la ventaja de disponer con los recursos de equipamientos y humanos, ya que la empresa posee de un área de sistemas. Este panorama nos beneficia al momento de analizar la posibilidad de realizar la instalación del nuevo sistema.
2	FACTIBILIDAD ECONÓMICA
Al haber realizado el relevamiento de los recursos tecnológicos, se puede decir que a la empresa no deberá generar ningún tipo de gasto en equipamiento, sin embargo, si abra impacto en gasto de desarrollo del sistema y su diseño, también en la conversión donde se prepara la carga inicial de datos, instalación y horas de capacitación al personal correspondiente.
Ya implementado se generará un óptimo resultado en la gestión de información. Si bien no se verá una retribución económica directa, la fiabilidad y veracidad de la información podría evitar multas o sanciones ante una auditoria de entes reguladores (SENASA, HACCP, ISO)
3	FACTIBILIDAD OPERATIVA
El personal de la empresa deberá ser capacitado para el manejo del nuevo sistema. Se llevará a cabo por áreas intervinientes.
Al jefe de producción, se lo formará de manera más general y abarcando todos los módulos existentes para que se encargue de su correcto funcionamiento.
Será necesario una capacitación extensa ya que el sistema es completamente nuevo y debe adaptarse a la forma de trabajo actual.
El líder de producción deberá ser entrenado específicamente ya que el sistema nuevo le permitirá dejar de lado la registración manual de datos, realizando el proceso de carga, emisión y control de informes de manera automatizada.


----------IMPULSOS:
1	PROBLEMAS.
La empresa actualmente tiene un sistema de declaración de avances en Excel, el cual permite registrar los semielaborados y productos terminados que se fabrican en las diferentes líneas. Este proceso demanda una carga operativa importante, como también existen en algunos casos problemas de persistencia de la información.
2	NECESIDADES.
A partir de esta problemática, surge la necesidad de desarrollar e implementar un sistema de información web o desktop, que permita mejorar la declaración de avances. Cuyo fin es la reducción del tiempo de carga, integración de información con el MRP SAP y permitiendo el costeo por elaboración de semielaborados y productos terminados.
3	OPORTUNIDADES DEL SISTEMA.
Ante los problemas detallados en los puntos anteriores surge la oportunidad de implementar un sistema que se encargue de gestionar estos procesos en forma sistematizada.

---------PROPUESTA:
1	OBJETIVO
Implementar un sistema de información con el objetivo de resolver el piso de planta, como son la declaración de avances, la generación de lotes de producción y la integración de información para el costeo en SAP.
Esta idea consiste en perfeccionar el análisis de costo de fabricación, que hoy se realiza de forma general al final de cada mes, donde se podrá saber el valor de cada semielaborado y producto fabricado durante el ejercicio, así se podrá obtener un costo final de producto de manera efectiva. La idea es reemplazar los actuales archivos Excel de registros digitales, por una aplicación web o desktop que permita simplificar el proceso de carga y automatizar integración de los registros de avances en SAP. Con el reemplazo del Excel se pretende optimizar los tiempos de carga manual de la información, como así también reducir los errores inherentes a la carga operativa, logrando que los mismos sean precisos en tiempo y forma.
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
    

    // CAMBIO 1: Minimizar el chatbot apenas cargue la página
    const chatContent = chatContainer.querySelector('.chat-content');
    chatContainer.classList.add('minimized');
    chatContent.style.display = 'none';
    
    // CAMBIO 2: Actualizar el ícono del botón de toggle para mostrar "Maximizar"
    if (toggleButton) {
        toggleButton.innerHTML = '<i class="zmdi zmdi-chevron-up"></i>';
        toggleButton.setAttribute('title', 'Maximizar');
    }


    // Historia de conversación para mantener contexto en la interfaz
    let conversationHistory = [];
    
    // Inicializar con mensaje de bienvenida
    if (!chatMessages.querySelector('.bot-message')) {
        addMessageToChat('bot', 'Hola, soy Robot Grido. ¿En qué puedo ayudarte hoy?');
    }
    
    // Manejar el botón de minimizar/maximizar
    // Manejar el botón de minimizar/maximizar
toggleButton.addEventListener('click', function() {
    chatContainer.classList.toggle('minimized');
    const chatContent = chatContainer.querySelector('.chat-content');
    
    // Añadir esta lógica para mostrar/ocultar el contenido
    if (chatContainer.classList.contains('minimized')) {
        chatContent.style.display = 'none';
        toggleButton.innerHTML = '<i class="zmdi zmdi-chevron-up"></i>';
        toggleButton.setAttribute('title', 'Maximizar');
        
        // Si está en modo expandido, salir de ese modo primero
        if (chatContainer.classList.contains('expanded')) {
            chatContainer.classList.remove('expanded');
            chatOverlay.classList.remove('visible');
            expandButton.querySelector('i').classList.remove('zmdi-fullscreen-exit');
            expandButton.querySelector('i').classList.add('zmdi-fullscreen');
        }
    } else {
        chatContent.style.display = 'flex'; // IMPORTANTE: mostrar el contenido
        toggleButton.innerHTML = '<i class="zmdi zmdi-chevron-down"></i>';
        toggleButton.setAttribute('title', 'Minimizar');
    }
});
    
// Añadir evento para abrir el chatbot al hacer click en cualquier parte de él cuando está minimizado
chatContainer.addEventListener('click', function(e) {
    // Si el chatbot está minimizado y el clic no fue en el botón de toggle
    if (chatContainer.classList.contains('minimized') && 
        e.target !== toggleButton && 
        !toggleButton.contains(e.target)) {
        
        // Expandir el chat
        chatContainer.classList.remove('minimized');
        const chatContent = chatContainer.querySelector('.chat-content');
        chatContent.style.display = 'flex'; // IMPORTANTE: mostrar el contenido
        
        // Actualizar el ícono
        toggleButton.innerHTML = '<i class="zmdi zmdi-chevron-down"></i>';
        toggleButton.setAttribute('title', 'Minimizar');
    }
});
    
    // Manejar el botón de expandir/contraer (pantalla completa)
expandButton.addEventListener('click', function() {
    chatContainer.classList.toggle('expanded');
    chatOverlay.classList.toggle('visible');
    const chatContent = chatContainer.querySelector('.chat-content');
    
    // Asegurar que no esté minimizado y que el contenido sea visible
    if (chatContainer.classList.contains('minimized')) {
        chatContainer.classList.remove('minimized');
        chatContent.style.display = 'flex'; // IMPORTANTE: mostrar el contenido
        toggleButton.innerHTML = '<i class="zmdi zmdi-chevron-down"></i>';
        toggleButton.setAttribute('title', 'Minimizar');
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