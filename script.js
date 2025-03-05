// Variables globales
let nivel = 1;
let puntuacion = 0;
let intentos = 4;
let operacionActual = "";
let tiempoRestante = 60;
let temporizador;
let puzzlePiezas = [];
let piezasReveladas = 0;

const imagenesPuzzle = [
    "img/nivel1.jpg",
    "img/nivel2.jpg",
    "img/nivel3.jpg",
    "img/nivel4.jpg",
    "img/nivel5.jpg",
    "img/nivel6.jpg",
    "img/nivel7.jpg"
]



// Función para inicializar el puzzle
function inicializarPuzzle() {
    const puzzleGrid = document.getElementById("puzzle-grid");
    puzzleGrid.innerHTML = "";
    piezasReveladas = 0;
    puzzlePiezas = Array(16).fill("oculta");

    for (let i = 0; i < 16; i++) {
        const pieza = document.createElement("div");
        pieza.classList.add("puzzle-piece");
        pieza.textContent = "?";
        pieza.addEventListener("click", () => revelarPieza(i));
        puzzleGrid.appendChild(pieza);
    }
}

// Función para revelar una pieza del puzzle
function revelarPieza(indice) {
    if (puzzlePiezas[indice] === "revelada") return;

    const pieza = document.querySelectorAll(".puzzle-piece")[indice];
    pieza.style.backgroundImage = `url(${imagenesPuzzle[nivel - 1]})`;
    pieza.style.backgroundSize = "200px 200px"; // Ajustar el tamaño de la imagen
    pieza.style.backgroundPosition = `-${(indice % 4) * 50}px -${Math.floor(indice / 4) * 50}px`;
    pieza.textContent = "";
    puzzlePiezas[indice] = "revelada";
    piezasReveladas++;

    if (piezasReveladas === 16) {
        setTimeout(() => {
            alert("¡Rompecabezas completado! 🎉");
            subirNivel();
        }, 500);
    }
}

// Función para generar una operación aleatoria sin decimales
function generarOperacion() {
    const operaciones = ["+", "-", "*", "/"];
    const operacion = operaciones[Math.floor(Math.random() * operaciones.length)];
    let num1, num2;

    do {
        switch (nivel) {
            case 1:
                num1 = Math.floor(Math.random() * 10) + 1;
                num2 = Math.floor(Math.random() * 10) + 1;
                break;
            case 2:
                num1 = Math.floor(Math.random() * 50) + 1;
                num2 = Math.floor(Math.random() * 50) + 1;
                break;
            case 3:
                num1 = Math.floor(Math.random() * 100) + 1;
                num2 = Math.floor(Math.random() * 100) + 1;
                break;
            case 4:
                num1 = Math.floor(Math.random() * 200) + 1;
                num2 = Math.floor(Math.random() * 200) + 1;
                break;
            case 5:
                num1 = Math.floor(Math.random() * 500) + 1;
                num2 = Math.floor(Math.random() * 500) + 1;
                break;
            case 6:
                num1 = Math.floor(Math.random() * 1000) + 1;
                num2 = Math.floor(Math.random() * 1000) + 1;
                break;
            case 7:
                num1 = Math.floor(Math.random() * 2000) + 1;
                num2 = Math.floor(Math.random() * 2000) + 1;
                break;
        }

        // Evitar divisiones por 0 y divisiones que no sean exactas
        if (operacion === "/") {
            if (num2 === 0) {
                num2 = 1; // Evitar división por 0
            }
            if (num1 % num2 !== 0) {
                continue; // Generar nuevos números si la división no es exacta
            }
        }

        // Evitar multiplicaciones con decimales
        if (operacion === "*" && !Number.isInteger(num1 * num2)) {
            continue; // Generar nuevos números si la multiplicación da decimales
        }

        break; // Salir del bucle si la operación es válida
    } while (true);

    operacionActual = `${num1} ${operacion} ${num2}`;
    document.getElementById("question").textContent = operacionActual; // Mostrar la operación en pantalla
}

// Función para verificar la respuesta
function verificarRespuesta() {
    const respuestaUsuario = parseFloat(document.getElementById("answer").value);
    const respuestaCorrecta = eval(operacionActual);

    if (respuestaUsuario === respuestaCorrecta) {
        puntuacion += 10;
        document.getElementById("feedback").textContent = "¡Correcto! 🎉";
        document.getElementById("score").textContent = puntuacion;

        // Revelar una pieza del puzzle
        const indicePieza = Math.floor(Math.random() * 16);
        revelarPieza(indicePieza);

        if (puntuacion >= nivel * 50) {
            subirNivel();
        }
    } else {
        intentos--;
        document.getElementById("feedback").textContent = "Incorrecto. Intenta de nuevo. 😢";
        document.getElementById("attempts").textContent = intentos;
        if (intentos === 0) {
            clearInterval(temporizador);
            alert("¡Se acabaron los intentos! Reiniciando juego.");
            reiniciarJuego();
        }
    }
    document.getElementById("answer").value = "";
    generarOperacion(); // Generar una nueva operación
}

// Función para subir de nivel
function subirNivel() {
    if (nivel < 7) {
        nivel++;
        tiempoRestante = 60;
        document.getElementById("level").textContent = nivel;
        document.getElementById("feedback").textContent = `¡Subiste al nivel ${nivel}! 🚀`;
        inicializarPuzzle(); // Reiniciar el puzzle para el nuevo nivel
    } else {
        clearInterval(temporizador);
        alert("¡Felicidades! Completaste todos los niveles. 🏆");
        reiniciarJuego();
    }
}

// Función para reiniciar el juego
function reiniciarJuego() {
    nivel = 1;
    puntuacion = 0;
    intentos = 4;
    tiempoRestante = 60;
    document.getElementById("level").textContent = nivel;
    document.getElementById("score").textContent = puntuacion;
    document.getElementById("attempts").textContent = intentos;
    document.getElementById("timer").textContent = `Tiempo: ${tiempoRestante} segundos`;
    clearInterval(temporizador);
    temporizador = setInterval(actualizarTemporizador, 1000);
    inicializarPuzzle();
    generarOperacion(); // Generar una nueva operación al reiniciar
}

// Función para actualizar el temporizador
function actualizarTemporizador() {
    tiempoRestante--;
    document.getElementById("timer").textContent = `Tiempo: ${tiempoRestante} segundos`;

    if (tiempoRestante <= 0) {
        clearInterval(temporizador);
        alert("¡Se acabó el tiempo! Reiniciando juego.");
        reiniciarJuego();
    }
}

// Iniciar el juego
window.onload = function () {
    document.getElementById("timer").textContent = `Tiempo: ${tiempoRestante} segundos`;
    temporizador = setInterval(actualizarTemporizador, 1000);
    inicializarPuzzle();
    generarOperacion(); // Generar la primera operación al iniciar
};