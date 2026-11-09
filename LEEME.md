# Bolsillo Chori - PWA (se instala desde el navegador)

Archivos: `index.html`, `manifest.webmanifest`, `sw.js`, carpeta `icons/`. Subelos TODOS juntos a la misma carpeta de tu subdominio.

## Requisitos
- Debe abrirse por **https** (con certificado SSL). Sin https no se puede instalar ni funciona sin internet.
- Los archivos deben quedar en la misma carpeta (ej. `https://app.tuemisora.com/index.html`).

## Instalar en el telefono
- Android (Chrome): abre la direccion -> menu ⋮ -> "Instalar aplicacion" / "Agregar a pantalla de inicio".
- iPhone (Safari): boton Compartir -> "Agregar a pantalla de inicio".

## Cuando cambies index.html
Abre `sw.js` y cambia el numero de `VERSION` (ej. `bc-9f98a621` -> `bc-v2`). Asi los telefonos descargan la version nueva.
La pagina busca la version nueva cada vez que hay internet.

## Limites que debes saber
- Los datos se guardan en el navegador de CADA telefono. NO hay sincronizacion entre aparatos.
- Si el usuario borra los datos del navegador o desinstala la app, se pierden: por eso el boton "Descargar respaldo ahora".
- Los reportes PDF cargan su libreria desde internet; la primera vez que se abre con internet queda guardada para uso sin conexion.
