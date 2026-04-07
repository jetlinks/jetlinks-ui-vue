import { ref, watch, onUnmounted, type Ref } from 'vue'
import { CaptchaConfig, CaptchaData, Track, TrackData, ValidationResponse } from './captcha'
import { request } from '@jetlinks-web/core'
import dayjs from 'dayjs'
import CryptoJS from "crypto-js";
import { onlyMessage } from '@jetlinks-web/utils'

export interface UseCaptchaReturn {
  captchaData: Ref<CaptchaData | null>
  loading: Ref<boolean>
  error: Ref<Error | null>
  generate: () => Promise<void>
  validate: (trackData: TrackData) => Promise<boolean>
  refresh: () => Promise<void>
}

export function useCaptcha(config: Ref<CaptchaConfig> | CaptchaConfig): UseCaptchaReturn {
  const captchaData = ref<CaptchaData | null>(null)
  const loading = ref(false)
  const error = ref<Error | null>(null)
  const imageWidth = ref(400)

  const configRef = ref(config) as Ref<CaptchaConfig>

  const generate = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await request.post(configRef.value.imageUrl)
      captchaData.value = response.data
      if (captchaData.value) {
        const imageWidthScale = Number((imageWidth.value / captchaData.value.backgroundImageWidth).toFixed(4))
        const { backgroundImageWidth, backgroundImageHeight, randomY=0, templateImageWidth, templateImageHeight } = response.data
        captchaData.value.backgroundImageWidth = imageWidthScale * backgroundImageWidth
        captchaData.value.backgroundImageHeight = imageWidthScale * backgroundImageHeight
        captchaData.value.randomY = imageWidthScale * randomY
        captchaData.value.templateImageWidth = imageWidthScale * templateImageWidth
        captchaData.value.templateImageHeight = imageWidthScale * templateImageHeight
      }
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Failed to generate captcha')
      console.error('Generate captcha error:', err)
    } finally {
      loading.value = false
    }
  }

  function floatToBytesBE(num: number) {
    // const buffer = new ArrayBuffer(4);
    // const view = new DataView(buffer);
    // view.setFloat32(0, num, false); // false = Big Endian`
    // return new Uint8Array(buffer)
    const buffer = new ArrayBuffer(4);
    new DataView(buffer).setFloat32(0, num, false); // false = big-endian
    return Array.from(new Uint8Array(buffer));
  }

  function stringToBytes(str) {
    return Array.from(new TextEncoder().encode(str));
  }

  // 字节数组转CryptoJS的WordArray
  function bytesToWordArray(bytes) {
    return CryptoJS.lib.WordArray.create(new Uint8Array(bytes));
  }

  const signTrack = (trackList: Track[], key?: string) => {
    if (!key) return trackList

    // let md5 = CryptoJS.algo.MD5.create();
    //
    // trackList.forEach(track => {
    //   if (track.x !== undefined && track.x !== null) {
    //     md5.update(CryptoJS.lib.WordArray.create(floatToBytesBE(track.x)));
    //   }
    //   if (track.y !== undefined && track.y !== null) {
    //     md5.update(CryptoJS.lib.WordArray.create(floatToBytesBE(track.y)));
    //   }
    //   if (track.t !== undefined && track.t !== null) {
    //     md5.update(CryptoJS.lib.WordArray.create(floatToBytesBE(track.t)));
    //   }
    //   md5.update(CryptoJS.enc.Utf8.parse(key));
    // });
    //
    // return md5.finalize().toString(CryptoJS.enc.nixi);

    // 创建一个数组来存储所有字节
    let dataWords = [];

    for (const track of trackList) {
      // 处理每个track的x、y、t
      if (track.x != null) {
        dataWords.push(...floatToBytesBE(track.x));
      }
      if (track.y != null) {
        dataWords.push(...floatToBytesBE(track.y));
      }
      if (track.t != null) {
        dataWords.push(...floatToBytesBE(track.t));
      }
      // 添加key字节
      for (let i = 0; i < key.length; i++) {
        dataWords.push(key.charCodeAt(i));
      }
    }

    const wordArray = bytesToWordArray(dataWords);
    return CryptoJS.MD5(wordArray).toString();
  }

  const normalizeTrackData = (data: TrackData): TrackData => {

    return {
      startTime: dayjs(data.startTime).valueOf(),
      stopTime: dayjs(data.stopTime).valueOf(),
      bgImageWidth: captchaData.value!.backgroundImageWidth,
      bgImageHeight: captchaData.value!.backgroundImageHeight,
      templateImageWidth: captchaData.value!.templateImageWidth,
      templateImageHeight: captchaData.value!.templateImageHeight,
      trackList: data.trackList,
      data: signTrack(data.trackList, captchaData.value!.data?.key)
    }
  }

  const validate = async (trackData: TrackData): Promise<boolean> => {


    loading.value = true
    error.value = null

    try {
      const response = await request.post(
        configRef.value.validateUrl,
        {
          id: captchaData.value.id,
          data: normalizeTrackData(trackData)
        })

      if (response.success) {
        configRef.value.onSuccess?.(response.result)
        return true
      } else {
        configRef.value.onFail?.(response.result)
        return false
      }
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Validation failed')
      console.error('Validate captcha error:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  const refresh = async () => {
    captchaData.value = null
    await generate()
  }

  onUnmounted(() => {
    captchaData.value = null
    error.value = null
  })

  return {
    captchaData,
    loading,
    error,
    imageWidth,
    generate,
    validate,
    refresh
  }
}
