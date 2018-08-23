const fs = require('fs')
const path = require('path')
const babylon = require('babylon')
const { entry: ignoreEntry, bits: ignoreRelate } = require('../g6/ignoreList')
const conf = {
    sourceType: 'module',
    plugins: ['jsx', 'flow', 'dynamicImport', 'objectRestSpread']
}
const walk = require('babylon-walk')

function name(str) {
    return str.replace(/^\.\//, '').split('.')[0]
}

function test() {
    const targetFile =
        '/opt/wechat_web_devtools/package.nw/js/41168dca39589e852da6631126d0f94d.js'

    const code = fs.readFileSync(targetFile).toString()
    const ast = babylon.parse(code, conf)
    let total = []
    // console.warn((ast.program.body))
    // return
    let mainAst = ast.program.body
    mainAst.forEach(node => {
        if (
            node.type === 'ExpressionStatement' &&
            node.expression.type === 'UnaryExpression' &&
            node.expression.argument.callee.type === 'FunctionExpression'
        ) {
            mainAst = node
            return
        }
    })

    walk.simple(mainAst, {
        BlockStatement(blockNode) {
            const constants = {}
            const allcallee = {}
            const pool = []
            walk.simple(blockNode, {
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
                            ['require', 'directRequire'].includes(
                                callNode.callee.name
                            )
                        ) {
                            const tmpPath = callNode.arguments[0].value
                            if (!tmpPath) return
                            if (tmpPath.indexOf('.')) return
                            if (tmpPath.split('/').length > 2) return
                            const candiate = name(tmpPath)
                            if (pool.find(item => item.relate === candiate))
                                return
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
            const bPool = pool.filter(item => dict[item.callee])
            total = total.concat(bPool)
            console.warn('dict in block', Object.keys(allcallee), Object.keys(constants), pool)
        }
    })
    // console.warn(Object.keys(allcallee), Object.keys(constants))
    return total
}

console.log(test())
