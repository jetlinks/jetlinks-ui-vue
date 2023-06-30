import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { createHtmlPlugin } from 'vite-plugin-html'
import Config from './config/config'
import {VueAmapResolver} from '@vuemap/unplugin-resolver'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'
import { createStyleImportPlugin, AndDesignVueResolve } from 'vite-plugin-style-import'
import * as path from 'path'
import monacoEditorPlugin from 'vite-plugin-monaco-editor';
// import { JetlinksVueResolver } from 'jetlinks-ui-components/lib/plugin/resolve'
import { JetlinksVueResolver } from './plugin/jetlinks'
import { optimizeDeps } from './plugin/optimize'
import copy from 'rollup-plugin-copy';
import progress from 'vite-plugin-progress'

// https://vitejs.dev/config/
export default defineConfig(({ mode}) => {
  const env: Partial<ImportMetaEnv> = loadEnv(mode, process.cwd());

  return {
      base: './',
      resolve: {
          alias: {
              '@': path.resolve(__dirname, 'src'),
              'style': path.resolve(__dirname, 'src/style'),
              'layouts': path.resolve(__dirname, 'src/layouts'),
              'components': path.resolve(__dirname, 'src/components'),
              'store': path.resolve(__dirname, 'src/store'),
          }
      },
      build: {
          outDir: 'dist',
          assetsDir: 'assets',
          sourcemap: false,
          cssCodeSplit: false,
          manifest: true,
          chunkSizeWarningLimit: 2000,
          assetsInlineLimit: 1000,
          rollupOptions: {
              output: {
                  entryFileNames: `assets/[name].${new Date().getTime()}.js`,
                  chunkFileNames: `assets/[name].${new Date().getTime()}.js`,
                  assetFileNames: `assets/[name].${new Date().getTime()}.[ext]`,
                  compact: true,
                  manualChunks: {
                      vue: ['vue', 'vue-router', 'pinia']
                  },
              },
          },
      },
      plugins: [
          vue(),
          monacoEditorPlugin({}),
          vueJsx(),
          optimizeDeps(),
          Components({
              resolvers: [JetlinksVueResolver({ importStyle: 'less' }), VueAmapResolver()],
              directoryAsNamespace: true
          }),
          AutoImport({
              imports: [
                  'vue',
                  'vue-router'
              ],
              dts: 'src/auto-imports.d.ts',
              resolvers: [VueAmapResolver()],
          }),
          createHtmlPlugin({
              inject: {
                  data: {
                      title: Config.title,
                      favicon: `<link rel="icon" type="image/svg+xml" href="${Config.logo}" />`
                  }
              }
          }),
          VueSetupExtend(),
          createStyleImportPlugin({
            resolves: [AndDesignVueResolve()]
          }),
          copy({
            targets: [
              {src: 'node_modules/@liveqing/liveplayer-v3/dist/component/liveplayer-lib.min.js', dest: 'public/js'},
            ]
          }),
          progress()
      ],
      server: {
          host:'0.0.0.0',

          proxy: {
              [env.VITE_APP_BASE_API]: {
                  // target: 'http://192.168.32.226:8844',
                  // target: 'http://192.168.32.244:8881',
                  target: 'http://192.168.32.163:8844', //张季本地
                //   target: 'http://120.77.179.54:8844', // 120测试
                  // target: 'http://192.168.33.46:8844', // 本地开发环境
                  ws: 'ws://192.168.33.46:8844',
                  changeOrigin: true,
                  rewrite: (path) => path.replace(/^\/api/, '')
              }
          }
      },
      css: {
          preprocessorOptions: {
              less: {
                  modifyVars: {
                      'root-entry-name': 'variable',
                      hack: `true; @import (reference) "${path.resolve('src/style/variable.less')}";`,
                  },
                  javascriptEnabled: true,
              }
          }
      },
      optimizeDeps: {
          include: ['pinia', 'vue-router', 'axios', 'lodash-es', '@vueuse/core', 'echarts', 'dayjs'],
      }
  }
})
