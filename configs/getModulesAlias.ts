import * as path from 'path'
import * as fs from 'fs'

export const getAliasNameMap = () => {
    const modulesPaths = path.join(__dirname, '../src', 'modules')

    const aliasMap: Record<string, string> = {}

    const files = fs.readdirSync(modulesPaths)

    if (files && files.length) {
        files.forEach(file => {
            const projectDir = path.join(modulesPaths, file)

            const projectDirStats = fs.statSync(projectDir)

            if (projectDirStats?.isDirectory()) {
                try {
                    const configPath = path.join(projectDir, 'config.json')

                    if (configPath) {
                        const content = fs.readFileSync(configPath, 'utf-8')
                        const object = JSON.parse(content)

                        if (object.aliasName) {
                            aliasMap[`${object.aliasName}`] = path.resolve(projectDir)
                        }
                        console.log(JSON.parse(content))
                    }
                } catch (e) {
                    console.warn(e)
                }
            }
        })
    }

    return aliasMap
}
