const fs = require('fs')
const path = require('path')
const babylon = require('babylon')

const { entry: ignoreEntry, bits: ignoreRelate } = require('./ignoreList')
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
    if (ignoreEntry.includes(name(file))) { return []}
    const code = fs.readFileSync(targetFile).toString()
    const ast = babylon.parse(code, conf)
    const pool = []
    const constants = {}
    const allcallee = {}

    walk.simple(ast, {
        FunctionExpression(funcNode) {
            funcNode.params.map(iNode => {
                if (iNode.type !== 'Identifier')
                    return console.warn('// todo', iNode.type)
                constants[iNode.name] = false
            })
        },
        VariableDeclarator(declarNode) {
            let calleeName = declarNode.id.name
            if (!calleeName) {
                if (!declarNode.id.properties) return
                calleeName = declarNode.id.properties
                    .map(node => node.value.name)
                    .join()
            }
            if (!declarNode.init) return
            if (declarNode.init.type === 'CallExpression') {
                const callNode = declarNode.init
                if (
                    callNode.callee.type === 'Identifier' &&
                    ['require', 'directRequire'].includes(callNode.callee.name)
                ) {
                    const tmpPath = callNode.arguments[0].value
                    if (!tmpPath) return
                    if (tmpPath.indexOf('.')) return
                    if (tmpPath.split('/').length > 2) return
                    const candiate = name(tmpPath)
                    if (pool.find(item => item.relate === candiate)) return
                    if (ignoreRelate.includes(candiate)) return
                    pool.push({
                        relate: candiate,
                        callee: calleeName
                    })
                } else {
                    constants[calleeName] = false
                }
            } else {
                constants[calleeName] = false
            }
        },
        Identifier(idNode) {
            if (!allcallee[idNode.name]) {
                allcallee[idNode.name] = true
            }
        }
    })
    const dict = { ...allcallee, ...constants }
    return pool.filter(item => dict[item.callee]).map(item => item.relate)
}

function main() {
    const dirs = fs.readdirSync(targetDir)
    const nodes = {},
        edges = []
    const result = dirs.map(dir => {
        const relate = grabRequires(dir) || []
        if (!dir) console.warn(dir)
        const uuid = name(dir)
        if (!nodes[uuid]) {
            nodes[uuid] = {
                id: uuid,
                type: 'File',
                name: uuid,
                upper: {},
                relate
            }
        } else {
            Object.assign(nodes[uuid], { relate })
            delete nodes[uuid].pre
        }

        relate &&
            relate.forEach(destId => {
                const edge = {
                    source: uuid,
                    target: destId
                }
                if (!nodes[destId]) {
                    nodes[destId] = {
                        pre: 1,
                        id: destId,
                        type: 'File',
                        name: destId,
                        upper: {}
                    }
                }
                nodes[destId].upper[uuid] = 1
                edges.push(edge)
            })
        return {
            name: dir,
            value: 1,
            relate
        }
    })
    relatingNode = Object.values(nodes).filter(node => node.relate.length || Object.keys(node.upper).length)
    const demoData = { nodes: relatingNode, links: edges }
    const destFile = '/media/idoz/code/github/3d-force-graph/example/datasets/data.json'
    fs.writeFileSync(destFile, JSON.stringify(demoData, null, 2))
    return { result, demoData }
}

main()
