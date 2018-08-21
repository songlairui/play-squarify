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

function renderRelate(raw, ctx) {
  raw.forEach((item, idx) => {
    if (!item.relate) return
    const $src = document.querySelector(`.${name(item.name)}`)
    item.relate.forEach(jsName => {
      const $dest = document.querySelector(`.${name(jsName)}`)
      connect(
        $src,
        $dest,
        ctx
      )
    })
  })
}
function connect(src, dest, ctx) {
  if (!src || !dest || !ctx) return
  const raw = [src, dest].map($el => {
    const { x, y, width, height } = $el.getBoundingClientRect()
    return {
      x: x + width / 2,
      y: y + height / 2
    }
  })

  const grad = ctx.createLinearGradient(raw[0].x, raw[0].y, raw[1].x, raw[1].y)
  grad.addColorStop(0, 'rgba(0,0,200,.0)')
  grad.addColorStop(1, 'rgba(200,0,0,.1)')
  ctx.strokeStyle = grad

  ctx.beginPath()
  ctx.moveTo(raw[0].x, raw[0].y)
  ctx.lineTo(raw[1].x, raw[1].y)
  ctx.closePath()
  ctx.stroke()
}
function connect0(src, dest) {
  if (!src || !dest) return
  const raw = [src, dest].map($el => {
    const { x, y, width, height } = $el.getBoundingClientRect()
    return {
      x: x + width / 2,
      y: y + height / 2
    }
  })

  const { length, angle } = calc(raw[0], raw[1])
  const $line = document.createElement('div')
  $line.style.width = `${length}px`
  $line.style.transform = `rotate(${angle}deg)`
  $line.style.left = `${raw[0].x}px`
  $line.style.top = `${raw[0].y}px`
  document.querySelector('.lines').appendChild($line)
}

function calc(pointA, pointB) {
  const dX = pointA.x - pointB.x
  const dY = pointA.y - pointB.y
  const length = Math.sqrt(dX * dX + dY * dY)
  const angle = (Math.asin(dY / dX) * 180) / Math.PI
  return { length, angle }
}

function genDict(data) {
  const dict = {}
  data.forEach(item => {
    dict[name(item.name)] = item
  })
  return dict
}

function tip(e) {
  const current = e.target.className
  if (!current) return
  if (active === current) return
  active = current
  if (!dict[active]) return
  $tip.textContent = `${dict[active].name}
${dict[active].relate && dict[active].relate.join('\n')}
    `
}

function listen() {}

function main() {
  const dict = genDict(data)
  const container = { x0: 0, y0: 0, x1: 100, y1: 100 }
  const raw = squarify(data, container)
  const $canvas = document.querySelector('canvas')
  const $root = document.querySelector('#root')
  const $tip = document.querySelector('#tip')
  $canvas.width = $root.offsetWidth
  $canvas.height = $root.offsetHeight
  const ctx = $canvas.getContext('2d')
  ctx.fillStyle = 'rgba(255,165,0,1)'

  render(raw)
  renderRelate(raw, ctx)
  let active
  $root.addEventListener('mousemove', tip)
  window.data = data
  window.dict = dict
  window.$tip = $tip
  window.active = active
  window.connect = connect
}

main()
