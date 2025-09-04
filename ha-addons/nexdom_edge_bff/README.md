# Nexdom Edge BFF Add-on

Add-on que integra un BFF (Node + TS) y una UI (React + Vite + Tailwind) para Home Assistant mediante Supervisor API.

## Características

- Endpoints REST: `/api/ping`, `/api/states`, `/api/schema/auto`, `/api/act`, `/api/events` (SSE), `/api/camera_proxy`.
- Redacción/filtrado de atributos sensibles (sin PII: sin `friendly_name`, MAC/SSID, etc.).
- UI autogenerada por dominios (Inicio/Luces/Clima/Seguridad/Cortinas/Sensores/Cámaras/Energía) según `options.features`.
- Theming dinámico vía CSS variables (sin rebuild) desde `options.theme`.

## Configuración (options)

```json
{
  "features": {
    "lights": true,
    "climate": true,
    "security": true,
    "covers": true,
    "sensors": true,
    "cameras": true,
    "energy": true
  },
  "theme": {
    "primary": "#3b82f6",
    "radius": "0.75rem",
    "logo_url": ""
  },
  "mappings": {}
}
```

## Puertos / Ingress

- Expone internamente el puerto `8099` y usa `ingress` para la Web UI.

## Desarrollo rápido (referencial)

- El `Dockerfile` instala Node y compila server+ui.
- `run.sh` inicia el servidor Node con `SUPERVISOR_TOKEN`, `PORT=8099` y `UI_DIST=/opt/nexdom/ui`.

