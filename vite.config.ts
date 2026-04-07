import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { VueAmapResolver } from '@vuemap/unplugin-resolver'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'
import monacoEditorPlugin from './configs/plugin/monaco-editor'
import progress from 'vite-plugin-progress'
import * as path from 'path'
import {
  registerModulesAlias,
  copyFile,
  loadViteModulesPlugins
} from './configs/plugin'
import { federation, sharpOptimize } from '@jetlinks-web/vite'
import { antdLegacyVarsPlugin } from './configs/plugin'
import {
  getDefine,
  getFederationSetting,
  v3Token,
  getModulesName,
  getProxyUrl,
  federationSharedMap,
  getMergedEnv
} from './vite.setting'
import { moduleFilterPlugin } from './configs/plugin/moduleFilterPlugin'

export default defineConfig(({ mode, command }) => {
  const envDir = path.resolve(__dirname, '..')
  const env = getMergedEnv(mode, envDir)
  const isDev = command === 'serve'
  const publicPath = (env.VITE_PUBLIC_PATH || '/').trim() || '/'

  const { moduleName, moduleNames} = getModulesName()
  const backendUrl = getProxyUrl()

  const envDefine = getDefine(env, mode, isDev, moduleName, publicPath)

  return {
    envDir,
    base: publicPath,
    resolve: {
      alias: {
        '@jetlinks-web-core': path.resolve(__dirname, 'src'),
        '@': path.resolve(__dirname, 'src'),
        ...registerModulesAlias()
      }
    },
    define: envDefine,
    build: {
      outDir: moduleName ? path.resolve(envDir, `modules/${moduleName}/dist`) : path.resolve(envDir, `dist`),
      assetsDir: 'assets',
      sourcemap: false,
      cssCodeSplit: false,
      emptyOutDir: true,
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
          ...(moduleName && {
            input: `../modules/${moduleName}/register.ts`
          }),
          compact: true,
          manualChunks: moduleName ? undefined : federationSharedMap
        }
      }
    },
    plugins: [
      vue(),
      vueJsx(),
      VueSetupExtend(),
      monacoEditorPlugin({
        languageWorkers: ['editorWorkerService', 'json', 'typescript']
      }),
      antdLegacyVarsPlugin(),
      Components({
        resolvers: [VueAmapResolver()],
        directoryAsNamespace: true
      }),
      AutoImport({
        imports: ['vue', 'vue-router'],
        dts: 'src/auto-imports.d.ts',
        resolvers: [VueAmapResolver()]
      }),
      moduleFilterPlugin(moduleNames),
      progress(),
      copyFile(moduleName),
      ...loadViteModulesPlugins(),
      federation(getFederationSetting(moduleName, envDir)),
      sharpOptimize()
    ],
    server: {
      host: '0.0.0.0',
      port: Number(env.VITE_PORT),
      cors: true,
      fs: { allow: [ envDir] },
      allowedHosts: [
        'cq.local-host.cn', // 允许的自定义域名
      ],
      proxy: {
        [env.VITE_APP_BASE_API]: {
          // 优先使用命令行参数，其次使用环境变量
          target: backendUrl || env.VITE_APP_DEV_PROXY_URL,
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
            ...v3Token()
          },
          javascriptEnabled: true
        }
      }
    },
    optimizeDeps: {
      entries: ['index.html'],
      include: ['pinia', 'vue-router', 'axios', 'lodash-es', '@vueuse/core', 'echarts', 'dayjs'],
      esbuildOptions: {
        define: envDefine
      }
    }
  }
})
