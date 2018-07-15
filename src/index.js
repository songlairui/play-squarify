import squarify from 'squarify'
import { files } from './data'
import {
  fileArrayToStructure,
  squarifyOne,
  squarifySeveral,
  noChildArr
} from './utils'
const layer = []
const data = fileArrayToStructure(files)
const container = { x0: 0, y0: 0, x1: 100, y1: 100 }

function cacheLayer() {
  const idx = layer.length
  const nextLayer = (layer[idx - 1] || [{ children: data }]).reduce(
    (result, item) => result.concat(item.children || []),
    []
  )
  if (nextLayer.length) {
    layer[idx] = nextLayer
    return true
  }
  return false
}
function deCacheLayer() {
  if (!layer.length) return false
  layer[layer.length - 1].forEach(item => delete item.children)
  layer.length -= 1
  render()
  return true
}

let cache = data.reduce(
  (result, item) => result.concat(item.children || []),
  []
)

function calc() {
  // console.warn(data.map(a => a.value)) // 触发所有Proxy的getter
  const output = squarifyOne(data, container, 4)
  console.log('test', output)
  window.output = output
}
function render(output = squarify(data, container)) {
  const wrapper = document.querySelector('#root')
  ;[].reduceRight.call(wrapper.childNodes, (_, el) => el && el.remove(), '')
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
async function init() {
  while (cacheLayer()) {
    console.warn('cacheLayer')
  }
  render()
  ;(function animate() {
    requestAnimationFrame(() => setTimeout(() => animate(), 200))
    deCacheLayer()
  })()
}
Object.assign(window, {
  data,
  container,
  render,
  noChildArr,
  squarify,
  squarifyOne,
  layer,
  cacheLayer,
  deCacheLayer
})
setTimeout(() => {
  init()
}, 100)
