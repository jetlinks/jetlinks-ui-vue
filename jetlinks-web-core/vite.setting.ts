import { theme } from 'ant-design-vue/lib'
import customTheme from './configs/theme'
import convertLegacyToken from 'ant-design-vue/lib/theme/convertLegacyToken'
import fs from 'fs'
import path from 'path'
import { loadEnv } from 'vite'
import dotenv from 'dotenv'

export const v3Token = () => {
  const { defaultAlgorithm, defaultSeed } = theme
  const mapToken = defaultAlgorithm({ ...defaultSeed, ...customTheme })
  return convertLegacyToken(mapToken)
}

export const federationSharedMap = {
  vue: ['vue'],
  'vue-router': ['vue-router'],
  pinia: ['pinia'],
  'vue-i18n': ['vue-i18n'],
  'lodash-es': ['lodash-es'],
  echarts: ['echarts'],
  '@jetlinks-web/core': ['@jetlinks-web/core'],
  '@jetlinks-web/hooks': ['@jetlinks-web/hooks'],
  '@jetlinks-web/constants': ['@jetlinks-web/constants']
  // '@jetlinks-web/utils': ['@jetlinks-web/utils'],
}

const parseEnvFile = (envPath: string): Record<string, string> => {
  if (!fs.existsSync(envPath)) {
    return {}
  }

  return dotenv.parse(fs.readFileSync(envPath))
}

const getRootEnvOverride = (envDir: string, mode: string) => {
  const rootEnvPath = path.resolve(envDir, '.env')
  const fallbackEnvPath = path.resolve(envDir, '.env.development')
  const modeEnvPath = path.resolve(envDir, `.env.${mode}`)
  const envFiles = fs.existsSync(rootEnvPath)
    ? [rootEnvPath]
    : [fallbackEnvPath]

  if (modeEnvPath !== envFiles[envFiles.length - 1]) {
    envFiles.push(modeEnvPath)
  }

  return envFiles.reduce<Record<string, string>>((acc, envPath) => ({
    ...acc,
    ...parseEnvFile(envPath)
  }), {})
}

export const getMergedEnv = (mode: string, envDir: string) => {
  const rootEnvOverride = getRootEnvOverride(envDir, mode)

  console.log('default', loadEnv(mode, __dirname, ''))
  console.log('env', rootEnvOverride)
  console.log('getRuntimeAppEnv', getRuntimeAppEnv())

  return {
    ...loadEnv(mode, __dirname, ''),
    ...rootEnvOverride,
    ...getRuntimeAppEnv()
  } as Partial<ImportMetaEnv>
}

export const getDefine = (
  env: Partial<ImportMetaEnv>,
  mode: string,
  isDev: boolean,
  mavenName: string,
  publicPath: string
) => {

  const envDefine = Object.entries(env).reduce((acc, [key, val]) => {
    if (key.startsWith('VITE_')) {
      acc[`import.meta.env.${key}`] = JSON.stringify(val)
    }
    return acc
  }, {} as Record<string, string>)

  envDefine['import.meta.env.BASE_URL'] = JSON.stringify(publicPath)
  envDefine['import.meta.env.MODE'] = JSON.stringify(mode)
  envDefine['import.meta.env.DEV'] = String(isDev)
  envDefine['import.meta.env.PROD'] = String(!isDev)
  envDefine['import.meta.env.SSR'] = 'false'
  envDefine['import.meta.env.VITE_MODULE_NAME'] = JSON.stringify(mavenName)

  return envDefine
}

const parseCliAppEnv = () => {
  const cliEnv: Record<string, string> = {}

  for (let i = 0; i < process.argv.length; i += 1) {
    const arg = process.argv[i]
    if (!arg.startsWith('--VITE_APP_')) {
      continue
    }

    const rawArg = arg.slice(2)
    const equalIndex = rawArg.indexOf('=')

    if (equalIndex !== -1) {
      const key = rawArg.slice(0, equalIndex)
      const value = rawArg.slice(equalIndex + 1)
      cliEnv[key] = value
      continue
    }

    const nextArg = process.argv[i + 1]
    if (typeof nextArg === 'string' && !nextArg.startsWith('--')) {
      cliEnv[rawArg] = nextArg
      i += 1
    }
  }

  return cliEnv
}

export const getRuntimeAppEnv = () => {
  const processAppEnv = Object.entries(process.env).reduce((acc, [key, value]) => {
    if (key.startsWith('VITE_APP_') && value !== undefined) {
      acc[key] = value
    }
    return acc
  }, {} as Record<string, string>)

  return {
    ...processAppEnv,
    ...parseCliAppEnv()
  }
}

export const getFederationSetting = (mavenName: string, envDir: string) => {
  return {
    name: mavenName ? `${mavenName}` : 'host',
    remotes: {},
    enableDynamicRemotes: true,
    filename: mavenName ? 'remoteEntry.js' : undefined,
    isHost: true,
    shared: Object.keys(federationSharedMap),
    exposes: mavenName
      ? {
        [mavenName]: path.resolve(envDir, `modules/${mavenName}/register.ts`)
      }
      : undefined
  }
}

export const getModulesName = (): { moduleNames?: string[], moduleName?: string } => {
  const moduleNameIndex = process.argv.indexOf('--module-name')
  let moduleNames: string[] | null = null

  if (moduleNameIndex !== -1) {
    const moduleNameStr = process.argv[moduleNameIndex + 1]
    // 支持逗号分隔的多个模块名
    moduleNames = moduleNameStr ? moduleNameStr.split(',').map(name => name.trim()) : null
  }

  // 兼容单个模块名的场景（向后兼容）
  // 如果是单个模块，传递模块名；如果是多个模块，传递null使用默认host配置
  const moduleName = moduleNames && moduleNames.length === 1 ? moduleNames[0] : null

  return {
    moduleNames,
    moduleName
  }
}

export const getProxyUrl = () => {
  let backendUrl: string | null = null
  const backendUrlFlag = '--backend-url'
  const inlineBackendUrl = process.argv.find((arg) => arg.startsWith(`${backendUrlFlag}=`))

  if (inlineBackendUrl) {
    backendUrl = inlineBackendUrl.slice(backendUrlFlag.length + 1)
  } else {
    const backendUrlIndex = process.argv.indexOf(backendUrlFlag)

    if (backendUrlIndex !== -1) {
      for (let i = backendUrlIndex + 1; i < process.argv.length; i += 1) {
        const arg = process.argv[i]

        if (!arg || arg === '--') {
          continue
        }

        if (arg.startsWith('--')) {
          continue
        }

        backendUrl = arg
        break
      }
    }
  }

  // 自动添加 http:// 前缀（如果用户未输入）
  if (backendUrl && !backendUrl.match(/^https?:\/\//)) {
    backendUrl = `http://${backendUrl}`
  }
  console.log('backendUrl', backendUrl)

  return backendUrl
}
