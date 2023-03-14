
const color = {
  'processing': '64, 169, 255',
  'error': '247, 79, 70',
  'success': '74, 234, 220',
  'warning': '250, 178, 71',
  'default': '63, 73, 96'
}
export const getHexColor = (code: string, pe: number = 0.3) => {
  const _color = color[code] || color.default
  if (code === 'default') {
    pe = 0.1
  }
  return `rgba(${_color}, ${pe})`
}

export default color