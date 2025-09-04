# Nexdom Edge BFF (Home Assistant Add-on)

Este repositorio contiene el add-on `nexdom_edge_bff` para Home Assistant OS.

## Instalación del repositorio de add-ons en HAOS

- En Home Assistant, ve a `Settings` → `Add-ons` → `Add-on Store`.
- Pulsa en el menú de tres puntos (arriba a la derecha) → `Repositories`.
- Agrega la URL Git de este repositorio.
- Debería aparecer el add-on "Nexdom Edge BFF" en la tienda.
- Instálalo, revisa las `Configuration` options, inicia (`Start`) y abre la Web UI (Ingress).

## Función

- Provee un BFF (Node.js + Express + TypeScript) que accede a Home Assistant Core vía Supervisor API.
- Sirve una UI estática (React + Vite + Tailwind) dentro del add-on en el puerto 8099 e Ingress.

Consulta `ha-addons/nexdom_edge_bff/README.md` para más detalles.

