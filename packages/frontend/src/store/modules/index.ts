const requireModule = require.context('.', true, /\.ts$/)
const modules = {}

requireModule.keys().forEach(fileName => {
    if (fileName === './index.ts') return

    // Replace ./ and .js
    const path = fileName.replace(/(\.\/|\.ts)/g, '')
    const [moduleName, imported] = path.split('/')

    // @ts-ignore
    if (!modules[moduleName]) {
        // @ts-ignore
        modules[moduleName] = {
            namespaced: true,
        }
    }

    // @ts-ignore
    modules[moduleName][imported] = requireModule(fileName).default
})

export default modules
