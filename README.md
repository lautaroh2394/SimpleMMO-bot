# SimpleMMO-bot
## SimpleMMO bot en js con Tampermonkey

Más abajo indiqué como usar cada bot por separado, lo más piola es tener una sola pestaña usando un bot con todo integrado, lo cual describo a continuación. Al correr todo en la misma página y no necesitar guardar info, ya no se usan cookies

En Tampermonkey crean un nuevo script, copypastean lo del archivo "full bot.js" y guardan. Cargan el home del juego (https://web.simple-mmo.com) y un popup de alerta les preguntará si quieren activar el bot. Le dan ok y listo.

Este bot usa las siguientes configuraciones por defecto:

	-Automáticamente generará y atacará a un npc cada 10 min
	
	- Automáticamente intentará realizar la quest 144 (Learn a martial art). Se puede cambiar el id por consola: 
```
	BOT_MODE.config.quest.quest_id= [id nuevo]
```

	- Si el total de oro es mayor a 250k, depositará el excedente automáticamente cada 3 minutos.

	- Apostará constantemente en 50/50 usando una martingala

Próximamente implementaré travel.

### Sobre las configuraciones:
Para iniciar el bot se selecciona 'ok' en el popup inicial o en la consola ingresan:
"startBot(config)", donde config es un json con la siguiente estructura:
```
{
    BATTLE: true/false,
    BET: true/false,
    JOB: false, //Aún no implementado
    QUEST: true/false,
    TRAVEL: false, //Aún no implementado
    autodeposit: true/false,
		interval: 1, //Aún no implementado. La idea es alternar cada [interval] minutos entre JOBS y BATTLE/QUEST/TRAVEL
    config: {
        autodeposit: { 
            time: 180000,
            max_gold: 250000 
            },
        bet: { 
            factor: 2.15, //Por cuanto multiplica la apuesta siguiente si la actual fue perdida.
            limite: 250000, //Limite de apuesta
            "max-loses": 12​​ //Para calcular la apuesta inicial tengo en cuenta el limite y el 'max-loses' para poder perder hasta ('max-loses' - 1) veces seguidas y en la siguiente recuperar.
            parallel_bets: 1 //Cantidad de 'hilos' de apuestas. Cuantos más hayan, más probable es que responda 'raro' el server
        },
        quest: { 
            quest_id: 144 //Id de la quest a autocompletar
            }​
    }
}
```
### TODO's
- Implementar travel
- Implementar jobs
- Implementar una alternancia entre solo hacer jobs y ejecutar quests/battle/travel
- Refactorear código. Está asqueroso.
------------------------------

## Bots por separado:

Lo dispuesto en este repo son archivos js para automatizar ciertas tareas en el juego SimpleMMO (https://web.simple-mmo.com/). El bot hace uso de cookies para guardar ciertos datos.

### Instalación para cada bot:
Descargar la extensión Tampermonkey (https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/).

Crear un script nuevo y pegar el contenido del script correspondiente dentro de este repo.

Eso es todo. La primera vez que se ejecute el bot le preguntará al usuario si quiere activarlo.

Funciones disponibles para todos los bots (para ejecutarlas acceder a la consola en herramientas del desarrollador):

- window.SMMObotStop(0) => Deshabilita el bot.
- window.SMMObotStart(0) => Habilita el bot.

-Usos y funcionalidades:

### Travel bot:
Clickea cada cierto tiempo random el botón para caminar. Se usaron promesas en vez de setTimeInterval para poder variar el tiempo entre clickeos (e intentar así evitar ser detectado por el servidor)
Si está activado, se ejecuta automáticamente cuando se cargue la pantalla de travel (https://web.simple-mmo.com/travel)


### 50-50 bot:
Usa la estrategia más simple frente a una apuesta 50/50: la martingala. Si pierde apuesta el doble de lo perdido hasta que gane.
Al igual que el travel bot, la apuesta se hace luego de un tiempo random de la carga de la pantalla.
Si está activado, se ejecuta automáticamente cuando se cargue la pantalla de apuesta (https://web.simple-mmo.com/gamecentre/5050)

Funciones disponibles:
- window.SMMObotBet(1) => Setea la apuesta base al nro recibido. Por defecto es 1.

