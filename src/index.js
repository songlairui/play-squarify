import squarify from 'squarify'
import { files } from './data'
import { fileArrayToStructure, squarifyOne } from './utils'

const data = fileArrayToStructure(files)
const container = { x0: 0, y0: 0, x1: 100, y1: 100 }

function calc() {
  const output = squarifyOne(data, container)
  console.log('test', output)
  window.output = output
}
function render() {
  const wrapper = document.querySelector('#root')
  output.forEach((block, i) => {
    let el = document.querySelector(`.b-${i}`)
    if (!el) {
      el = document.createElement('div')
      el.classList.add('b', `b-${i}`)
      wrapper.appendChild(el)
    }
    el.style.left = `${block.x0}vw`
    el.style.top = `${block.y0}vh`
    el.style.width = `${block.x1 - block.x0}vw`
    el.style.height = `${block.y1 - block.y0}vh`
  })
}
function init() {
  calc()
  render()
  const $tip = document.querySelector('#tip')
  window.addEventListener('mousemove', e => {
    $tip.style.left = `${e.x}px`
    $tip.style.top = `${e.y}px`
    const block = (
      [].find.call(e.target.classList, a => a.indexOf('-') > -1) || ''
    ).replace('b-', '')
    const meta = output[+block]
    if (meta) {
      $tip.textContent = `${meta.name}
${meta.full}
`
    }
  })
}
setTimeout(() => {
  init()
}, 100)
