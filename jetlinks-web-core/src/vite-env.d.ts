/// <reference types="vite/client" />
declare module "*.vue" {
    import { DefineComponent } from "vue"
    const component: DefineComponent<{}, {}, any>
    export default component
}

declare module "@jetlinks-web/components"
declare module "vue3-json-viewer"
declare module "event-source-polyfill"
