// --- Global variables
let score = 0;
let newModal = document.querySelector('.new-modal');
let tetrisBox = document.querySelector('.tetris-box');
let startSpeed = 400;
let newSpeed = 0;
let totalSpeed = {
  speed: 400,
};
let level = 1;

let inputFieldLevel = document.getElementsByClassName('level')[0];
inputFieldLevel.value = `Текущий уровень: ${level}`;

let inputFieldSpeed = document.getElementsByClassName('speed')[0];
inputFieldSpeed.value = `Текущяя скорость: ${totalSpeed.speed}`;

let mainArr = [
  // I - figure (0)
  [
    [0, 1],
    [0, 2],
    [0, 3],
    // rotate 90
    [[-1, 1], [0, 0], [1, -1], [2, -2]],
    //rotate 180
    [[1, -1], [0, 0], [-1, 1], [-2, 2]],
    // rotate 270
    [[-1, 1], [0, 0], [1, -1], [2, -2]],
    //rotate 360
    [[1, -1], [0, 0], [-1, 1], [-2, 2]],
  ],
  // square-figure (1)
  [
    [1, 0],
    [0, 1],
    [1, 1],
    //rotate 90
    [[0, 0], [0, 0], [0, 0], [0, 0],],
    //rotate 180
    [[0, 0], [0, 0], [0, 0], [0, 0],],
    //rotate 270
    [[0, 0], [0, 0], [0, 0], [0, 0],],
    //rotate 360
    [[0, 0], [0, 0], [0, 0], [0, 0],],
  ],
  // lego-figure (2)
  [
    [1, 0],
    [2, 0],
    [1, 1],
    // rotate 90
    [[0, 2], [-1, 1], [-2, 0], [0, 0],],
    //rotate 180
    [[2, 0], [1, 1], [0, 2], [0, 0],],
    //rotate 270
    [[0, -2], [1, -1], [2, 0], [0, 0],],
    //rotate 360
    [[-2, 0], [-1, -1], [0, -2], [0, 0],],
  ],
  // L-figure (3)
  [
    [1, 0],
    [0, 1],
    [0, 2],
    // rotate 90
    [[0, 1], [-1, 0], [1, 0], [2, -1],],
    //rotate 180
    [[1, 1], [0, 2], [0, 0], [-1, -1],],
    //rotate 270
    [[1, -2], [2, -1], [0, -1], [-1, 0],],
    //rotate 360
    [[-2, 0], [-1, -1], [-1, 1], [0, 2],],
  ],
  // mirr-L-figure (4)
  [
    [1, 0],
    [1, 1],
    [1, 2],
    // rotate 90
    [[0, 1], [-1, 0], [0, -1], [1, -2],],
    // rotate 180
    [[1, 1], [0, 2], [-1, 1], [-2, 0],],
    // rotate 270
    [[1, -2], [2, -1], [1, 0], [0, 1],],
    // rotate 360
    [[-2, 0], [-1, -1], [0, 0], [1, 1],],
  ],
  // z-figure (5)
  [
    [1, 0],
    [-1, 1],
    [0, 1],
    // rotate 90
    [[-1, 1], [-2, 0], [1, 1], [0, 0],],
    // rotate 180
    [[1, -1], [2, 0], [-1, -1], [0, 0],],
    // rotate 270
    [[-1, 1], [-2, 0], [1, 1], [0, 0],],
    // rotate 360
    [[1, -1], [2, 0], [-1, -1], [0, 0],],
  ],
  // s-figure (6)
  [
    [1, 0],
    [1, 1],
    [2, 1],
    // rotete 90
    [[1, 0], [0, 1], [-1, 0], [-2, 1],],
    // rotete 180
    [[-1, 0], [0, -1], [1, 0], [2, -1],],
    // rotete 270
    [[1, 0], [0, 1], [-1, 0], [-2, 1],],
    // rotete 360
    [[-1, 0], [0, -1], [1, 0], [2, -1],],
  ]
];

// --------------
// --- DOM loaded
// --------------
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('start-game').addEventListener('click', function (e) {
    getParetByClass(this, 'new-modal').classList.add('hidden');
    tetrisBox.classList.add('active');

    startGame();

    figureNew.createFigure();
  });
});

