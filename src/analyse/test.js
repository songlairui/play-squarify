const fs = require('fs')
const path = require('path')
const babylon = require('babylon')
const unused = require('unused')
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
        '/opt/wechat_web_devtools/package.nw/js/25d0beb4120ce2acafb4e03b95444fda.js'

    const code = fs.readFileSync(targetFile)
    const unusedArr = unused(code)
    const ast = babylon.parse(code.toString(), conf)
    const pool = []
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
                    if (ignoreRelate.includes(candiate)) return
                    if (pool.find(item => item.relate === candiate)) return
                    pool.push({
                        relate: candiate,
                        callee: calleeName,
                        loc: { ...declarNode.loc.start }
                    })
                }
            }
        }
    })
    // console.warn(unusedArr, pool.map(item => [item.callee, item.loc]))
    return pool
        .filter(item =>
            !unusedArr.find(
                unused =>
                    unused.loc.line === item.loc.line &&
                    unused.loc.column === item.loc.column
            )
        )
        .map(item => item.relate + '-' + item.callee)
}

console.log(JSON.stringify(test(), null, 1))
