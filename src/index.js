import squarify from 'squarify'
import _ from 'lodash'
import { files } from './data'
import {
  fileArrayToStructure,
  squarifyOne,
  squarifySeveral,
  noChildArr,
  fillData,
  getPath
} from './utils'
const layer = []
const data = fileArrayToStructure(files)
const container = { x0: 0, y0: 0, x1: 100, y1: 100 }
const blockDict = {}

let HOVER
let RESPONSING

function path2ClassName(pathStr) {
  return pathStr.replace(/\//g, '-').replace(/\./g, '_')
}

function renderFolderOneLayer(
  layerData,
  wrapper = document.querySelector('#root')
) {
  layerData.reduce((tmp, block, idx) => {
    const className = path2ClassName(getPath(block))
    blockDict[className] = block
    const el = document.createElement('div')
    el.classList.add('b', `b-${className}`)
    wrapper.appendChild(el)
    el.style.left = `${block.x0}%`
    el.style.top = `${block.y0}%`
    el.style.width = `${block.x1 - block.x0}%`
    el.style.height = `${block.y1 - block.y0}%`
    return tmp
  }, '')
}

function render() {
  requestAnimationFrame(() => {
    setTimeout(() => {
      render()
    }, 17)
  })
  if (RESPONSING === HOVER) return
  let last = RESPONSING
  RESPONSING = HOVER
  if (!RESPONSING) return
  if (last) {
    ;[].forEach.call(
      document.querySelector('#root').querySelectorAll('div'),
      el => (el.style.background = '')
    )
    // siblingsBg(last, el => (el.style.background = ''))
  }
  // siblingsBg(RESPONSING, el => (el.style.background = 'rgba(255,100,100,.8)'))
  let next = RESPONSING
  let alpha = 0.8
  while (next._parent) {
    siblingsBg(next, { a: alpha })
    next = next._parent
    alpha /= 1.5
  }
}

function siblingsBg(item, options = {}) {
  if (!item._parent) return
  const h = options.h || 0
  item._parent.children.forEach(siblings => {
    if (siblings.name === item.name) return
    toggleBg(
      siblings,
      Object.assign({}, options, { h: h + Math.random() * (255 - h) })
    )
  })
}

function toggleBg(item, options = {}) {
  const { h = 0, s = 100, l = 50, a = 0.8 } = options
  if (item.children) {
    item.children.forEach(subItem => {
      toggleBg(subItem, options)
    })
  } else {
    const className = path2ClassName(
      [getPath(item._parent), item.name].join('/')
    )
    document.querySelector(
      `.b-${className}`
    ).style.background = `hsla(${h}, ${s}%, ${l}%, ${a})`
  }
}

async function init(params) {
  const filled = fillData(data)
  console.warn('init', filled)
  const act1 = squarify(filled, container)
  const wrapper = document.querySelector('#root')
  renderFolderOneLayer(act1, wrapper)
  wrapper.addEventListener('mousemove', e => {
    const key = e.target.classList[1].replace('b-', '')
    HOVER = blockDict[key]
  })
  render()
}

Object.assign(window, {
  data,
  container,
  render,
  noChildArr,
  squarify,
  squarifyOne,
  fillData,
  getPath,
  blockDict,
  path2ClassName
})
setTimeout(() => {
  init()
}, 100)
