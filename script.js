
const gameBoard = document.querySelector("#gameBoard"); // Присваивание переменной gameBoard селектор #gameBoard
const ctx = gameBoard.getContext("2d"); // ctx становится объектом, который будемте использовать для рисования 2д графики на canvas
const scoreText = document.querySelector("#scoreText"); // Присваивание переменной scoreText селектор #scoreText
const resetBotom = document.querySelector("#resetBotom"); // Присваивание переменной resetBotom селектор #resetBotom
const gameWidth = gameBoard.width; //  Получаем ширину canvas из его свойства width
const gameHeight = gameBoard.height; //  Получаем высоту canvas из его свойства height
const boardBackground = "white"; // Цвет фона
const snakeColor = "lightgreen"; // Цвет змеи
const snakeBorder = "black"; // Контур змеи
const foodColor = "red"; // Цвет еды
const unitSize = 25; // Размер 1 сегмента в 25px
let running = false; // Проверяет запущена ли игра или нет 
let xVelocity = unitSize; // Определяет перемещение по оси Х
let yVelocity = 0; // Определяет перемещение по оси Y
let foodX; // Координаты еды
let foodY; // Координаты еды
let score = 0; // Счёт
let snake = [  // Координаты змеи 
    {x:unitSize * 4, y:0 },
    {x:unitSize * 3, y:0 },
    {x:unitSize * 2, y:0 },
    {x:unitSize, y:0 },
    {x:0, y:0 },
];

window.addEventListener("keydown", changeDirection); // Добавляем обработчик события на объект window, который будет вызывать функцию changeDirection, когда игрок нажимает клавишу на клавиатуре
resetBotom.addEventListener("click", resetGame); // Добавляем обработчик события к элементу интерфейса кнопке Reset с идентификатором resetBotom. Когда  нажимает эту кнопку, выполняется функция resetGame и игра перезагружается

gameStart(); 

// Функция запуска игры
function gameStart(){
    running = true;
    scoreText.textContent = score;
    createFood();
    drawFood();
    nextTick()
}; 
// Обновление состояния игры на каждом шаге игрового цикла
function nextTick(){
    if(running){
        setTimeout(() =>{
           clearBoard(); 
           drawFood();
           moveSnake();
           drawSneake();
           checkGameOver();
           nextTick();
        }, 75)
    }
    else {
        displayGameOver();
    }
};

// Очистка игрового поля перед каждым обновлением состояния игры 
function clearBoard(){
    ctx.fillStyle = boardBackground;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
};

// Создание еды на случайном месте на игровом поле
function createFood(){
    function randomFood(min, max) {
        const randNum = Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
        return randNum;
    }
    foodX = randomFood(0, gameWidth - unitSize)
    foodY = randomFood(0, gameWidth - unitSize)
};

// Рисуем еду на игровом поле 
function drawFood(){
    ctx.fillStyle = foodColor;
    ctx.fillRect(foodX, foodY, unitSize, unitSize)
};

// Логика движения змеи. Отвечает за обновление положения змеи на игровом поле, проверяет, съела ли она еду, и в зависимости от этого либо увеличивает ее длину, либо удаляет последний сегмент
function moveSnake(){
    //Голова змеи 
    const head = {
        x: snake[0].x + xVelocity,
        y: snake[0].y + yVelocity,
    };

    snake.unshift(head);
    //Проверяем была ли съедена еда
    if(snake[0].x == foodX && snake[0].y == foodY){
        score += 1
        scoreText.textContent = score;
        createFood();
    }
    else{
        snake.pop() // Удаление хвоста змеи при отсутствии поедания еды
    } 
};

// Отображаение змеи на игровом поле, рисует каждый сегмент змеи с использованием заданного цвета и границ
function drawSneake(){
    ctx.fillStyle = snakeColor;
    ctx.strokeStyle = snakeBorder;
    snake.forEach(snakePart => {
        ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
        ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
    })

};

// Управляет изменением направления движения змеи на основе нажатия клавиш на клавиатуре (стрелки)
function changeDirection(event){
    const keyPressed = event.keyCode;
    const LEFT = 37;
    const UP = 38;
    const RIGHT = 39;
    const DOWN = 40;
    
    const goingUp = (yVelocity == -unitSize);
    const goingDown = (yVelocity == unitSize);
    const goingRight = (xVelocity == unitSize);
    const goingLeft = (xVelocity == -unitSize);

    switch(true){
        case (keyPressed == LEFT && !goingRight):
              xVelocity = -unitSize;
              yVelocity = 0;
              break;
        
        case (keyPressed == UP && !goingDown):
              xVelocity = 0;
              yVelocity = -unitSize;
              break;

        case (keyPressed == RIGHT && !goingLeft):
              xVelocity = unitSize;
              yVelocity = 0;
              break;              

        case (keyPressed == DOWN && !goingUp):
              xVelocity = 0;
              yVelocity = unitSize;
              break;        
    }
};

// Управление логикой завершении игры. Игра завершится в случае столкновения змеи с границами поля или когда столкнется с сама с собой
function checkGameOver(){

    switch(true) {
      case(snake[0].x < 0):
           running = false;
           break;

      case(snake[0].x >= gameWidth):
           running = false;
           break;

      case(snake[0].y < 0):
           running = false;
           break;

      case(snake[0].y >= gameHeight):
           running = false;
           break;
    }

    for(let i = 1; i < snake.length; i+=1){
        if(snake[i].x == snake[0].x && snake[i].y == snake[0].y)
            running = false;
    }
};

// Отображение сообщения "OH... GAME OVER" по окончанию игры на экране
function displayGameOver(){
    ctx.font = "50px MV Boli";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("OH... GAME OVER", gameWidth / 2, gameHeight / 2);
    running = false;
};

// Cброс состояния игры и возврат её к первоначальному состоянию. Ну и чтобы начать новую игру не нажно было бы перезагружать игру) 
function resetGame(){
    score = 0;
    xVelocity = unitSize;
    yVelocity = 0;
    snake = [  
        {x:unitSize * 4, y:0 },
        {x:unitSize * 3, y:0 },
        {x:unitSize * 2, y:0 },
        {x:unitSize, y:0 },
        {x:0, y:0 },
    ];

    gameStart (); 
};