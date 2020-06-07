// ==UserScript==
// @name         SimpleMMO Bot - Travel
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://web.simple-mmo.com/travel*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener("load",()=>{
        window.getRandomTimeout = ()=>{
            return parseInt((1.5 + Math.random(Math.sqrt(Math.sqrt(Date.now())))*2 + Math.random(Math.sqrt(Date.now()))*3)*1000);
        }

        window.attackNpcBotEnabled = ()=>{
            let flagBot = document.cookie.split(";").find(e=>e.includes("botSMMO-ATTACK"));
            if (!flagBot){
                if( confirm("Activar bot?")) {
                document.cookie = "botSMMO-ATTACK=true";
                console.log("bot habilitado");
                }else{
                document.cookie = "botSMMO-ATTACK=false";
                    console.log("bot deshabilitado");
                }
            }
            flagBot = document.cookie.split(";").find(e=>e.includes("botSMMO-ATTACK")).split("=")[1];
            return (flagBot == "true" || flagBot === true)
        }

        window.travelBotEnabled = ()=>{
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
            return (flagBot == "true" || flagBot === true)
        }

        window.execute = ()=>{
            (new Promise((res)=>{
                let timeout = window.getRandomTimeout();
                let submit = document.querySelector("a.stepbuttonnew");
                console.log("Clickeando en "+(parseFloat(timeout)/1000).toString() + " segundos");
                setTimeout(e=>{
                    let attackNpc = [...document.querySelectorAll("a.cta")].find(e=>!!e.getAttribute && !!e.getAttribute("href") && e.getAttribute("href").includes("npcs/attack"))
                    !!attackNpc && attackNpcBotEnabled() && attackNpc.click();
                    !attackNpc && window.travelBotEnabled() && submit.click()
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

        if (window.travelBotEnabled()){
            console.log("bot ejecutando...");
            window.execute()
        }
    })
})();