// ==UserScript==
// @name         50/50
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://web.simple-mmo.com/gamecentre/5050
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener("load",()=>{
        window.SMMObotStop = ()=>{
            document.cookie = "botSMMO-5050=false";
            console.log("bot detenido");
        }

        window.SMMObotStart = ()=>{
            document.cookie = "botSMMO-5050=true";
            console.log("bot habilitado. recargar página");
        }

        window.SMMObotBet = (value)=>{
            document.cookie = `bet-value=${value}`;
            console.log("apuesta seteada a " + value);
        }

        window.setSMMObotBetMartingalaMaxLoses = n => {
            document.cookie = `botSMMO-MaxLoses=${n}`
        }

        window.getSMMObotBetMartingalaMaxLoses = n => {
            let m = document.cookie.split(";").find(e=>e.includes("botSMMO-MaxLoses"));
            if (!m) {
                window.setSMMObotBetMartingalaMaxLoses(12)
                return window.getSMMObotBetMartingalaMaxLoses();
            }
            return m.split("=")[1]
        }

        let bet = document.cookie.split(";").find(e=>e.includes("bet-value"))
        if (!bet){
            window.SMMObotBet(1);
            bet = 1;
        }
        else{
            bet = bet.split("=")[1]
        }

        let flagBot = document.cookie.split(";").find(e=>e.includes("botSMMO-5050"));
        if (!flagBot){
            if( confirm("Activar bot?")) {
             document.cookie = "botSMMO-5050=true";
             console.log("bot habilitado");
            }else{
            document.cookie = "botSMMO-5050=false";
                console.log("bot deshabilitado");
            }
        }
        flagBot = document.cookie.split(";").find(e=>e.includes("botSMMO-5050")).split("=")[1];

        if (flagBot == "true" || flagBot === true){
            console.log("bot ejecutando...");
            let apuesta = document.getElementById("sample1");
            let divApuestaAnterior = document.querySelector(".notice");
            let apuestaAnteriorExitosa = divApuestaAnterior ? divApuestaAnterior.classList.contains("notice-success") : true
            let submit = [...document.querySelectorAll("button.cta")].find(e=>e.getAttribute("href"));

            if (apuestaAnteriorExitosa){
                let totalOro = parseInt(current_gold.textContent.replace(",",""));
                totalOro = totalOro > 250000 ? 250000 : totalOro;
                let maxLoses = parseInt(window.getSMMObotBetMartingalaMaxLoses());
                bet = parseInt( totalOro / Math.pow(2.1,maxLoses) );
                apuesta.value = bet < 0 ? 1 : bet;
                document.cookie = `lastbet=${bet}`
            }
            else{
                let perdidaAnterior = document.cookie.split(";").find(e=>e.includes("lastbet")).split("=")[1]
                let apuestaActual = parseInt(perdidaAnterior * 2.1);
                apuesta.value = apuestaActual;
                document.cookie = `lastbet=${apuestaActual}`
            }
            let timeout = parseInt((1.5 + Math.random(Math.sqrt(Math.sqrt(Date.now())))*2 + Math.random(Math.sqrt(Date.now()))*3)*1000);
            console.log("apostando en " + (parseFloat(timeout)/1000).toString() + " segundos");
            setTimeout(()=>submit.click(),timeout)
    }
    })
})();