let gameState = {
  levelFigureCode: getNewLevel(),
  figureIndex: 0,
  getFigureCode: () => {
    return gameState.levelFigureCode[gameState.figureIndex];
  }
}

class Figure {
  figure = [];
  flagMoveDownStop = false;
  flagMoveHorizontalStop = false;
  turnPosition = null;
  code = null;
  constructor () {
  }

  createFigure() {
    this.figure = [];
    this.flagMoveDownStop = false;
    let startX = 5;
    let startY = 15;
    this.turnPosition = 2;
    this.code = gameState.getFigureCode();
    let figureCellCoordinates = [
      String(startY).padStart(2, '0') + String(startX).padStart(2, '0'),
      String(startY + mainArr[this.code][0][1]).padStart(2, '0') + String(startX + mainArr[this.code][0][0]).padStart(2, '0'),
      String(startY + mainArr[this.code][1][1]).padStart(2, '0') + String(startX + mainArr[this.code][1][0]).padStart(2, '0'),
      String(startY + mainArr[this.code][2][1]).padStart(2, '0') + String(startX + mainArr[this.code][2][0]).padStart(2, '0')
    ];
    for (let i = 0; i < figureCellCoordinates.length; i++) {
      const value = figureCellCoordinates[i];
      document.querySelector('[data-pos="' + value + '"]').classList.add('figure');
      this.figure.push(document.querySelector('[data-pos="' + value + '"]'));
    }

    gameState.figureIndex++;

    this.moveDown();
  }

  moveDown() {
    let moveDownInterval = setInterval(() => {
      let newElemsArr = [];
      for (let i = 0; i < this.figure.length; i++) {
        const cell = this.figure[i];
        cell.classList.remove('figure');
        let posNew = String(Number(cell.dataset.pos.slice(0, 2)) - 1).padStart(2, '0') + cell.dataset.pos.slice(2);
        let elemNew = document.querySelector('[data-pos="' + posNew + '"]');
        newElemsArr.push(elemNew);

        if (!elemNew || elemNew.classList.contains('set') || cell.dataset.pos.slice(0, 2) == '01') {
          this.flagMoveDownStop = true;
          clearInterval(moveDownInterval);
        }
      }

      
      if (!this.flagMoveDownStop) {
        newElemsArr.forEach(elem => {elem.classList.add('figure')});
        this.figure = [...newElemsArr];
        newElemsArr = [];
      } else {
        this.figure.forEach(elem => {elem.classList.add('set')});
        if (gameState.levelFigureCode.length > gameState.figureIndex) {
          this.createFigure();
        } else {
          console.log('GAME OVER'); // TODO: всплывающее окно
        }
      }
      // elemNew.classList.add('figure');
      // this.figure[i] = elemNew;
    }, 500);
  }

  moveHorizontal(direction) {
    let figureNew = [];
    let flagFigureNewError = false;
    for (let i = 0; i < this.figure.length; i++) {
      const cell = this.figure[i];

      let posNew;
      switch (direction) {
        case 'left':
          posNew = cell.dataset.pos.slice(0, 2) + String(Number(cell.dataset.pos.slice(2)) - 1).padStart(2, '0');
          break;
        case 'right':
          posNew = cell.dataset.pos.slice(0, 2) + String(Number(cell.dataset.pos.slice(2)) + 1).padStart(2, '0');
          break;
      }
      
      let elemNew = document.querySelector('[data-pos="' + posNew + '"]');
      elemNew ? elemNew : null;
      figureNew.push(elemNew);
    }

    figureNew.forEach(elem => {
      if (!elem || elem.classList.contains('set')) {
        flagFigureNewError = true;
      }
    });

    if (!flagFigureNewError) {
      this.figure.forEach(elem => {elem.classList.remove('figure')});
      figureNew.forEach(elem => {elem.classList.add('figure')});
      this.figure = [...figureNew];
      figureNew = [];
    }
  }

