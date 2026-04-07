
export const buildIdToTitle = (tree: any[], filedNames: Record<string, string> = {key: 'id', title: 'name'})=> {
  const map = new Map()

  const walk = (nodes: any[]) => {
    nodes.forEach(n => {
      const id = n[filedNames.key]
      const title = n[filedNames.title]
      map.set(id, title)
      if (id !== undefined && id !== null) {
        map.set(String(id), title)
      }
      if (n.children?.length) walk(n.children)
    })
  }

  walk(tree)
  return map
}

export const normalizeOptionTree = (options: any[] = []) => {
  return options.map(item => {
    const id = item?.id ?? item?.value ?? item?.key
    const name = item?.name ?? item?.label ?? item?.title ?? id

    const children = Array.isArray(item?.children) ? normalizeOptionTree(item.children) : item?.children

    return {
      ...item,
      id,
      value: item?.value ?? id,
      name,
      label: item?.label ?? name,
      children
    }
  })
}
