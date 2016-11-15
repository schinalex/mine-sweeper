/* global Vue */

const generateField = ({rows, columns, bombs}) => {
  const get2DArray = ({rows, columns, getDefaultValue}) => { // default value must be a function
    return Array(rows).fill().map(
      row => Array(columns).fill().map(getDefaultValue)
    )
  }
  const getCellObject = (content) => {
    return {content, isOpen: false}
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
  const matrix = get2DArray({
    rows,
    columns,
    getDefaultValue: getCellObject.bind(null, '')
  })
  const getRandomNumber = range => Math.floor(Math.random() * range)
  const chooseRandomItems = (array, nrOfItems) => {
    const items = []
    for (let i = 0; i < nrOfItems; i++) {
      const index = getRandomNumber(array.length)
      items.push(array[index])
    }
    return items
  }
  const allCells = getAllCellsCoords(rows, columns)
  const bombCells = chooseRandomItems(allCells, bombs)
  bombCells.forEach(cell => {
    matrix[cell.y][cell.x].content = 'x'
  })
  const countBombs = (matrix, x, y) => {
    let count = 0
    for (let i = y - 1; i <= y + 1; i++) {
      for (let j = x - 1; j <= x + 1; j++) {
        if (i >= 0 && i < matrix.length && j >= 0 && j < matrix[i].length && matrix[i][j].content === 'x') {
          count += 1
        }
      }
    }
    return count
  }
  const markField = (field) => {
    const matrix = JSON.parse(JSON.stringify(field)) // make a copy of the field
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        if (matrix[i][j].content !== 'x') {
          matrix[i][j].content = countBombs(matrix, j, i) || matrix[i][j].content
        }
      }
    }
    return matrix
  }
  const field = markField(matrix)
  return field
}
const settings = {
  rows: 10,
  columns: 10,
  bombs: 10
}
const matrix = generateField(settings)

const vm = new Vue({
  el: '#app',
  data: {
    matrix
  },
  methods: {
    show (x, y) {
      this.matrix[y][x].isOpen = true
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
    }
  }
})

console.log(vm)
