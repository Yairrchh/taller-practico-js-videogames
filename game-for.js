// haciendolo con ciclo for clase 7;

/*
¿Qué es canvas en JavaScript?
Lo primero que necesitamos es el elemento de HTML donde vamos a renderizar el canvas,
 canvas nos sirve para renderizar gráficos 2D.
Como condición también tenemos que crear un contexto que es donde le decimos a canvas 
que queremos renderizar gráficos en 2d lo hacemos así
*/ 

const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');

let canvasSize;
let elementsSize;
//load: apenas cargue nuestro documento html vamos a ejecutar nuestro codigo indicado aqui 'startGame'
window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);



function setCanvasSize() {

    if (window.innerHeight > window.innerWidth) { //creamos un condicional para que el cuadrado siempre sea el mismo y se acomode segun el with y heigth
        canvasSize =  window.innerWidth * 0.8;
    } else {
        canvasSize = window.innerHeight * 0.8;
    }

    canvas.setAttribute('width', canvasSize) // lo igualamos al canvasSize para que sea igual al valor dado en el condicional
    canvas.setAttribute('height', canvasSize)

    elementsSize = canvasSize / 10; // dividimos el elemento entre 10 para que nos de la posicion de cada valor nuevo que anadiremos

    startGame();
}

function startGame() {
    console.log({ canvasSize, elementsSize});

    game.font = elementsSize + 'px Verdana'; // para el tamano y lo igualamos a elemntSize
    game.textAlign = 'end'; // para que se acomode en el final de la posicion

    const map = maps[0];
    const mapRows = map.trim().split('\n');
    const mapRowCols = mapRows.map(row => row.trim().split(''));
    console.log({map, mapRows, mapRowCols});

    for (let row = 1; row <= 10; row++ ) { //Creamos un ciclo for para pasar de uno en uno y insertar un emoji en cada posicion
        for (let col = 1; col <= 10; col++) { // hacemos un doble for para colocar el elemento en todo los espacios disponibles del canvas
            game.fillText(emojis[mapRowCols[row -1][col -1]], elementsSize*col, elementsSize*row);
        }
    }
     

    //window.innerHeight
    //window.innerWidth

    //game.fillRect(0,50,100,100); // sirve para crear un rectangulo dandole coordenadas.
    //game.clearRect(50,50,50,50); // nos ayuda a borrar rectangulo dandole coordenadas.

    //game.font = '25px Verdana'; // propiedad para cambiar estilo del texto y tamano de fuente
    //game.fillStyle = 'purple' // propiedad para cambiar estilos
    //game.textAlign = 'end'; // propiedad funciona para decirle desde donde va a 'start' o 'end' nuestro texto
    //game.fillText('Platzi', 25, 25) // propiedad para agregar texto y tambien la posicion con coordenadas
} 