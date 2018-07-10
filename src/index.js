import squarify from 'squarify'

const data = [
  {
    name: 'Azura',
    value: 6,
    color: 'red'
  },
  {
    name: 'Seth',
    value: 5,
    color: '',
    children: [
      {
        name: 'Noam',
        value: 3,
        color: 'orange'
      },
      {
        name: 'Enos',
        value: 2,
        color: 'yellow'
      }
    ]
  },
  {
    name: 'Awan',
    value: 5,
    color: '',
    children: [
      {
        name: 'Enoch',
        value: 5,
        color: 'green'
      }
    ]
  },
  {
    name: 'Abel',
    value: 4,
    color: 'blue'
  },
  {
    name: 'Cain',
    value: 1,
    color: 'indigo'
  }
]
const container = { x0: 0, y0: 0, x1: 100, y1: 80 }

function calc() {
  const output = squarify(data, container)
  console.log('test', output)
  window.output = output
}
function init() {
  calc()
}
setTimeout(() => {
  init()
}, 100)
