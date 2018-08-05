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
    siblingsBg(last, el => (el.style.background = ''))
  }
  siblingsBg(RESPONSING)
}

function siblingsBg(
  item,
  fn = el => (el.style.background = 'rgba(255,100,100,.5)')
) {
  if (!item._parent) return
  item._parent.children.forEach(siblings => {
    if (siblings.name === item.name) return
    toggleBg(siblings, fn)
  })
}

function toggleBg(
  item,
  fn = el => (el.style.background = 'rgba(255,100,100,.5)')
) {
  if (item.children) {
    item.children.forEach(subItem => {
      toggleBg(subItem, fn)
    })
  } else {
    const className = path2ClassName(
      [getPath(item._parent), item.name].join('/')
    )
    fn.call(null, document.querySelector(`.b-${className}`))
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
