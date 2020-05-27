# SimpleMMO-bot
SimpleMMO bot en js con Tampermonkey

Lo dispuesto en este repo son archivos js para automatizar ciertas tareas en el juego SimpleMMO (https://web.simple-mmo.com/). El bot hace uso de cookies para guardar ciertos datos.

Instalación para cada bot:
Descargar la extensión Tampermonkey (https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
Crear un script nuevo y pegar el contenido del script correspondiente dentro de este repo.
Eso es todo. La primera vez que se ejecute el bot le preguntará al usuario si quiere activarlo.
Funciones disponibles para todos los bots (para ejecutarlas acceder a la consola en herramientas del desarrollador):
window.SMMObotStop(0) => Deshabilita el bot.
window.SMMObotStart(0) => Habilita el bot.

-Usos y funcionalidades:

* Travel bot:
Clickea cada cierto tiempo random el botón para caminar. Se usaron promesas en vez de setTimeInterval para poder variar el tiempo entre clickeos (e intentar así evitar ser detectado por el servidor)
Si está activado, se ejecuta automáticamente cuando se cargue la pantalla de travel (https://web.simple-mmo.com/travel)


* 50-50 bot:
Usa la estrategia más simple frente a una apuesta 50/50: la martingala. Si pierde apuesta el doble de lo perdido hasta que gane.
Al igual que el travel bot, la apuesta se hace luego de un tiempo random de la carga de la pantalla.
Si está activado, se ejecuta automáticamente cuando se cargue la pantalla de apuesta (https://web.simple-mmo.com/gamecentre/5050)
Funciones disponibles:
window.SMMObotBet(1) => Setea la apuesta base al nro recibido. Por defecto es 1.
