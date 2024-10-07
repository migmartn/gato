document.getElementById('iniciar-torneo').addEventListener('click', iniciarTorneo);

let jugadores = ["Jugador 1", "Jugador 2", "Jugador 3", "Jugador 4", "Jugador 5", "Jugador 6", "Jugador 7", "Jugador 8"];
let rondasEliminatorias = [];
let semifinalistas = [];
let finalistas = [];
let tercerLugar = [];
let tablero = Array(9).fill(null);
let turnoActual = "X";
let partidaActual = null;

function iniciarTorneo() {
    rondasEliminatorias = [];
    semifinalistas = [];
    finalistas = [];
    tercerLugar = [];
    
    asignarPartidos(rondasEliminatorias, jugadores);
    mostrarPartidos("partidos-eliminatorias", rondasEliminatorias);
}

function asignarPartidos(partidos, participantes) {
    while (participantes.length > 1) {
        let partido = {
            jugador1: participantes.shift(),
            jugador2: participantes.shift(),
            victorias1: 0,
            victorias2: 0,
            resultado: null
        };
        partidos.push(partido);
    }
}

function mostrarPartidos(elementoId, partidos) {
    let contenedor = document.getElementById(elementoId);
    contenedor.innerHTML = "";
    partidos.forEach((partido, index) => {
        let partidoDiv = document.createElement("div");
        partidoDiv.textContent = `${partido.jugador1} vs ${partido.jugador2}`;
        let botonJugar = document.createElement("button");
        botonJugar.textContent = "Iniciar Partida";
        botonJugar.addEventListener('click', () => jugarPartido(partido, index, elementoId));
        partidoDiv.appendChild(botonJugar);
        contenedor.appendChild(partidoDiv);
    });
}

function jugarPartido(partido, index, fase) {
    resetearTablero();
    partidaActual = partido;
    document.getElementById("tablero").style.display = "grid";
}

function manejarClickCelda(index) {
    if (!tablero[index] && partidaActual) {
        tablero[index] = turnoActual;
        document.querySelectorAll("#tablero div")[index].textContent = turnoActual;
        turnoActual = turnoActual === "X" ? "O" : "X";
        if (verificarGanador()) {
            actualizarResultado();
        }
    }
}

function verificarGanador() {
    const lineasGanadoras = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (let linea of lineasGanadoras) {
        const [a, b, c] = linea;
        if (tablero[a] && tablero[a] === tablero[b] && tablero[a] === tablero[c]) {
            return true;
        }
    }
    return false;
}

function actualizarResultado() {
    if (turnoActual === "O") {
        partidaActual.victorias1 += 1;
    } else {
        partidaActual.victorias2 += 1;
    }

    if (partidaActual.victorias1 === 2 || partidaActual.victorias2 === 2) {
        partidaActual.resultado = partidaActual.victorias1 === 2 ? partidaActual.jugador1 : partidaActual.jugador2;
        avanzarSiguienteFase();
        document.getElementById("tablero").style.display = "none";
    } else {
        resetearTablero();
    }
}

function avanzarSiguienteFase() {
    if (rondasEliminatorias.some(partido => partido.resultado === null)) {
        // Aún hay partidas pendientes en las rondas eliminatorias
        return;
    }

    if (semifinalistas.length === 0) {
        // Avanzar a semifinales
        rondasEliminatorias.forEach(partido => {
            semifinalistas.push({
                jugador1: partido.resultado,
                jugador2: null,
                victorias1: 0,
                victorias2: 0,
                resultado: null
            });
        });
        asignarPartidos(semifinalistas, semifinalistas.map(s => s.jugador1));
        mostrarPartidos("partidos-semifinales", semifinalistas);
    } else if (finalistas.length === 0) {
        // Avanzar a la final y al partido por el tercer lugar
        semifinalistas.forEach(partido => {
            if (partido.resultado) {
                finalistas.push(partido.resultado);
            } else {
                tercerLugar.push(partido.jugador1);
            }
        });

        // Mostrar los partidos de la final y tercer lugar
        asignarPartidos([finalistas], finalistas);
        mostrarPartidos("partido-final", finalistas);
        asignarPartidos(tercerLugar, tercerLugar);
        mostrarPartidos("partidos-tercer-lugar", tercerLugar);
    } else {
        // Revisar final y tercer lugar
        if (finalistas[0].resultado && finalistas[1].resultado) {
            // Determinar ganador y segundo lugar
            alert(`Ganador: ${finalistas[0].resultado}`);
            alert(`Segundo lugar: ${finalistas[1].resultado}`);
        }

        if (tercerLugar[0].resultado && tercerLugar[1].resultado) {
            // Determinar tercer lugar
            alert(`Tercer lugar: ${tercerLugar[0].resultado}`);
        }
    }
}

function resetearTablero() {
    tablero.fill(null);
    let celdas = document.querySelectorAll("#tablero div");
    celdas.forEach(celda => celda.textContent = "");
    turnoActual = "X";
}

document.querySelectorAll("#tablero div").forEach((celda, index) => {
    celda.addEventListener('click', () => manejarClickCelda(index));
});
