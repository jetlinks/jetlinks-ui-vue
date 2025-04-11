 import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import { VueAmapResolver } from '@vuemap/unplugin-resolver'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'
import {
    createStyleImportPlugin,
    AndDesignVueResolve,
} from 'vite-plugin-style-import'
import * as path from 'path'
import monacoEditorPlugin from 'vite-plugin-monaco-editor'
import { optimizeDeps, registerModulesAlias, copyImagesPlugin } from './configs/plugin'
import progress from 'vite-plugin-progress'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const env: Partial<ImportMetaEnv> = loadEnv(mode, process.cwd())
    return {
        base: './',
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src'),
                ...registerModulesAlias()
            },
        },
        build: {
            outDir: 'dist',
            assetsDir: 'assets',
            sourcemap: true,
            cssCodeSplit: false,
            manifest: true,
            chunkSizeWarningLimit: 2000,
            assetsInlineLimit: 1000,
            rollupOptions: {
                output: {
                    entryFileNames: `assets/[name].${ new Date().getTime() }.js`,
                    chunkFileNames: `assets/[name].${ new Date().getTime() }.js`,
                    assetFileNames: (pre) => {
                        const fileType = pre.name.split('.')?.pop()
                        if (['png', 'svg', 'ico', 'jpg'].includes(fileType)) {
                            return `assets/[name].[ext]`
                        }
                        return `assets/[name].${ new Date().getTime() }.[ext]`
                    },
                    compact: true,
                    manualChunks: {
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
            monacoEditorPlugin({}),
            optimizeDeps(),
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
            createStyleImportPlugin({
                resolves: [AndDesignVueResolve()],
            }),
            progress(),
            copyImagesPlugin()
        ],
        server: {
            host: '0.0.0.0',
            port: Number(env.VITE_PORT),
            proxy: {
                [env.VITE_APP_BASE_API]: {
                    target: 'http://192.168.33.99:8844',
                    // target: 'http://192.168.32.233:8601', // 王
                    // target: 'http://192.168.35.114:8844',
                    // target: 'http://192.168.33.210:8800',
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
                        hack: `true; @import (reference) "${ path.resolve(
                            'src/style/variable.less',
                        ) }";`,
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
