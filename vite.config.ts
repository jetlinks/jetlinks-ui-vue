import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import {VueAmapResolver} from '@vuemap/unplugin-resolver'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'
import monacoEditorPlugin from './configs/plugin/monaco-editor'
import progress from 'vite-plugin-progress'
import * as path from 'path'
import {theme} from 'ant-design-vue/lib'
import convertLegacyToken from 'ant-design-vue/lib/theme/convertLegacyToken'
import {
  registerModulesAlias,
  copyFile,
  copyImagesPlugin,
} from './configs/plugin'
import { federation } from '@jetlinks-web/vite'

const {defaultAlgorithm, defaultSeed} = theme;

const mapToken = defaultAlgorithm(defaultSeed);
const v3Token = convertLegacyToken(mapToken);

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {

  const env: Partial<ImportMetaEnv> = loadEnv(mode, process.cwd())

  const moduleNameIndex = process.argv.indexOf('--module-name');
  const moduleName = moduleNameIndex !== -1 ? process.argv[moduleNameIndex + 1] + '-ui' : null;

  console.log(__dirname)
  return {
    base: './',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        ...registerModulesAlias()
      },
    },
    define: {
      'import.meta.env.VITE_MODULE_NAME': JSON.stringify(moduleName)
    },
    build: {
      outDir: moduleName ? `src/modules/${moduleName}/dist` : 'dist',
      assetsDir: 'assets',
      sourcemap: false,
      cssCodeSplit: !!moduleName,
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
            input: `src/modules/${moduleName}/register.ts`,
            external: ['vue', 'ant-design-vue'], // 外部依赖不打包
          }),
          compact: true,
          manualChunks: moduleName ? undefined : {
            vue: ['vue', 'vue-router', 'pinia'],
            'lodash-es': ['lodash-es'],
            'echarts': ['echarts']
          },
        },
      },
    },
    plugins: [
      vue(),
      vueJsx(),
      VueSetupExtend(),
      monacoEditorPlugin({
        languageWorkers: ['editorWorkerService', 'json', 'typescript']
      }),
      Components({
        resolvers: [
          VueAmapResolver(),
        ],
        directoryAsNamespace: true,
      }),
      AutoImport({
        imports: ['vue', 'vue-router'],
        dts: 'src/auto-imports.d.ts',
        resolvers: [VueAmapResolver()],
      }),
      progress(),
      copyFile(moduleName),
      copyImagesPlugin(),
      federation({
        name: moduleName ? `${moduleName}` : 'main-app',
        remotes: {},
        enableDynamicRemotes: true,
        filename: moduleName ? 'remoteEntry.js' : undefined,
        exposes: moduleName ? {
          [moduleName] : `src/modules/${moduleName}/register.ts`
        } : undefined,
      })
    ],
    server: {
      host: '0.0.0.0',
      port: Number(env.VITE_PORT),
      proxy: {
        [env.VITE_APP_BASE_API]: {
          target: env.VITE_APP_DEV_PROXY_URL,
          ws: true,
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp(`^${env.VITE_APP_BASE_API}`), ''),
        }
      }
    },
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            'root-entry-name': 'variable',
            hack: `true; @import (reference) "${path.resolve(
              'src/style/variable.less',
            )}";`,
            ...v3Token,

          },
          javascriptEnabled: true,
        },
      },
    },
    optimizeDeps: {
      include: [
        'pinia',
        'vue-router',
        'axios',
        'lodash-es',
        '@vueuse/core',
        'echarts',
        'dayjs',
      ],
    },
  }
})
