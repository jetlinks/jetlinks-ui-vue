import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { VueAmapResolver } from '@vuemap/unplugin-resolver'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'
import monacoEditorPlugin from './configs/plugin/monaco-editor'
import progress from 'vite-plugin-progress'
import * as path from 'path'
import { theme } from 'ant-design-vue/lib'
import convertLegacyToken from 'ant-design-vue/lib/theme/convertLegacyToken'
import { registerModulesAlias, copyFile, loadViteModulesPlugins } from './configs/plugin'
import { federation, sharpOptimize } from '@jetlinks-web/vite'
import customTheme from './configs/theme'
import { antdLegacyVarsPlugin } from './configs/plugin/antd-legacy-vars-plugin'

const { defaultAlgorithm, defaultSeed } = theme

const mapToken = defaultAlgorithm({ ...defaultSeed, ...customTheme })
const v3Token = convertLegacyToken(mapToken)

const federationSharedMap = {
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
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env: Partial<ImportMetaEnv> = loadEnv(mode, process.cwd())

  const moduleNameIndex = process.argv.indexOf('--module-name')
  const mavenName = moduleNameIndex !== -1 ? process.argv[moduleNameIndex + 1] : null

  return {
    base: './',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        ...registerModulesAlias()
      }
    },
    define: {
      'import.meta.env.VITE_MODULE_NAME': JSON.stringify(mavenName)
    },
    build: {
      outDir: mavenName ? `src/modules/${mavenName}/dist` : 'dist',
      assetsDir: 'assets',
      sourcemap: false,
      cssCodeSplit: !!mavenName,
      manifest: true,
      chunkSizeWarningLimit: 2000,
      assetsInlineLimit: 1000,
      rollupOptions: {
        output: {
          entryFileNames: `assets/[name].${new Date().getTime()}.js`,
          chunkFileNames: `assets/[name].${new Date().getTime()}.js`,
          assetFileNames: (pre) => {
            const fileType = pre.name.split('.')?.pop()

            if (['png', 'svg', 'ico', 'jpg'].includes(fileType)) {
              return `assets/[name].[ext]`
            }
            return `assets/[name].${new Date().getTime()}.[ext]`
          },
          // 如果是模块构建，提取特定的CSS chunks
          ...(mavenName && {
            input: `src/modules/${mavenName}/register.ts`
          }),
          compact: true,
          manualChunks: mavenName ? undefined : federationSharedMap
        }
      }
    },
    plugins: [
      vue(),
      vueJsx(),
      VueSetupExtend(),
      antdLegacyVarsPlugin(),
      monacoEditorPlugin({
        languageWorkers: ['editorWorkerService', 'json', 'typescript']
      }),
      Components({
        resolvers: [VueAmapResolver()],
        directoryAsNamespace: true
      }),
      AutoImport({
        imports: ['vue', 'vue-router'],
        dts: 'src/auto-imports.d.ts',
        resolvers: [VueAmapResolver()]
      }),
      progress(),
      copyFile(mavenName),
      // copyImagesPlugin(),
      ...loadViteModulesPlugins(),
      federation({
        name: mavenName ? `${mavenName}` : 'host',
        remotes: {},
        enableDynamicRemotes: true,
        filename: mavenName ? 'remoteEntry.js' : undefined,
        isHost: true,
        shared: Object.keys(federationSharedMap),
        exposes: mavenName
          ? {
              [mavenName]: `src/modules/${mavenName}/register.ts`
            }
          : undefined
      }),
      sharpOptimize()
    ],
    server: {
      host: '0.0.0.0',
      port: Number(env.VITE_PORT),
      proxy: {
        [env.VITE_APP_BASE_API]: {
          target: env.VITE_APP_DEV_PROXY_URL,
          ws: true,
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp(`^${env.VITE_APP_BASE_API}`), '')
        }
      }
    },
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            'root-entry-name': 'variable',
            hack: `true; @import (reference) "${path.resolve('src/style/variable.less')}";`,
            ...v3Token
          },
          javascriptEnabled: true
        }
      }
    },
    optimizeDeps: {
      include: ['pinia', 'vue-router', 'axios', 'lodash-es', '@vueuse/core', 'echarts', 'dayjs']
    }
  }
})
