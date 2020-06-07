// ==UserScript==
// @name         SimpleMMO Bot - Attack Npc when travel
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://web.simple-mmo.com/npcs/attack/*
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

        window.SMMObotStop = ()=>{
            document.cookie = "botSMMO-ATTACK=false";
            console.log("bot detenido");
        }

        window.SMMObotStart = ()=>{
            document.cookie = "botSMMO-ATTACK=true";
            console.log("bot habilitado. recargar página");
        }

        window.execute = ()=>{
            new Promise(res=>{
                let atckBtn = document.querySelector("#attackButton");
                let useItemBtn = document.querySelector("#useItem");
                let hp = parseInt(document.querySelector("#current_health").textContent)
                let hp_max = parseInt(document.querySelector("#max_health").textContent)

                if (hp/hp_max < 0.2){
                    useItemBtn.click();
                }
                setTimeout(e=>{
                    let finBtn = document.querySelector(".swal2-confirm.swal2-styled")
                    if (finBtn){
                        window.location.pathname = "/travel"
                    }
                    else{
                        atckBtn.click();
                    }
                    res();
                },window.getRandomTimeout())
            }).then(e=>window.execute());
        }

        if (window.attackNpcBotEnabled()){
            console.log("bot ejecutando...");
            window.execute()
        }
    })
})();

//atacar npc desde battle arena: <a href="/battlearena" class="btn btn-danger">Exit battle</a>