  rotate() {
    let figureNew = [];
    let flagFigureNewError = false;
    this.turnPosition < 6 ? this.turnPosition++ : this.turnPosition = 3;

    for (let i = 0; i < this.figure.length; i++) {
      const cell = this.figure[i];
      const posX = cell.dataset.pos.slice(2);
      const posXNew = String(Number(posX) + mainArr[this.code][this.turnPosition][i][0]).padStart(2, '0');
      const posY = cell.dataset.pos.slice(0, 2);
      const posYNew = String(Number(posY) + mainArr[this.code][this.turnPosition][i][1]).padStart(2, '0');

      let posNew = posYNew + posXNew;
      let elemNew = document.querySelector('[data-pos="' + posNew + '"]');
      elemNew ? elemNew : null;
      figureNew.push(elemNew);
    }
    
    figureNew.forEach(elem => {
      if (!elem || elem.classList.contains('set')) {
        flagFigureNewError = true;
      }
    });

    if (!flagFigureNewError) {
      this.figure.forEach(elem => {elem.classList.remove('figure')});
      figureNew.forEach(elem => {elem.classList.add('figure')});
      this.figure = [...figureNew];
      figureNew = [];
    }
  }
}

let figureNew = new Figure();

window.addEventListener('keydown', function (e) {
  if (e.keyCode == 37) {
    figureNew.moveHorizontal('left');
  } 
  else if (e.keyCode == 39) {
    figureNew.moveHorizontal('right');
  } 
  else if (e.keyCode == 38) {
    figureNew.rotate();
  }
  else if (e.keyCode == 13 && !document.querySelector('.new-modal').classList.contains('hidden')) {
    document.getElementById('start-game').click();
  }
});

