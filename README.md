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
