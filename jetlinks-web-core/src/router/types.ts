import type { RouteRecordRaw } from 'vue-router'

/** Route access level */
export enum RouteSecurityLevel {
  /** Public route, no token required. */
  PUBLIC = 'public',
  /** Token required, menu permission not required. */
  AUTHENTICATED = 'authenticated',
  /** Token and menu permission required (default). */
  AUTHORIZED = 'authorized'
}

export type RouteHideInMenuContext = {
  hasResponeMenu?: boolean
}

export type RouteHideInMenuHandler = (context?: RouteHideInMenuContext) => boolean

declare module 'vue-router' {
  interface RouteMeta {
    /** Route access level */
    security?: RouteSecurityLevel
    /** Legacy compatibility: skip menu permission check */
    skipMenuFetch?: boolean
    /** Page title */
    title?: string
    /** Whether hidden in menu */
    hideInMenu?: boolean
    /** Dynamic hide condition for menu-related filtering */
    handleHideInMenuFn?: RouteHideInMenuHandler
  }
}

/** Core route configuration item */
export type CoreRouteConfig = RouteRecordRaw & {
  /** Description (debug only) */
  description?: string
}

/** Module route override configuration */
export type ModuleRouteOverride = RouteRecordRaw & {
  /** Description (debug only) */
  description?: string
}
