// 是否不是community版本
import { getToken, randomString } from '@jetlinks-web/utils'
import { BASE_API } from '@jetlinks-web/constants'
import { PersonalAIKey, PersonalKey, PersonalToken } from '@jetlinks-web-core/utils/consts'

export const isNoCommunity = !(localStorage.getItem('system_edition') === 'community')

export const openEdgeUrl = (id: string, routePath?: string) => {
  const url = new URL(`${BASE_API}/ui/edge/cloud/default/`, window.location.origin)

  const hashParams = new URLSearchParams()
  hashParams.set('token', getToken())
  hashParams.set('thingId', id)
  hashParams.set('deviceId', id)
  hashParams.set('terminal', 'cloud-pc')
  hashParams.set('thingType', 'device')
  hashParams.set('proxy', BASE_API)

  url.hash = `${routePath || '/login'}?${hashParams.toString()}`
  window.open(url.toString())
}

export class TabSaveSuccess {
  private id: string
  private url: string

  constructor(url: string) {
    this.id = 'tab-save-success' + randomString(8)
    this.url = url
  }
}

export const initPersonal = () => {
  const url = new URL(window.location.href)
  const _token = url.searchParams.get(PersonalKey)

  if (_token) {
    PersonalToken.value = _token
    PersonalToken.aiToken = url.searchParams.get(PersonalAIKey)
  }
}

// 获取上一行
export function getEffectivePrevRow(rows: Record<string, any>, index: number) {
  let i = index - 1
  while (i >= 0 && rows[i].sameAsAbove) {
    i--
  }
  return i >= 0 ? rows[i] : null
}

/**
 * 执行同上逻辑
 * @param rows
 * @param index
 * @param checked
 */
export function applySameAsAbove(rows: Record<string, any>, index: number, checked: boolean) {
  const current = rows[index]
  current.sameAsAbove = checked

  if (!checked) {
    current.disabled = false
    return rows
  }

  const prev = getEffectivePrevRow(rows, index)
  if (!prev) {
    current.sameAsAbove = false
    return rows
  }

  // 复制字段（只复制业务字段）
  Object.assign(current, {
    name: prev.name,
    code: prev.code,
    disabled: true
  })

  return rows
}

function syncFollowingSameRows(rows: Record<string, any>, index: number) {
  let base = rows[index]

  for (let i = index + 1; i < rows.length; i++) {
    if (!rows[i].sameAsAbove) break

    rows[i].name = base.name
    rows[i].code = base.code
    rows[i].disabled = true
  }

  return rows
}

/**
 * Helper to convert base64 string to Uint8Array.
 */
