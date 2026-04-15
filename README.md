# Sistema Offline de Registro de Clientes

## Descripción
Este proyecto consiste en un sistema web offline-first diseñado para el registro de clientes en entornos con conectividad limitada o inexistente. La aplicación permite capturar datos en campo y sincronizarlos posteriormente con un servidor central.

## Problema identificado
En eventos masivos, donde hay una gran cantidad de personas, la señal de internet suele volverse inestable o incluso dejar de funcionar debido a la saturación de las redes móviles. Además, en muchos casos no se cuenta con acceso a WiFi, lo que dificulta el uso de sistemas web tradicionales y puede provocar pérdida de información.

## Solución
Se propone un sistema web que permite registrar datos sin conexión a internet, almacenarlos localmente en el navegador y sincronizarlos posteriormente con un servidor cuando se restablece la conexión.

## Arquitectura
El sistema está compuesto por:
- Interfaz web (Frontend)
- Service Worker (caché y funcionamiento offline)
- IndexedDB (almacenamiento local)
- Módulo de sincronización
- API REST
- Base de datos central

## Tabla de Contenidos

- [Requerimientos](#requerimientos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [Contribución](#contribución)
- [Roadmap](#roadmap)

## Requerimientos

### Servidores
- Navegador web moderno (Chrome, Edge, Firefox)
- Servidor backend con API REST (para sincronización)
- Base de datos central (MySQL o similar)

### Paquetes adicionales
- Git
- Node.js (opcional para servidor local)
- CodeKit (compilación de SCSS a CSS)

### Versiones
- Node.js v18 o superior
- Navegador con soporte para Service Workers

El proyecto utiliza tecnologías frontend como HTML, SCSS y JavaScript, compiladas mediante herramientas como CodeKit.

## Instalación

### Clonar repositorio
```bash
git clone https://github.com/FurtherPanda/offline-client-registration-system.git
cd offline-client-registration-system
```

Ejecutar en entorno local

El proyecto puede ejecutarse directamente abriendo el archivo index.html en un navegador.

También se puede utilizar un servidor local:

npx serve .
Pruebas manuales
Abrir la aplicación en el navegador
Desactivar la conexión a internet
Registrar un cliente mediante el formulario
Verificar que los datos se guardan localmente
Activar la conexión a internet
Ejecutar la sincronización
Verificar que los registros cambian a estado sincronizado


## Configuración

### Configuración del sistema
El sistema utiliza configuración dinámica basada en la URL para determinar el evento y el endpoint de sincronización.

El endpoint de la API se define dentro del código JavaScript y puede modificarse según el entorno.

### Configuración de datos
- Los datos de estados y municipios se cargan desde archivos JSON
- El almacenamiento local se gestiona mediante IndexedDB
- Los registros se almacenan temporalmente hasta su sincronización

### Configuración de recursos
- Los recursos estáticos (HTML, CSS, JS, imágenes) son gestionados mediante Service Worker
- El sistema utiliza caché para permitir funcionamiento offline

## Uso

### Usuario final

1. Acceder a la aplicación desde el navegador  
2. Capturar los datos del cliente en el formulario  
3. Guardar el registro  
4. Visualizar los registros almacenados  
5. En caso de no tener conexión, los datos se almacenarán localmente  
6. Cuando haya conexión disponible, presionar el botón de sincronización  

---

### Usuario administrador

1. Acceder al sistema backend o API  
2. Consultar los registros sincronizados  
3. Validar la información recibida  
4. Gestionar la base de datos de clientes  

## Contribución

Para contribuir al proyecto, seguir los siguientes pasos:

1. Clonar el repositorio
```bash
git clone https://github.com/TU-USUARIO/offline-client-registration-system.git
cd offline-client-registration-system
```

Crear un nuevo branch a partir de develop
git checkout develop
git checkout -b feature/nueva-funcionalidad
Realizar los cambios necesarios en el código
Hacer commit de los cambios
git add .
git commit -m "feat: descripción de la funcionalidad"
Subir el branch al repositorio
git push origin feature/nueva-funcionalidad
Crear un Pull Request hacia la rama develop
Esperar revisión y aprobación para hacer merge

## Contribución

Para contribuir al proyecto:

1. Clonar el repositorio  
2. Crear un nuevo branch a partir de develop  
3. Realizar los cambios necesarios  
4. Hacer commit de los cambios  
5. Subir el branch al repositorio  
6. Crear un Pull Request hacia la rama develop  
7. Esperar revisión para su integración  

## Roadmap

Futuras mejoras del sistema:

- Implementación de autenticación de usuarios  
- Desarrollo de panel administrativo  
- Generación de reportes avanzados  
- Integración con sistemas externos (CRM)  
- Optimización del proceso de sincronización  
