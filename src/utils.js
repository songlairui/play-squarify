import squarify from 'squarify'

export function squarifyOne(arr, ...x) {
  return squarify.call(
    null,
    arr.map(
      obj =>
        new Proxy(obj, {
          get(target, prop, receiver) {
            if (prop === 'children') return undefined
            return Reflect.get(target, prop, receiver)
          }
        })
    ),
    ...x
  )
}
export function fileArrayToStructure(arr) {
  const raw = {}
  let file = arr.pop()
  while (file) {
    const folders = file.split('/')
    const basename = folders.pop()
    folders.reduce((_, folder, idx) => {
      const fullPath = folders.slice(0, idx + 1).join('/')
      const parentPath = folders.slice(0, idx).join('/')
      if (!raw[fullPath]) {
        raw[fullPath] = new Proxy(
          {
            name: folder,
            type: 'folder',
            full: fullPath,
            children: []
          },
          {
            get(target, prop, receiver) {
              if (prop !== 'value') return Reflect.get(target, prop, receiver)
              if (target.value !== undefined) return target.value
              const value = target.children.reduce((a, b) => a + b.value, 0) // 求和
              target.value = value
              return value
            }
          }
        )
        if (parentPath) {
          console.assert(raw[parentPath], '按执行顺序，应该已有parentPath')
          raw[parentPath].children.push(raw[fullPath])
        }
      }
    }, '')
    let item = {
      value: 1,
      name: basename,
      type: 'file',
      full: file
    }
    // 文件作为叶子
    if (folders.length) {
      raw[folders.join('/')].children.push(item)
    } else {
      raw[file] = item
    }
    file = arr.pop()
  }
  console.warn(raw)
  return Object.keys(raw)
    .filter(key => key.indexOf('/') === -1)
    .map(key => raw[key])
}