function startGame() {
  
  let newLevel = [];
  for (let iRandom = 0; iRandom < 1000; iRandom++) {
    let newRandom = function getRandom() {
      return Math.round(Math.random() * 6);
    };
    newLevel[iRandom] = newRandom();
  }

  let tetris = document.createElement('div');
  tetris.classList.add('window__tetris');
  for (let i = 0; i < 180; i++) {
    let excel = document.createElement('div');
    excel.classList.add('window__cell');
    tetris.appendChild(excel);
  }
  document.getElementsByClassName('window__main')[0].appendChild(tetris);

  let excel = document.getElementsByClassName('window__cell');
  let i = 0;
  let previewItem = document.getElementsByClassName('item');
  let ip = 0;
  function setCellAttribute (elemsArr, lengthY, lengthX, nameAttribute, index, y) {
    if (!index) {
      index = 0
    }
    y ? y-- : y = lengthY;
    for (let x = 1; x <= lengthX; x++) {
      try {
        elemsArr[index].setAttribute(nameAttribute + 'X', x);
        elemsArr[index].setAttribute(nameAttribute + 'Y', y);
        elemsArr[index].dataset.pos = String(y).padStart(2, '0') + String(x).padStart(2, '0');
        index++;
      } catch (error) {
        debugger
      }
    }
    if (y > 1) {
      setCellAttribute (elemsArr, lengthY, lengthX, nameAttribute, index, y);
    }
  }

  setCellAttribute(excel, 18, 10, 'pos');
  setCellAttribute(previewItem, 4, 4, 'pr');

  let mainArr = [
    // I - figure (0)
    [
      [0, 1],
      [0, 2],
      [0, 3],
      // rotate 90
      [[-1, 1], [0, 0], [1, -1], [2, -2]],
      //rotate 180
      [[1, -1], [0, 0], [-1, 1], [-2, 2]],
      // rotate 270
      [[-1, 1], [0, 0], [1, -1], [2, -2]],
      //rotate 360
      [[1, -1], [0, 0], [-1, 1], [-2, 2]],
    ],
    // square-figure (1)
    [
      [1, 0],
      [0, 1],
      [1, 1],
      //rotate 90
      [[0, 0], [0, 0], [0, 0], [0, 0],],
      //rotate 180
      [[0, 0], [0, 0], [0, 0], [0, 0],],
      //rotate 270
      [[0, 0], [0, 0], [0, 0], [0, 0],],
      //rotate 360
      [[0, 0], [0, 0], [0, 0], [0, 0],],
    ],
    // lego-figure (2)
    [
      [1, 0],
      [2, 0],
      [1, 1],
      // rotate 90
      [[0, 2], [-1, 1], [-2, 0], [0, 0],],
      //rotate 180
      [[2, 0], [1, 1], [0, 2], [0, 0],],
      //rotate 270
      [[0, -2], [1, -1], [2, 0], [0, 0],],
      //rotate 360
      [[-2, 0], [-1, -1], [0, -2], [0, 0],],
    ],
    // L-figure (3)
    [
      [1, 0],
      [0, 1],
      [0, 2],
      // rotate 90
      [[0, 1], [-1, 0], [1, 0], [2, -1],],
      //rotate 180
      [[1, 1], [0, 2], [0, 0], [-1, -1],],
      //rotate 270
      [[1, -2], [2, -1], [0, -1], [-1, 0],],
      //rotate 360
      [[-2, 0], [-1, -1], [-1, 1], [0, 2],],
    ],
    // mirr-L-figure (4)
    [
      [1, 0],
      [1, 1],
      [1, 2],
      // rotate 90
      [[0, 1], [-1, 0], [0, -1], [1, -2],],
      // rotate 180
      [[1, 1], [0, 2], [-1, 1], [-2, 0],],
      // rotate 270
      [[1, -2], [2, -1], [1, 0], [0, 1],],
      // rotate 360
      [[-2, 0], [-1, -1], [0, 0], [1, 1],],
    ],
    // z-figure (5)
    [
      [1, 0],
      [-1, 1],
      [0, 1],
      // rotate 90
      [[-1, 1], [-2, 0], [1, 1], [0, 0],],
      // rotate 180
      [[1, -1], [2, 0], [-1, -1], [0, 0],],
      // rotate 270
      [[-1, 1], [-2, 0], [1, 1], [0, 0],],
      // rotate 360
      [[1, -1], [2, 0], [-1, -1], [0, 0],],
    ],
    // s-figure (6)
    [
      [1, 0],
      [1, 1],
      [2, 1],
      // rotete 90
      [[1, 0], [0, 1], [-1, 0], [-2, 1],],
      // rotete 180
      [[-1, 0], [0, -1], [1, 0], [2, -1],],
      // rotete 270
      [[1, 0], [0, 1], [-1, 0], [-2, 1],],
      // rotete 360
      [[-1, 0], [0, -1], [1, 0], [2, -1],],
    ]
  ];

let currentFigure = 0;
let figureBody = 0;
let rotate = 1;
let elNumber = 0;

function create() {
  let x = 5;
  let y = 15;
  let xp = 2;
  let yp = 1;

  rotate = 1;

  currentFigure = newLevel[elNumber]; //currentFigure = getRandom();
  currentFigurePreview = newLevel[elNumber + 1];
  figureBody = [
    document.querySelector(`[posX = "${x}"][posY = "${y}"]`),
    document.querySelector(`[posX = "${x + mainArr[currentFigure][0][0]}"][posY = "${y + mainArr[currentFigure][0][1]}"]`),
    document.querySelector(`[posX = "${x + mainArr[currentFigure][1][0]}"][posY = "${y + mainArr[currentFigure][1][1]}"]`),
    document.querySelector(`[posX = "${x + mainArr[currentFigure][2][0]}"][posY = "${y + mainArr[currentFigure][2][1]}"]`)
  ];
  for (let i = 0; i < figureBody.length; i++) {
    figureBody[i].classList.add('figure');
  }
  figurePreviewBody = [
    document.querySelector(`[prx = "${xp}"][pry = "${yp}"]`),
    document.querySelector(`[prx = "${xp + mainArr[currentFigurePreview][0][0]}"][pry = "${yp + mainArr[currentFigurePreview][0][1]}"]`),
    document.querySelector(`[prx = "${xp + mainArr[currentFigurePreview][1][0]}"][pry = "${yp + mainArr[currentFigurePreview][1][1]}"]`),
    document.querySelector(`[prx = "${xp + mainArr[currentFigurePreview][2][0]}"][pry = "${yp + mainArr[currentFigurePreview][2][1]}"]`)
  ];
  for (let ip = 0; ip < figurePreviewBody.length; ip++) {
    figurePreviewBody[ip].classList.add('green');
  }
}

create();
let inputField = document.getElementsByClassName('score')[0];
inputField.value = `Ваши очки: ${score}`;

// движение фигуры вниз
function move() {
  let moveFlag = true; // разрешение движения вниз
  let coordinates = [
    [figureBody[0].getAttribute('posX'), figureBody[0].getAttribute('posY')],
    [figureBody[1].getAttribute('posX'), figureBody[1].getAttribute('posY')],
    [figureBody[2].getAttribute('posX'), figureBody[2].getAttribute('posY')],
    [figureBody[3].getAttribute('posX'), figureBody[3].getAttribute('posY')],
  ];
  // для каждого элемента фигуры
  for (let i = 0; i < coordinates.length; i++) {
    // проверка можно ли двигаться вниз
    if (coordinates[i][1] == 1 || document.querySelector(`[posX = "${coordinates[i][0]}"][posY = "${coordinates[i][1] - 1}"]`).classList.contains('set')) {
      moveFlag = false;
      elNumber = elNumber + 1;
      for (let ip = 0; ip < figurePreviewBody.length; ip++) {
        figurePreviewBody[ip].classList.remove('green');
      }
      break;
    }
  }
  // движение вниз
  if (moveFlag) {
    for (let i = 0; i < figureBody.length; i++) {
      figureBody[i].classList.remove('figure');
    }
    figureBody = [
      document.querySelector(`[posX = "${coordinates[0][0]}"][posY = "${coordinates[0][1] - 1}"]`),
      document.querySelector(`[posX = "${coordinates[1][0]}"][posY = "${coordinates[1][1] - 1}"]`),
      document.querySelector(`[posX = "${coordinates[2][0]}"][posY = "${coordinates[2][1] - 1}"]`),
      document.querySelector(`[posX = "${coordinates[3][0]}"][posY = "${coordinates[3][1] - 1}"]`),
    ];
    for (let i = 0; i < figureBody.length; i++) {
      figureBody[i].classList.add('figure');
    }
    // фигура не может двигаться вниз
  } else {
    // перекрасить в цвет неподвижных
    for (let i = 0; i < figureBody.length; i++) {
      figureBody[i].classList.remove('figure');
      figureBody[i].classList.add('set');
    }
    // проверка, есть ли заполненные ряды
    for (let iLine = 1; iLine < 15; iLine++) { // перебор строк
      let count = 0; // если станет равным 10 - удалить строку (iLine)
      for (let k = 1; k < 11; k++) { // перебор столбцов
        if (document.querySelector(`[posX = "${k}"][posY= "${iLine}"]`).classList.contains('set')) {
          count++;
          if (count === 10) {
            // увеличение счета
            score += 10;
            inputField.value = `Ваши очки: ${score}`;
            // увеличение уровня
            level = Math.floor(score / 100) + 1;
            inputFieldLevel.value = `Текущий уровень: ${level}`;
            // увеличение скорости
            //newSpeed = Math.floor((level - 1) * 50);
            //console.log(newSpeed);

            inputFieldSpeed.value = `Текущяя скорость: ${totalSpeed.speed}`;
            // ----
            clearInterval(interval);
            totalSpeed.speed = startSpeed - (level * 10);
            interval = setInterval(() => {
              move();
            }, totalSpeed.speed);
            // ----
            // удаление (у каждой ячейки строки) класса, отвечающего за цвет неподвижного элемента
            for (let iColumnToRemove = 1; iColumnToRemove < 11; iColumnToRemove++) {
              document.querySelector(`[posX = "${iColumnToRemove}"][posY= "${iLine}"]`).classList.remove('set')
            }
            let set = document.querySelectorAll('.set'); // получить все ячейки с классом "set"
            let newSet = [];
            for (let s = 0; s < set.length; s++) { // перебор всех ячеек с классом "set"
              let setCoordinates = [set[s].getAttribute('posX'), set[s].getAttribute('posY')];
              // для всех ячеек с классом "set", находящихся выше строки iLine
              if (setCoordinates[1] > iLine) {
                set[s].classList.remove('set');
                newSet.push(document.querySelector(`[posX = "${setCoordinates[0]}"][posY= "${setCoordinates[1] - 1}"]`));
              }
            }
            for (let a = 0; a < newSet.length; a++) {
              newSet[a].classList.add('set');
            }
            iLine--;
          }
        }
      }
    }
    for (let n = 1; n < 11; n++) {
      if (document.querySelector(`[posX = "${n}"][posY = "15"]`).classList.contains('set')) {
        clearInterval(interval);
        console.log('Game over! Ваши очки - ' + score);
        //newModal.style.display = 'flex';
        //gameBox.classList.remove('active');
        break;
      }
    }
    create();
  }
}

// let interval = setInterval(() => {
//   move();
// }, totalSpeed.speed);

// window.addEventListener('keydown', function (e) {
//   let coordinates1 = [figureBody[0].getAttribute('posX'), figureBody[0].getAttribute('posY')];
//   let coordinates2 = [figureBody[1].getAttribute('posX'), figureBody[1].getAttribute('posY')];
//   let coordinates3 = [figureBody[2].getAttribute('posX'), figureBody[2].getAttribute('posY')];
//   let coordinates4 = [figureBody[3].getAttribute('posX'), figureBody[3].getAttribute('posY')];

//   function getNewState(a) {
//     flag = true;
//     let figureNew = [
//       document.querySelector(`[posX = "${+coordinates1[0] + a}"][posY = "${coordinates1[1]}"]`),
//       document.querySelector(`[posX = "${+coordinates2[0] + a}"][posY = "${coordinates2[1]}"]`),
//       document.querySelector(`[posX = "${+coordinates3[0] + a}"][posY = "${coordinates3[1]}"]`),
//       document.querySelector(`[posX = "${+coordinates4[0] + a}"][posY = "${coordinates4[1]}"]`),
//     ];
//     for (let i = 0; i < figureNew.length; i++) {
//       if (!figureNew[i] || figureNew[i].classList.contains('set')) {
//         flag = false;
//       }
//     }
//     if (flag) {
//       for (let i = 0; i < figureBody.length; i++) {
//         figureBody[i].classList.remove('figure');
//       }
//       figureBody = figureNew;
//       for (let i = 0; i < figureBody.length; i++) {
//         figureBody[i].classList.add('figure');
//       }
//     }
//   }

//   if (e.keyCode == 37) {
//     getNewState(-1);
//   } else if (e.keyCode == 39) {
//     getNewState(1);
//   } else if (e.keyCode == 40) {
//     move();
//   } else if (e.keyCode == 38) {
//     flag = true;
//     let figureNew = [
//       document.querySelector(`[posX = "${+coordinates1[0] + mainArr[currentFigure][rotate + 2][0][0]}"][posY = "${+coordinates1[1] + mainArr[currentFigure][rotate + 2][0][1]}"]`),
//       document.querySelector(`[posX = "${+coordinates2[0] + mainArr[currentFigure][rotate + 2][1][0]}"][posY = "${+coordinates2[1] + mainArr[currentFigure][rotate + 2][1][1]}"]`),
//       document.querySelector(`[posX = "${+coordinates3[0] + mainArr[currentFigure][rotate + 2][2][0]}"][posY = "${+coordinates3[1] + mainArr[currentFigure][rotate + 2][2][1]}"]`),
//       document.querySelector(`[posX = "${+coordinates4[0] + mainArr[currentFigure][rotate + 2][3][0]}"][posY = "${+coordinates4[1] + mainArr[currentFigure][rotate + 2][3][1]}"]`),
//     ];
//     for (let i = 0; i < figureNew.length; i++) {
//       if (!figureNew[i] || figureNew[i].classList.contains('set')) {
//         flag = false;
//       }
//     }
//     if (flag) {
//       for (let i = 0; i < figureBody.length; i++) {
//         figureBody[i].classList.remove('figure');
//       }
//       figureBody = figureNew;
//       for (let i = 0; i < figureBody.length; i++) {
//         figureBody[i].classList.add('figure');
//       }
//       if (rotate < 4) {
//         rotate++;
//       } else {
//         rotate = 1;
//       }
//     }
//   }
// });
}

function getNewLevel() {
  let arr = [];
  for (let iRandom = 0; iRandom < 30; iRandom++) {
    arr.push(Math.round(Math.random() * 6));
  }
  return arr;
}

function getParetByClass (el, cls) {
  while ((el = el.parentElement) && !el.classList.contains(cls));
  return el;
}