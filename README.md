Asegúrate de tener Node.js y npm (o yarn/pnpm) instalados. Puedes descargarlos desde nodejs.org.

Descarga el código del proyecto a tu máquina local (como mencionamos antes, a través de Git o una opción de descarga de Firebase Studio).

Abre una terminal o línea de comandos en la carpeta raíz del proyecto (donde se encuentra el archivo package.json).

Instala las dependencias del proyecto:

npm install
o si usas Yarn:

yarn install
o si usas PNPM:

pnpm install
Ejecuta el servidor de desarrollo de Next.js: Este comando iniciará la aplicación web.

npm run dev
Según tu package.json, esto correrá la aplicación en http://localhost:9002.

Ejecuta el servidor de desarrollo de Genkit (en otra terminal): Si vas a utilizar las funcionalidades de IA que usan Genkit, necesitarás iniciar también el servidor de Genkit. Abre una nueva terminal en la misma carpeta del proyecto y ejecuta:

npm run genkit:dev
o si prefieres que se reinicie automáticamente con los cambios en los flujos de Genkit:

npm run genkit:watch
En resumen:

Terminal 1: npm install (solo la primera vez) y luego npm run dev
Terminal 2: npm run genkit:dev (o genkit:watch)

Con estos dos servidores en ejecución, deberías poder acceder a tu aplicación MVP-Estudio-Sanchez en el navegador (usualmente en http://localhost:9002) y las funciones de IA deberían estar operativas.