function base64ToUint8Array(base64) {
  // Handle base64url
  base64 = base64.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Decodes a ThumbHash to an RGBA image.
 * @param {Uint8Array} hash The bytes of the ThumbHash.
 * @param {number} targetWidth The target width.
 * @param {number} targetHeight The target height.
 * @returns {{width: number, height: number, rgba: Uint8ClampedArray}}
 */
function thumbHashToRGBA(hash, targetWidth = -1, targetHeight = -1) {
  const header24 = (hash[0] & 255) | ((hash[1] & 255) << 8) | ((hash[2] & 255) << 16);
  const header16 = (hash[3] & 255) | ((hash[4] & 255) << 8) | ((hash[5] & 255) << 16);
  const l_dc = (header24 & 63) / 63.0;
  const p_dc = ((header24 >> 6) & 63) / 31.5 - 1.0;
  const q_dc = ((header24 >> 12) & 63) / 31.5 - 1.0;
  const l_scale = ((header24 >> 18) & 31) / 31.0;
  const hasAlpha = (header24 >> 23) !== 0;

  let lx, ly, pq_size, p_scale, q_scale;

  // Old layout: lx(4), ly(4), p_scale(6), q_scale(6), pq_size(4) = 24 bits
  // New layout: lx(5), ly(5), pq_size(4), p_scale(5), q_scale(5) = 24 bits
  if (((header16 >> 20) & 15) !== 0 && ((header16 & 31) < 3 || ((header16 >> 5) & 31) < 3)) {
    // compatibility with old hashes
    lx = header16 & 15;
    ly = (header16 >> 4) & 15;
    p_scale = ((header16 >> 8) & 63) / 63.0;
    q_scale = ((header16 >> 14) & 63) / 63.0;
    pq_size = (header16 >> 20) & 15;

    if (pq_size === 0) pq_size = 5;
    if (lx === 0 || ly === 0) {
      const isLandscape = (header16 >> 16) !== 0;
      lx = isLandscape ? Math.max(3, pq_size) : header16 & 15;
      ly = isLandscape ? header16 & 15 : Math.max(3, pq_size);
    }
  } else {
    // New 5/5/4/5/5 layout
    lx = header16 & 31;
    ly = (header16 >> 5) & 31;
    pq_size = (header16 >> 10) & 15;
    p_scale = ((header16 >> 14) & 31) / 31.0;
    q_scale = ((header16 >> 19) & 31) / 31.0;
  }

  const a_size = pq_size;

  const a_dc = hasAlpha ? (hash[6] & 15) / 15.0 : 1.0;
  const a_scale = ((hash[6] >> 4) & 15) / 15.0;

  const ac_start = hasAlpha ? 7 : 6;
  let ac_index = 0;

  const decodeChannel = (nx, ny, scale) => {
    const ac = [];
    for (let cy = 0; cy < ny; cy++) {
      for (let cx = (cy > 0 ? 0 : 1); cx * ny < nx * (ny - cy); cx++) {
        const data = (hash[ac_start + (ac_index >> 1)] >> ((ac_index & 1) << 2)) & 15;
        ac.push((data / 7.5 - 1.0) * scale);
        ac_index++;
      }
    }
    return ac;
  };

  const decodeChannelSquare = (size, scale) => {
    const ac = [];
    for (let cy = 0; cy < size; cy++) {
      for (let cx = (cy > 0 ? 0 : 1); cx < size - cy; cx++) {
        const data = (hash[ac_start + (ac_index >> 1)] >> ((ac_index & 1) << 2)) & 15;
        ac.push((data / 7.5 - 1.0) * scale);
        ac_index++;
      }
    }
    return ac;
  };

  const l_ac = decodeChannel(lx, ly, l_scale);
  const p_ac = decodeChannelSquare(pq_size, p_scale * 1.25);
  const q_ac = decodeChannelSquare(pq_size, q_scale * 1.25);
  const a_ac = hasAlpha ? decodeChannelSquare(a_size, a_scale) : null;

  const ratio = lx / ly;
  let w, h;
  if (targetWidth > 0 && targetHeight > 0) {
    w = targetWidth; h = targetHeight;
  } else if (targetWidth > 0) {
    w = targetWidth; h = Math.round(targetWidth / ratio);
  } else if (targetHeight > 0) {
    h = targetHeight; w = Math.round(targetHeight * ratio);
  } else {
    w = Math.round(ratio > 1.0 ? 100.0 : 100.0 * ratio);
    h = Math.round(ratio > 1.0 ? 100.0 / ratio : 100.0);
  }

  const rgba = new Uint8ClampedArray(w * h * 4);
  const cx_stop = Math.max(lx, pq_size, hasAlpha ? a_size : 0);
  const cy_stop = Math.max(ly, pq_size, hasAlpha ? a_size : 0);
  const fx = new Float32Array(cx_stop);
  const fy = new Float32Array(cy_stop);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let l = l_dc, p = p_dc, q = q_dc, a = a_dc;
      for (let cx = 0; cx < cx_stop; cx++) fx[cx] = Math.cos(Math.PI / w * (x + 0.5) * cx);
      for (let cy = 0; cy < cy_stop; cy++) fy[cy] = Math.cos(Math.PI / h * (y + 0.5) * cy);

      for (let cy = 0, j = 0; cy < ly; cy++) {
        const fy2 = fy[cy] * 2.0;
        for (let cx = (cy > 0 ? 0 : 1); cx * ly < lx * (ly - cy); cx++, j++) l += l_ac[j] * fx[cx] * fy2;
      }
      for (let cy = 0, j = 0; cy < pq_size; cy++) {
        const fy2 = fy[cy] * 2.0;
        for (let cx = (cy > 0 ? 0 : 1); cx < pq_size - cy; cx++, j++) {
          const f = fx[cx] * fy2;
          p += p_ac[j] * f;
          q += q_ac[j] * f;
        }
      }
      if (hasAlpha) {
        for (let cy = 0, j = 0; cy < a_size; cy++) {
          const fy2 = fy[cy] * 2.0;
          for (let cx = (cy > 0 ? 0 : 1); cx < a_size - cy; cx++, j++) a += a_ac[j] * fx[cx] * fy2;
        }
      }

      const b = l - 2.0 / 3.0 * p;
      const r = (3.0 * l - b + q) / 2.0;
      const g = r - q;
      const i = (x + y * w) << 2;
      rgba[i] = Math.max(0, Math.min(255, Math.round(r * 255.0)));
      rgba[i + 1] = Math.max(0, Math.min(255, Math.round(g * 255.0)));
      rgba[i + 2] = Math.max(0, Math.min(255, Math.round(b * 255.0)));
      rgba[i + 3] = Math.max(0, Math.min(255, Math.round(a * 255.0)));
    }
  }
  return { width: w, height: h, rgba };
}

/**
 * Decodes a ThumbHash to a base64 Data URL.
 * @param {Uint8Array} hashStr The bytes of the ThumbHash.
 * @param {number} targetWidth Target width.
 * @param {number} targetHeight Target height.
 * @returns {string} Base64 Data URL.
 */
export function thumbHashToDataURL(hashStr, targetWidth = -1, targetHeight = -1) {
  const hash = base64ToUint8Array(hashStr);

  // 默认按比例缩放，最大边 100
  const { width, height, rgba } = thumbHashToRGBA(hash, targetWidth, targetHeight);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  const imageData = ctx.createImageData(width, height);
  imageData.data.set(rgba);
  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL('image/png');
}
