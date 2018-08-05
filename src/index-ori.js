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

// 缓存层
function cacheLayer() {
  const idx = layer.length
  // 下一层是最后一层的每个children连接起来的数组
  const nextLayer = (layer[idx - 1] || [{ children: data }]).reduce(
    (result, item) => result.concat(item.children || []),
    []
  )
  // 如果有的话，就表示上一层的缓存结束
  // 如果没有，表示上一层是最后一层，不用再缓存了。 这个结果要不要缓存住？
  if (nextLayer.length) {
    layer[idx] = nextLayer
    return true
  }
  return false
}

// 反 cacheLayer
function deCacheLayer() {
  if (!layer.length) return false
  // 将最后一层的children全部删除，然后重新render
  layer[layer.length - 1].forEach(item => delete item.children)
  layer.length -= 1
  render()
  return true
}
/**
 * 改造之前
  */
// 隐藏layer
function hideLayer(idx = 1) {
  if (!layer[idx]) return
  layer[idx].forEach(item => {
    if (item.children) {
      item.children = item.children.map(son => {
        return new Proxy(son, {
          get(target, prop) {
            if (prop === '__target__') return target
            if (prop === 'children') return undefined
            return target[prop]
          }
        })
      })
    }
  })
}

// 隐藏layer, 当前层无法操作，只能操作下一层？！
// 除非对象中存储一个上一层的变量，等了解数据结构之后再尝试
// function hideLayer(idx = 1) {
//   if (!layer[idx]) return
//   layer[idx].forEach(item => {
//     if (item.children) {
//       item.children.splice(
//         1,
//         Infinity,
//         item.children.map(son => {
//           console.warn(son.__target__ ? '-- Proxy' : '-- -raw')
//           const rawSon = son.__target__ || son
//           return new Proxy(son, {
//             get(target, prop, receiver) {
//               if (prop === 'children') return undefined
//               if (prop === '__target__') return target
//               if (prop !== 'value') return Reflect.get(target, prop, receiver)
//               if (target.value !== undefined) return target.value
//               const value = target.children.reduce((a, b) => a + b.value, 0) // 求和
//               target.value = value
//               return value
//             }
//           })
//         })
//       )
//     }
//   })
// }

function showLayer(idx) {
  if (!layer[idx]) return
  layer[idx].forEach(item => {})
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
    return
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
  deCacheLayer,
  hideLayer,
  showLayer
})
setTimeout(() => {
  init()
}, 100)
