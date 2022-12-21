/*
¿Qué es canvas en JavaScript?
Lo primero que necesitamos es el elemento de HTML donde vamos a renderizar el canvas,
 canvas nos sirve para renderizar gráficos 2D.
Como condición también tenemos que crear un contexto que es donde le decimos a canvas 
que queremos renderizar gráficos en 2d lo hacemos así
*/ 

const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#up');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const btnDown = document.querySelector('#down');
const spanLives= document.querySelector('#lives');
const spanTime = document.querySelector('#time')
const spanRecord = document.querySelector('#record')
const pResult = document.querySelector('#result')

let canvasSize;
let elementsSize;
let level = 0;
let lives = 3;

let timeStart;
let timePlayer;
let timeInterval; 

const playerPosition = {
    x: undefined,
    y: undefined,
}

const giftPosition = {
    x: undefined,
    y: undefined,
}

let enemiesPositions = [];
//load: apenas cargue nuestro documento html vamos a ejecutar nuestro codigo indicado aqui 'startGame'
window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);



function setCanvasSize() {

    if (window.innerHeight > window.innerWidth) { //creamos un condicional para que el cuadrado siempre sea el mismo y se acomode segun el with y heigth
        canvasSize =  window.innerWidth * 0.7;
    } else {
        canvasSize = window.innerHeight * 0.7;
    }

    canvasSize = Number(canvasSize.toFixed(0));

    canvas.setAttribute('width', canvasSize) // lo igualamos al canvasSize para que sea igual al valor dado en el condicional
    canvas.setAttribute('height', canvasSize)

    elementsSize = canvasSize / 10; // dividimos el elemento entre 10 para que nos de la posicion de cada valor nuevo que anadiremos

    playerPosition.x = undefined;
    playerPosition.y = undefined;
    startGame();
}

function startGame() {
    console.log({ canvasSize, elementsSize});

    game.font = elementsSize + 'px Verdana'; // para el tamano y lo igualamos a elemntSize
    game.textAlign = 'end'; // para que se acomode en el final de la posicion

    const map = maps[level];

    if(!map) {
        gameWin();
        return;
    }

    if(!timeStart) {
        timeStart = Date.now();
        timeInterval = setInterval(showTime, 100);
        showRecord()
    }

    const mapRows = map.trim().split('\n');
    const mapRowCols = mapRows.map(row => row.trim().split(''));
    console.log({map, mapRows, mapRowCols});

    showLives()

    enemiesPositions = [];
    game.clearRect(0,0,canvasSize,canvasSize);

    mapRowCols.forEach((row, rowI) => {
        row.forEach((col, colI) => {
            const emoji = emojis[col];
            const posX = elementsSize * (colI + 1);
            const posY = elementsSize * (rowI + 1);

            if (col == 'O') {
                if (!playerPosition.x && !playerPosition.y) {
                    playerPosition.x = posX;
                    playerPosition.y = posY;
                }
            } else if (col == 'I') {
                giftPosition.x = posX;
                giftPosition.y = posY;
            } else if (col == 'X') {
                enemiesPositions.push({
                    x: posX,
                    y: posY,
                });
            }

            game.fillText(emoji, posX, posY)
        });
    });


    /*for (let row = 1; row <= 10; row++ ) { //Creamos un ciclo for para pasar de uno en uno y insertar un emoji en cada posicion
        for (let col = 1; col <= 10; col++) { // hacemos un doble for para colocar el elemento en todo los espacios disponibles del canvas
            game.fillText(emojis[mapRowCols[row -1][col -1]], elementsSize*col, elementsSize*row);
        }
    }*/
     

    //window.innerHeight
    //window.innerWidth

    //game.fillRect(0,50,100,100); // sirve para crear un rectangulo dandole coordenadas.
    //game.clearRect(50,50,50,50); // nos ayuda a borrar rectangulo dandole coordenadas.

    //game.font = '25px Verdana'; // propiedad para cambiar estilo del texto y tamano de fuente
    //game.fillStyle = 'purple' // propiedad para cambiar estilos
    //game.textAlign = 'end'; // propiedad funciona para decirle desde donde va a 'start' o 'end' nuestro texto
    //game.fillText('Platzi', 25, 25) // propiedad para agregar texto y tambien la posicion con coordenadas
    movePlayer();
} 

