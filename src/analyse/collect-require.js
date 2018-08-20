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
                pool.push(tmpPath)
            }
        }
    })
    return pool
}

function main() {
    const dirs = fs.readdirSync(targetDir)
    const result = dirs.map(dir => ({
        name: dir,
        relate: grabRequires(dir),
        value: 1
    }))
    console.warn(result)
    fs.writeFileSync('./data.json', JSON.stringify(result, null, 2))
    return result
}

main()
