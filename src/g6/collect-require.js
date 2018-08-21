const fs = require('fs')
const path = require('path')
const babylon = require('babylon')

const targetDir = '/opt/wechat_web_devtools/package.nw/js'
const conf = {
    sourceType: 'module',
    plugins: ['jsx', 'flow', 'dynamicImport', 'objectRestSpread']
}
const debug = false
const logger = (...x) => debug && console.warn(...x)
const walk = require('babylon-walk')

function name(str) {
    return str.replace(/^\.\//, '').split('.')[0]
}

function grabRequires(file) {
    const targetFile = path.resolve(targetDir, file)
    if (!/\.js$/.test(targetFile) || !fs.statSync(targetFile).isFile())
        return undefined
    const code = fs.readFileSync(targetFile).toString()
    const ast = babylon.parse(code, conf)
    const pool = []
    walk.simple(ast, {
        CallExpression(callNode) {
            if (
                callNode.callee.type === 'Identifier' &&
                callNode.callee.name === 'require'
            ) {
                const tmpPath = callNode.arguments[0].value
                if (!tmpPath) return
                if (tmpPath.indexOf('.')) return
                if (tmpPath.split('/').length > 2) return
                const candiate = name(tmpPath)
                if (pool.indexOf(candiate) > -1) return
                pool.push(candiate)
            }
        }
    })
    return pool
}

function main() {
    const dirs = fs.readdirSync(targetDir)
    const nodes = [],
        edges = []
    const result = dirs.map(dir => {
        const relate = grabRequires(dir)
        if (!dir) console.warn(dir)
        const uuid = name(dir)
        const node = {
            id: uuid,
            labels: ['File'],
            properties: { keyNo: uuid, role: '备注', name: uuid },
            type: 'File',
            name: uuid,
            degree: 5
        }
        nodes.push(node)
        relate && relate.forEach(destId => {
            const edge = {
                id: `${uuid}-${destId}`,
                type: 'EMPLOY',
                properties: { role: '董事' },
                source: uuid,
                target: destId
            }
            edges.push(edge)
        })
        return {
            name: dir,
            value: 1,
            relate
        }
    })
    const demoData = { nodes, edges }
    fs.writeFileSync('./data.json', JSON.stringify(demoData, null, 2))
    return { result, demoData }
}

main()
