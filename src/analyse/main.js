import squarify from 'squarify'
import data from './data.json'

function name(str) {
  return 'i-' + str.replace(/^\.\//, '').split('.')[0]
}

function render(raw) {
  const $root = document.querySelector('#root')
  const frag = document.createDocumentFragment()
  raw.forEach(item => {
    const $el = document.createElement('div')
    frag.appendChild($el)
    $el.className = name(item.name)
    if (!item.relate) {
      $el.classList.add('folder')
    } else if (!item.relate.length) {
      $el.classList.add('endpoint')
    }
    $el.style.left = `${item.x0}%`
    $el.style.top = `${item.y0}%`
    $el.style.width = `${item.x1 - item.x0}%`
    $el.style.height = `${item.y1 - item.y0}%`
  })
  $root.appendChild(frag)
}


function countRelate(raw) {
  raw.forEach((item, idx) => {
    if (!item.relate) return
    item.relate.forEach(jsName => {
      count(name(item.name), name(jsName))
    })
  })
}

function renderRelate(raw, ctx) {
  raw.forEach((item, idx) => {
    if (!item.relate) return
    const srcId = `.${name(item.name)}`
    const $src = document.querySelector(srcId)
    item.relate.forEach(jsName => {
      const destId = `.${name(jsName)}`
      const $dest = document.querySelector(destId)
      connect(
        $src,
        $dest,
        ctx
      )
    })
  })
}

function count(srcId, destId) {
  if (!dict[destId]) return console.warn('return')
  if (!dict[destId].upper) {
    dict[destId].upper = []
  }
  dict[destId].upper.push(srcId)
}

function connect(src, dest, step = 1) {
  const ctx = $ctx
  if (!src || !dest || !ctx) return
  const raw = [src, dest].map($el => {
    const { x, y, width, height } = $el.getBoundingClientRect()
    return {
      x: x + width / 2,
      y: y + height / 2
    }
  })
  let opacity = .5 - step / 10
  if (opacity > 1) opacity = 1
  if (opacity < 0) opacity = 0
  const grad = ctx.createLinearGradient(raw[0].x, raw[0].y, raw[1].x, raw[1].y)
  grad.addColorStop(0, `rgba(0,0,200,${opacity})`)
  grad.addColorStop(1, `rgba(200,0,0,${opacity + .1})`)
  ctx.strokeStyle = grad

  ctx.beginPath()
  ctx.moveTo(raw[0].x, raw[0].y)
  ctx.lineTo(raw[1].x, raw[1].y)
  ctx.closePath()
  ctx.stroke()
}

function genDict(data) {
  const dict = {}
  data.forEach(item => {
    dict[name(item.name)] = item
  })
  return dict
}

function tip(e) {
  const current = e.target.classList[0]
  if (!current) return
  if (active === current) return
  active = current
  if (!dict[active]) return
  $tip.textContent = `${dict[active].name}
${dict[active].relate && dict[active].relate.join('\n')}
----------\n
${dict[active].upper && dict[active].upper.join('\n')}
    `
}

const cache = {}

function dotClick(e, step = 0) {
  const current = e instanceof Event ? e.target.classList[0] : e
  if (!current) return
  if(!dict[current].relate) return
  if (cache[current]) {
    return
  } else {
    cache[current] = true
  }
  if (step > 4) return
  dict[current].relate.forEach(next => {
    connect(document.querySelector(`.${current}`), document.querySelector(`.${name(next)}`), step)
    dotClick(name(next), step + 1)
  })
}

function dotClickReverse(e, step = 0) {
  const current = e instanceof Event ? e.target.classList[0] : e
  if (!current) return
  if(!dict[current].upper) return
  if (step > 4) return
  dict[current].upper.forEach(upper => {
    const upperName = upper
    if (cache[upperName]) {
      return
    } else {
      cache[upperName] = true
    }
    connect(document.querySelector(`.${upperName}`), document.querySelector(`.${current}`), step)
    dotClickReverse(upperName, step + 1)
  })
}


function main() {
  const dict = genDict(data)
  const container = { x0: 0, y0: 0, x1: 100, y1: 100 }
  const $canvas = document.querySelector('canvas')
  const $root = document.querySelector('#root')
  const $tip = document.querySelector('#tip')
  $canvas.width = $root.offsetWidth
  $canvas.height = $root.offsetHeight
  const ctx = $canvas.getContext('2d')

  window.data = data
  window.dict = dict
  window.$tip = $tip
  window.active = active
  window.connect = connect
  window.$ctx = ctx

  const raw = squarify(data, container)
  ctx.fillStyle = 'rgba(255,165,0,1)'

  render(raw)
  countRelate(raw)
  // renderRelate(raw, ctx)
  let active
  $root.addEventListener('mousemove', tip)

  $root.addEventListener('click', dotClickReverse)
}

main()
