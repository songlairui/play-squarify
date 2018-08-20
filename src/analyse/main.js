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
        $el.style.left = `${item.x0}%`
        $el.style.top = `${item.y0}%`
        $el.style.width = `${item.x1 - item.x0}%`
        $el.style.height = `${item.y1 - item.y0}%`
    })
    $root.appendChild(frag)
}

function renderRelate(raw) {
    raw.forEach((item, idx) => {
        if (!item.relate) return
        const $src = document.querySelector(`.${name(item.name)}`)
        item.relate.forEach(jsName => {
            const $dest = document.querySelector(`.${name(jsName)}`)
            connect(
                $src,
                $dest
            )
        })
    })
}

function connect(src, dest) {
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

function main() {
    const container = { x0: 0, y0: 0, x1: 100, y1: 100 }
    const raw = squarify(data, container)
    render(raw)
    renderRelate(raw)
    window.connect = connect
}

main()
