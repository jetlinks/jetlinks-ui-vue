
const color = {
  'processing': '9, 46, 231',
  'error': '229, 0, 18',
  'success': '36, 178, 118',
  'warning': '255, 144, 0',
  'default': '102, 102, 102',
  //告警颜色
  'level1': '229, 0,  18',
  'level2': '255, 148,  87',
  'level3': '250, 189,  71',
  'level4': '153, 153, 153',
  'level5': '196, 196,  196'
}
export const getHexColor = (code: string, pe: number = 0.1) => {
  const _color = color[code] || color.default
  if (code === 'default') {
    pe = 0.1
  }
  return `rgba(${_color}, ${pe})`
}

export default color