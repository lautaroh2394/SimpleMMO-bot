// ==UserScript==
// @name         SimpleMMO Bot - Travel
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://web.simple-mmo.com/travel
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener("load",()=>{
        window.getRandomTimeout = ()=>{
            return parseInt((1.5 + Math.random(Math.sqrt(Math.sqrt(Date.now())))*2 + Math.random(Math.sqrt(Date.now()))*3)*1000);
        }

        window.execute = ()=>{
            (new Promise((res)=>{
                let timeout = window.getRandomTimeout();
                let submit = document.querySelector("a.stepbuttonnew");
                console.log("Clickeando en "+(parseFloat(timeout)/1000).toString() + " segundos");
                setTimeout(e=>{
                    submit.click()
                    res();
                }, timeout)
            })).then(e=>window.execute());
        }
        window.SMMObotStop = ()=>{
            document.cookie = "botSMMO-TRAVEL=false";
            console.log("bot detenido");
        }

        window.SMMObotStart = ()=>{
            document.cookie = "botSMMO-TRAVEL=true";
            console.log("bot habilitado. recargar página");
        }

        window.SMMObotBet = (value)=>{
            document.cookie = `bet-value=${value}`;
            console.log("apuesta seteada a " + value);
        }



        let flagBot = document.cookie.split(";").find(e=>e.includes("botSMMO-TRAVEL"));
        if (!flagBot){
            if( confirm("Activar bot?")) {
             document.cookie = "botSMMO-TRAVEL=true";
             console.log("bot habilitado");
            }else{
            document.cookie = "botSMMO-TRAVEL=false";
                console.log("bot deshabilitado");
            }
        }
        flagBot = document.cookie.split(";").find(e=>e.includes("botSMMO-TRAVEL")).split("=")[1];

        if (flagBot == "true" || flagBot === true){
            console.log("bot ejecutando...");
            window.execute()
        }
    })
})();
