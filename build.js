//生成初始数组
const sudokuTool = {
  generateRow(number = 0) {
    const rowArray = new Array(9);
    rowArray.fill(number);
    return rowArray;
  },

  generateColumn(number = 0) {
    const columnArray = new Array(9);
    columnArray.fill(this.generateRow(number));
    return columnArray;
  },

  //fisher-yates  洗牌算法
  shuffle(Arr) {
    const endIndex = Arr.length - 2;
    for (let i = 0; i <= endIndex; i++) {
      const j = Math.floor(Math.random() * (Arr.length - i)) + i;
      [Arr[i], Arr[j]] = [Arr[j], Arr[i]];
    }
    return Arr;
  },

  checkFill(Arr, number, rowIndex, columnIndex) {
    const row = Arr[rowIndex];
    const column = Arr.map((row) => row[columnIndex]);

    const boxIndex = Math.floor(rowIndex / 3) * 3 + Math.floor(columnIndex / 3);

    const box = boxTool.getBoxCell(Arr, boxIndex);
    return (
      box.includes(number) || column.includes(number) || row.includes(number)
    );
  },
};

const boxTool = {
  getBoxCell(Arr, boxIndex) {
    const startRowIndex = Math.floor(boxIndex / 3) * 3;
    const startColIndex = (boxIndex % 3) * 3;
    const box = [];
    for (let i = 0; i < 9; i++) {
      const rowIndex = startRowIndex + Math.floor(i / 3);
      const colIndex = startColIndex + (i % 3);
      box.push(Arr[rowIndex][colIndex]);
    }
    return box;
  },
};

const testArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const rowIndexE = [0, 0, 0, 0, 0, 0, 0, 0, 0];

const Sudoku = {
  //生成
  generate() {
    this.array = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
    this.orders = sudokuTool
      .generateColumn()
      .map((row) => row.map((v, i) => i))
      .map((row) => sudokuTool.shuffle(row));

    for (let i = 1; i <= 9; i++) {
      this.fill(i);
    }
    this.array[8] = rowIndexE;
  },
  fill(number) {
    this.fillRow(number, 0);
  },
  fillRow(number, rowIndex) {
    const row = this.array[rowIndex];
    const order = this.orders[rowIndex];

    if (rowIndex > 8) {
      return true;
    }
    for (let index = 0; index < 9; index++) {
      const columnIndex = order[index];
      //该位置有数据
      if (row[columnIndex]) {
        continue;
      }
      //检查该位置是否可以填入，检测宫，行，列是否有该数据
      if (sudokuTool.checkFill(this.array, number, rowIndex, columnIndex)) {
        continue;
      }
      row[columnIndex] = number;
      if (rowIndex === 8) {
        rowIndexE[columnIndex] = number;
      }
      //当前填写成功，递归调用
      if (this.fillRow(number, rowIndex + 1)) {
        row[columnIndex] = 0;
        continue;
      }
      return true;
    }

    return false;
  },
};

Sudoku.generate();
const sudokuArray = Sudoku.array;

const content = document.querySelector("#content");
const numberList = document.querySelectorAll(".click_number");
const setNumber = {
  value: "",
};
let nowSudokuPoint = null;

const setNumberProxy = new Proxy(setNumber, {
  set: function (obj, prop, value) {
    if (nowSudokuPoint == null) {
      return;
    } else {
      nowSudokuPoint.innerHTML = value;
    }
  },
});

numberList.forEach((i) => {
  i.addEventListener("click", (e) => {
    setNumberProxy.value = e.target.innerHTML;
  });
});

// 初始化数独视图
for (let i = 0; i < sudokuArray.length; i++) {
  const outsideDiv = document.createElement("div");
  outsideDiv.className = "row";
  sudokuArray[i].forEach((e, v) => {
    const div = document.createElement("div");
    if (e) {
      div.innerHTML = e;
      div.id = "cannotClick";
    } else {
      div.innerHTML = "";
      div.addEventListener("click", (e) => {
        nowSudokuPoint = div;
      });
    }
    const side = (v + 1) % 3;
    if (side === 1) {
      div.className = "point row_left";
    } else if (side === 2) {
      div.className = "point row_content";
    } else {
      div.className = "point row_right";
    }

    outsideDiv.appendChild(div);
  });
  content.appendChild(outsideDiv);
}
