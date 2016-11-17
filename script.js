/* global Vue alert */

const checkAround = (matrix, x, y, fn) => {
  for (let i = y - 1; i <= y + 1; i++) {
    for (let j = x - 1; j <= x + 1; j++) {
      if (i >= 0 && i < matrix.length && j >= 0 && j < matrix[i].length) {
        fn(matrix, j, i)
      }
    }
  }
}

const generateField = ({rows, columns, bombs}) => {
  const get2DArray = ({rows, columns, getDefaultValue}) => { // default value must be a function
    return Array(rows).fill().map(
      row => Array(columns).fill().map(getDefaultValue)
    )
  }

  const getCellObject = (content) => {
    return {
      content,
      isOpen: false,
      isFlagged: false
    }
  }

  const getAllCellsCoords = (rows, columns) => {
    const coordinates = []
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        coordinates.push({x: j, y: i})
      }
    }
    return coordinates
  }

  const getRandomNumber = range => Math.floor(Math.random() * range)

  const chooseRandomItems = (array, nrOfItems) => {
    const items = []
    for (let i = 0; i < nrOfItems; i++) {
      const index = getRandomNumber(array.length)
      items.push(array[index])
    }
    return items
  }

  const matrix = get2DArray({
    rows,
    columns,
    getDefaultValue: getCellObject.bind(null, '')
  })

  const allCells = getAllCellsCoords(rows, columns)
  const bombCells = chooseRandomItems(allCells, bombs)

  bombCells.forEach(cell => matrix[cell.y][cell.x].content = 'x')

  const markField = (field) => {
    const matrix = JSON.parse(JSON.stringify(field)) // make a copy of the field
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        if (matrix[i][j].content !== 'x') {
          let count = 0
          const countBombs = (matrix, x, y) => {
            if (matrix[y][x].content === 'x') {
              count += 1
            }
          }
          checkAround(matrix, j, i, countBombs)
          matrix[i][j].content = count || matrix[i][j].content
        }
      }
    }
    return matrix
  }
  const field = markField(matrix)
  return field
}

const open = (matrix, x, y) => matrix[y][x].isOpen = true

const settings = {
  rows: 16,
  columns: 16,
  bombs: 40
}
const matrix = generateField(settings)

const game = new Vue({
  el: '#app',
  data: {
    matrix
  },
  methods: {
    show (matrix, x, y) {
      const cell = matrix[y][x]
      if (!cell.isOpen && !cell.isFlagged) {
        open(matrix, x, y)
        if (!cell.content) {
          cell.content = ' '
          checkAround(matrix, x, y, this.show)
        }
        if (cell.content === 'x') {
          this.gameOver()
        }
      }
    },
    displayMatrix () {
      const matrix = this.matrix
      for (let i = 0; i < matrix.length; i++) {
        const cells = []
        for (let j = 0; j < matrix[i].length; j++) {
          cells.push(matrix[i][j].content)
        }
        console.log(cells)
      }
    },
    gameOver () {
      console.log('Game Over!')
      setTimeout(() => alert('Game Over!'), 100)
      setTimeout(this.restart, 101)
    },
    flag (x, y) {
      if (!this.matrix[y][x].isOpen) {
        this.matrix[y][x].isFlagged = !this.matrix[y][x].isFlagged
      }
    },
    restart () {
      this.matrix = generateField(settings)
    }
  }
})

console.log(game)
