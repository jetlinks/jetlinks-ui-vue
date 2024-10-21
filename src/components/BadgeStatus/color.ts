import {hexToRGB} from "@/utils/comm";

const color = {
  'processing': '#092EE7',
  'error': '#E50012',
  'success': '#24B276',
  'warning': '#FF9000',
  'default': '#666666',
  'primary': '#1890ff'
}
export const getHexColor = (code: string, pe: number = 0.1) => {
  const _color = color[code] || color.default

  const rgb = hexToRGB(_color)
  if (code === 'default') {
    pe = 0.1
  }
  return `rgba(${rgb.join(',')}, ${pe})`
}

export default color
