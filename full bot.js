// ==UserScript==
// @name         SimpleMMO Full Bot
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  
// @author       LH
// @match        https://web.simple-mmo.com/
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener("load",()=>{
        window.getRandomTimeout = ()=>{
            return parseInt((1.5 + Math.random(Math.sqrt(Math.sqrt(Date.now())))*2 + Math.random(Math.sqrt(Date.now()))*3)*1000);
        }

        window.getTimeHHSS = ()=>{
            let d = new Date();
            return `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
        }

        const sanitizeOpts = mode=>{
            //Default configs:
            const config = {
                bet:{
                    "max-loses" : 15,
                    "bet-value" : 1,
                    "factor" : 2.1,
                    "limite" : 250000,
                    "parallel_bets" : 3
                },
                battle:{},
                autodeposit:{
                    time: 3*60*1000, //tiempo en milisegundos. Por defecto cada 3 min.
                    max_gold: 250000
                },
                quest:{
                    quest_id: 141
                },
                valid:{
                    "JOB": true,
                    "BET": true,
                    "TRAVEL":true,
                    "QUEST":true,
                    "BATTLE":true,
                    "interval":true,
                    "autodeposit":true
                }/*,
                function:{
                    "JOB": startJOB,
                    "BET": startBET,
                    "TRAVEL":startTRAVEL,
                    "QUEST":startQUEST,
                    "BATTLE":startBATTLE,
                    "interval":startInterval,
                    "autodeposit":startAutodeposit
                }*/
            }

            if (mode["default"]){
                let defaultOpts = {
                    "JOB": false,
                    "BET": true,
                    "TRAVEL":false,
                    "QUEST":true,
                    "BATTLE":true,
                    "interval":0,
                    "autodeposit":true,
                    "config":config
                }
                defaultOpts["interval"] = mode["interval"] ? mode["interval"] : 1;
                return defaultOpts;
            }

            let opts = {};
            const FUNCS = [{
                name: "JOB",
                default: false
            },
            {
                name: "BET",
                default: false
            },
            {
                name: "TRAVEL",
                default: false
            },
            {
                name: "QUEST",
                default: false
            },
            {
                name: "BATTLE",
                default: false
            },
            {
                name: "interval",
                default: 0
            },
            {
                name: "config",
                default: config
            },
            {
                name: "autodeposit",
                default: false
            }]

            FUNCS.forEach(func=>{
                opts[func.name] = mode[func.name] ? mode[func.name] : func.default;
            })

            return opts;
        }

        const startAll = ()=>{
            BOT_MODE["JOB"] && startJOB();
            BOT_MODE["BET"] && startBET();
            BOT_MODE["TRAVEL"] && startTRAVEL();
            BOT_MODE["QUEST"] && startQUEST();
            BOT_MODE["BATTLE"] && startBATTLE();
            BOT_MODE["autodeposit"] && startAutodeposit();
            BOT_MODE["interval"] && (window.BOT_JOB_STATUS = false) && startInterval();

        }

        window.startBot = (mode = {default: true}) => {
            /* Mode es un json con las siugientes keys:
            JOB: Booleano. True: trabajará constantemente
            BET: Booleano. True: apostará en 50/50 constantemente
            TRAVEL: Booleano. True: hará steps constantemente
            QUEST: Booleano. True: hará quests constantemente
            BATTLE: Booleano. True: atacará npc's constantemente
            default: Booleano. True: Todos los anteriores en true.
            interval: Integer. En caso de default o todas las keys en true, se harán [interval] jobs, y luego [interval*10] minutos de TRAVEL, QUEST, BATTLE. BET nunca se detendrá. Defecto: 1 (10 min trabajo, 10 min resto, y asi sucesivamente)
            autodeposit: Booleano. True: autodepositará cada x tiempo si el total oro es mayor a y. En objeto config se espeicfican estos campos.
            */
            if (window.ALREADY_CONFIGURED) {window.BOT_MAIN_STATUS = "running"; startAll(); return;}
            if (!window.ALREADY_CONFIGURED){
                window.BOT_MODE = sanitizeOpts(mode);
                window.BOT_MAIN_STATUS = "running";
                window.ALREADY_CONFIGURED = true;
            }
            
            startAll();
        }

        window.autodeposit = async ()=>{
            let c = await getCurrentGold()
            if (c > BOT_MODE.config.autodeposit.max_gold){
                deposit(c - BOT_MODE.config.autodeposit.max_gold);
            }
        }

        window.startAutodeposit = ()=>{
            console.log("Autodeposit iniciado...");
            setInterval(window.autodeposit, BOT_MODE.config.autodeposit.time)
        }

        window.deposit = async (gold)=>{
            try{
                console.log("Depositando " + gold.toString() + "..." );
                let formdata = new FormData();
                formdata.append("_token",await getToken());
                formdata.append("GoldAmount",gold.toString());
                fetch("https://web.simple-mmo.com/bank/deposit/submit",{method:"post",body:formdata}).then(r=>{
                    if (r.status == 200){
                        console.log("Depositados " + gold.toString());
                    }else{
                        console.log("error al depositar, status != 200",r );
                    }
                }).catch(e=>{
                    console.log("error al depositar, catch", e );
                })
            }
            catch(e){
                console.warn("Error al intentar depositar", e);
            }
        }

        window.stopBot = ()=>{
            BOT_MAIN_STATUS = "stopped";
            console.log("deteniendo procesos...")
        }

        const getCurrentGold = async (doc)=>{
            if (!doc){
                let docHome = await fetch("https://web.simple-mmo.com/home");
                doc = await docHome.text();
            }
            let currentGold = $(doc.match(/<span [^>]* id="current_gold">[^<]*<\/span>/)[0])[0].textContent;
            currentGold = parseInt(currentGold.replace(/,/,""))
            return currentGold
        }

        const getToken = async ()=>{
            let req = await fetch("https://web.simple-mmo.com/gamecentre/5050");
            let doc = await req.text();
            let token = doc.match(/<input type="hidden" name="_token" value=".{40}">/)[0].match(/value=".{40}"/)[0].split("=")[1].replace(/"/g,"");
            return token;
        }

        const getCurrentEnergy = async (doc)=>{
            if (!doc){
                let docHome = await fetch("https://web.simple-mmo.com/home");
                doc = await docHome.text();
            }
            let currentEnergy = $(document.body.innerHTML.match(/<span id="current_energy">\d<\/span>/)[0])[0].textContent;
            currentEnergy = parseInt(currentEnergy.replace(/,/,""));
            return currentEnergy
        }

        window.startBET = async ()=>{
            const nextBet = async (anteriorGanada = true, currentGold, perdidaAnterior)=>{
                if (!currentGold){
                    currentGold = await getCurrentGold();
                }
                let totalOro = currentGold > BOT_MODE.config.bet.limite ? BOT_MODE.config.bet.limite : currentGold;
                let maxLoses = BOT_MODE.config.bet["max-loses"];
                let factor = BOT_MODE.config.bet["factor"];
                let bet = parseInt( totalOro / Math.pow(factor,maxLoses) );
                bet = bet > 0 ? bet : 1;
                if (anteriorGanada) {return bet;}
                else{
                    let aux = parseInt(perdidaAnterior * factor);
                    bet = aux > BOT_MODE.config.bet.limite ? bet : aux; //Si la apuesta supera el máximo, asumo la perdida y empiezo de nuevo
                    return bet > 0 ? bet : 1;
                }
            }

            const fetchBet = async (amount, anteriorGanada, indice,totalAnterior) => {
                if ( ((BOT_MODE["interval"] && window.BOT_JOB_STATUS) || window.BOT_MAIN_STATUS == "stopped") && anteriorGanada){
                    console.log("detenido bot apuestas (" + indice + ")");
                    return;
                }

                let formdata = new FormData();
                formdata.append("_token",await getToken());
                formdata.append("GoldAmount",amount);
                fetch("https://web.simple-mmo.com/gamecentre/5050/action",{method:"post",body:formdata})
                .then(async rta=>{
                    let tabs= (new Array(indice)).fill("\t").join("")
                    let doc = await rta.text();
                    let currentGold = await getCurrentGold(doc)
                    let anteriorGanada = !!(doc.match(/<div class="notice notice\-success"/))
                    let anteriorPerdida = !!(doc.match(/<div class="notice notice\-danger"/))
                    
                    //En caso que me devuelva la pantalla de apuesta sin la indicación, asumo que perdí.
                    if (!((anteriorGanada && !anteriorPerdida)||(!anteriorGanada && anteriorPerdida))){console.log(tabs + indice + "- error raro. asumo perdida")}
                    
                    let logtext = ((anteriorGanada && !anteriorPerdida) ? (indice + "- ganados " +  (2*amount).toString()) : (indice + "- perdidos " +  amount)) + ". Total oro: " + currentGold ;
                    //rgb(26, 138, 45)
                    let color = (anteriorGanada && !anteriorPerdida) ? ('color: #1a8a2d') : ('color: #d1de0e');
                    
                    let nb = await nextBet(anteriorGanada,currentGold,amount);
                    let rnd = getRandomTimeout();
                    
                    console.log(tabs + '%c' + logtext + "- apostando " + nb + " en " + (rnd/1000).toString() + ` segundos. (logged at ${getTimeHHSS()})`, color);
                    setTimeout(_=>{
                        fetchBet(nb, anteriorGanada, indice, currentGold);
                    }, rnd);
                })
            }
            let nb = await nextBet();
            (new Array(BOT_MODE.config.bet.parallel_bets)).fill(0).forEach((e,i)=>{
                fetchBet(nb,true,i);
            })
        }

        const getGenerateNPCToken = async ()=>{
            let r = await fetch("https://web.simple-mmo.com/battlearena");
            let doc = await r.text();
            let token_meta = doc.match(/<meta name="csrf-token" content=".{40}">/)[0]
            let token = $(token_meta)[0].content;
            return token;
        }
        const generateNPC = async ()=>{
            let token = await getGenerateNPCToken();
            let fd = new FormData();
            fd.append("_token",token);
            let r = await fetch("https://web.simple-mmo.com/api/battlearena/generate",{
                method:"post",
                body:fd
            })
            let r_json = await r.json();
            let id = r_json.id;
            return id;
        }

        const attackNPCToken = async (id)=>{
            let r = await fetch(`https://web.simple-mmo.com/npcs/attack/${id}`);
            let doc = await r.text();
            let token_meta = doc.match(/<meta name="csrf-token" content=".{40}">/)[0]
            let token = $(token_meta)[0].content;
            return token;
        }

        const attackNPC = (id,token)=>{
            return fetch(`https://web.simple-mmo.com/npcs/attack/api/${id}`,{
                method:'post',
                body:{'_token': token,'special_attack': "false"}
            }).then(async r=>{
                if (r.status == 200){
                    let data = await r.json();
                    if (!data.they_are_dead){
                        setTimeout(_=>attackNPC(id,token),getRandomTimeout());
                    }
                    else{
                        console.log(`%c npc matado. ${data.their_death.match(/\d{0,10} experience/)[0]}`,'color: #7a0882')
                        //return startBATTLE();
                    }

                }
            })
        }

        window.startBATTLE = ()=>{
            BOT_MODE.config.battle.interval =  setInterval(_=>BATTLE(),1000*60*10);
        }
        window.BATTLE = async (callNext = false)=>{
            if ( ((BOT_MODE["interval"] && window.BOT_JOB_STATUS) || window.BOT_MAIN_STATUS == "stopped" || !BOT_MODE.BATTLE)){
                console.log("detenido bot battalla npcs");
                return;
            }
            try{
                console.log(`%c intentando generar npc...`,'color: #7a0882')
                let currentEnergy = await getCurrentEnergy();
                if (currentEnergy > 0){
                    let id = await generateNPC();
                    let token = await attackNPCToken(id);
                    setTimeout(_=>attackNPC(id,token),getRandomTimeout());
                }
                else {
                    let d = new Date();
                    d = new Date(d.getTime() + 10*60*1000);
                    console.log(`%c Sin energía. Se reintentará matar npc's en 10 min (${d.getHours()}:${d.getMinutes()})`,'color: #7a0882')
                    //setTimeout(_=>startBATTLE(), 1000*60*5);
                }
            }
            catch(e){
                //No tengo ganas de armar esto bien. Si rompe reintento en 10 min y alv
            }
        }

        window.enableBATTLE  = ()=>{
            BOT_MODE.BATTLE = true;
            console.log(`%c batallas habilitadas`,'color: #7a0882')
        }
        window.disableBATTLE = ()=>{
            BOT_MODE.BATTLE = false;
            console.log(`%c batallas deshabilitadas`,'color: #7a0882')
        }

        window.startQUEST = ()=>{
            console.log("auto quest iniciado...");
            setInterval(()=>{
                doQuest(BOT_MODE.config.quest.quest_id.toString())
            }, 10*60*1000 /*10 min, el tiempo que tarda en cargar cada quest point*/)
        }

        window.doQuest = async (id)=>{
            fetch("https://web.simple-mmo.com/api/quest/" + id,{
                method:"post",
                headers: {
                    "X-CSRF-TOKEN": await getToken(),
                    }
            }).then(r=>{
                if (r.status == 200){
                    console.log("Quest hecha con exito" + ` - logged at : ${getTimeHHSS()}`);
                }else console.log("Quest sin exito" + ` - logged at : ${getTimeHHSS()}`);
            }).catch(e=>{
                console.warn("Error al ejecutar quest:", e)
            })
        }

        window.SAVED_CONFIGS = [JSON.parse("{\"JOB\":false,\"BET\":true,\"TRAVEL\":false,\"QUEST\":true,\"BATTLE\":true,\"interval\":1,\"config\":{\"bet\":{\"max-loses\":12,\"bet-value\":1,\"factor\":2.15,\"limite\":250000,\"parallel_bets\":1},\"battle\":{\"interval\":15},\"autodeposit\":{\"time\":180000,\"max_gold\":250000},\"quest\":{\"quest_id\":144},\"valid\":{\"JOB\":true,\"BET\":true,\"TRAVEL\":true,\"QUEST\":true,\"BATTLE\":true,\"interval\":true,\"autodeposit\":true}},\"autodeposit\":true}")]
        confirm("Habilitar bot con configuraciones por defecto?") && startBot(window.SAVED_CONFIGS[0]);
    })
})();