function movePlayer() {
    const giftCollisionX = playerPosition.x.toFixed(3) == giftPosition.x.toFixed(3);
    const giftCollisionY = playerPosition.y.toFixed(3) == giftPosition.y.toFixed(3);
    const giftCollision = giftCollisionX && giftCollisionY;

    if (giftCollision) {
        levelWin()
    }

    const enemyCollision = enemiesPositions.find( enemy => {
        const enemyCollisionX = enemy.x.toFixed(3) == playerPosition.x.toFixed(3);
        const enemyCollisiony = enemy.y.toFixed(3) == playerPosition.y.toFixed(3);
        return enemyCollisionX && enemyCollisiony;
    });

    if (enemyCollision) {
        levelFail();
    }
    game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
   }

function levelWin() {
    console.log('subiste de nivel')
    level++;
    startGame();
}

function levelFail() {
    lives--;
    

    if (lives <= 0) {
        level = 0;
        lives = 3;
        timeStart = undefined;
    }
        playerPosition.x = undefined;
        playerPosition.y = undefined;
        startGame();
}

function gameWin() {
    console.log('Terminaste el juego')
    clearInterval(timeInterval);

    const recordTime = localStorage.getItem('record_time')
    const playerTime = Date.now() - timeStart;

    if(recordTime) {
        if(recordTime >= playerTime) {
            localStorage.setItem('record_time', playerTime);
            pResult.innerHTML = 'Superaste el record';
        } else {
            pResult.innerHTML = 'No superaste el record';
        }
    } else {
        localStorage.setItem('record_time', playerTime);
        pResult.innerHTML = 'Primera vez? muy bien ahora trata de superar tu record!!!'
    }

    console.log({recordTime, playerTime})
}

function showLives() {
    const heartsArray = Array(lives).fill(emojis['HEART']); //[1,2,3,]
    spanLives.innerHTML = "";
    heartsArray.forEach(heart => spanLives.append(heart));
}

function timeFormat(time_msec){
    const time = ~~(time_msec /1000);
    const min = (time / 60) | 0;
    const sec =  time - (min * 60);    
    const msec = ((time_msec / 10) | 0) - (time * 100);
    return min +':'+ ((sec < 10 ? '0' : 0) + sec) + ':' + ((msec < 10 ? '0' : 0) + msec);}

function showTime() {
    timeShow = Date.now() - timeStart;
    spanTime.innerHTML = timeFormat(timeShow);

}

function showRecord() {
    recordNew = localStorage.getItem('record_time')
    spanRecord.innerHTML = timeFormat(recordNew)
}

window.addEventListener('keydown' , moveByKeys);
btnUp.addEventListener('click', moveUp);
btnLeft.addEventListener('click', moveLeft);
btnRight.addEventListener('click', moveRight);
btnDown.addEventListener('click', moveDown);

function moveByKeys(event) {
    if (event.key == 'ArrowUp') {
        moveUp();
    } else if (event.key == 'ArrowLeft') {
        moveLeft();
    } else if (event.key == 'ArrowRight') {
        moveRight();
    } else if (event.key == 'ArrowDown') {
        moveDown();
    }
}

function moveUp() {
    console.log('me muevo hacia arriba')

    if ((playerPosition.y - elementsSize) < elementsSize) {
        console.log('OUT')
    } else {
        playerPosition.y -= elementsSize;
        startGame();
    } 
}

function moveLeft() {
    console.log('me muevo hacia izquierda') 

    if ((playerPosition.x - elementsSize) < elementsSize) {
        console.log('OUT')
    } else {
        playerPosition.x -= elementsSize;
    startGame();
    }
}

function moveRight() {
    console.log('me muevo hacia derecha')

    if ((playerPosition.x + elementsSize) > canvasSize) {
        console.log('OUT')
    } else {
        playerPosition.x += elementsSize;
    startGame();
    }
} 

function moveDown() {
    console.log('me muevo hacia abajo')

    if ((playerPosition.y + elementsSize) > canvasSize) {
        console.log('OUT')
    } else {
        playerPosition.y += elementsSize;
    startGame();
    }

} 