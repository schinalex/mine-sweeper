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
    matrix[cell.y][cell.x].content = 'X'
  })
  return matrix
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
