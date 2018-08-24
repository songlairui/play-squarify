const fs = require('fs')
const path = require('path')
const babylon = require('babylon')
const Linter = require('eslint').Linter
const linter = new Linter()
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

    const code = fs.readFileSync(targetFile).toString()
    const ast = babylon.parse(code, conf)
    console.warn(code.slice(19))
    console.warn(code.slice(18))
    var unusedVars = linter
        .verify(
            code,
            {
                parser: 'babel-eslint',
                rules: {
                    'no-unused-vars': 'error'
                }
            },
            { filename: 'foo.js' }
        )
        .map(msg => {
            return {
                message: msg.message,
                line: msg.line,
                column: msg.column
            }
        })
    const pool = []
    walk.simple(ast, {
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
    console.warn(unusedVars, pool.map(item => [item.callee, item.loc]))
    return pool
        .filter(
            item =>
                !unusedVars.find(
                    unused =>
                        unused.line === item.loc.line &&
                        unused.column - 1 === item.loc.column
                )
        )
        .map(item => item.relate + '-' + item.callee)
}

console.log(JSON.stringify(test(), null, 1))
