import type { RouteRecordRaw } from 'vue-router'
import type { ModuleRouteOverride, RouteHideInMenuContext } from './types'
import { RouteSecurityLevel } from './types'
import * as basicRoutes from './basic'

/**
 * Resolve core routes and apply module overrides.
 */
export function resolveCoreRoutes(
  overrides: ModuleRouteOverride[] = [],
  context?: RouteHideInMenuContext,
) {
  const registry = new Map(
    Object.values(basicRoutes).map(config => [config.name, { ...config }]),
  )

  const overrideLogs: string[] = []

  for (const override of overrides) {
    if (override.component) {
      if (shouldApplyOverride(override, context)) {
        registry.set(override.name, override)
        overrideLogs.push(`  - ${override.name}: ${override.description || 'module override'}`)
      }
      continue
    }

    registry.delete(override.name)
    overrideLogs.push(`  - ${override.name}: [removed]`)
  }

  if (overrideLogs.length > 0) {
    console.info(
      `[Route Override] Applied ${overrideLogs.length} route override(s):\n${overrideLogs.join('\n')}`,
    )
  }

  const routes = [...registry.values()]
  const tokenFilterPaths = extractTokenFilterPaths(routes)
  const menuFilterPaths = extractMenuFilterPaths(routes)

  return {
    routes,
    tokenFilterPaths,
    menuFilterPaths,
    registry: routes,
  }
}

function shouldApplyOverride(route: ModuleRouteOverride, context?: RouteHideInMenuContext): boolean {
  const handler = route.meta?.handleHideInMenuFn

  if (typeof handler !== 'function') {
    return true
  }

  try {
    return handler(context) === false
  } catch (error) {
    console.warn(
      `[Route Override] Skip dynamic filter for route "${String(route.name)}", fallback to apply override.`,
      error,
    )
    return true
  }
}

/**
 * Extract paths that should skip token validation.
 */
function extractTokenFilterPaths(routes: RouteRecordRaw[]): string[] {
  const paths: string[] = []

  function traverse(route: RouteRecordRaw) {
    if (route.meta?.security === RouteSecurityLevel.PUBLIC) {
      paths.push(route.path)
    }

    if (route.children) {
      route.children.forEach(traverse)
    }
  }

  routes.forEach(traverse)
  return paths
}

/**
 * Extract paths that should skip menu permission checks.
 */
function extractMenuFilterPaths(routes: RouteRecordRaw[]): string[] {
  const paths: string[] = []

  function traverse(route: RouteRecordRaw) {
    if (route.meta?.skipMenuFetch) {
      paths.push(route.path)
    }
    if (route.children) {
      route.children.forEach(traverse)
    }
  }

  routes.forEach(traverse)
  return paths
}
