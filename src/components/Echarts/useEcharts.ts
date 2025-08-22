import echarts from "./library"
import { Ref, onMounted, onUnmounted, unref } from 'vue'

export const useECharts = (el: Ref<HTMLDivElement> | HTMLDivElement) => {
  // echarts实例
  let echartsInstance: echarts.ECharts | null = null
  // const loading = ref<boolean>(false)

  // 初始化
  function init() {
    const _el = unref(el)
    if (!_el) return
    echartsInstance = echarts.init(_el)
  }

  // 配置options
  function setOptions(option: any) {
    // loading.value = true
    if (!echartsInstance) {
      init()
    }
    if (echartsInstance) {
      echartsInstance.setOption(option)
    }
    // loading.value = false
  }

  // 更新大小
  const echartsResize = () => {
    echartsInstance?.resize?.()
  }

  // 监听元素大小变化
  function watchEl() {
    const resizeObserve = new ResizeObserver(() => echartsResize())
    if (el) {
      resizeObserve.observe(unref(el))
    }
  }


  onMounted(() => {
    window.addEventListener('resize', echartsResize)
    watchEl()
  })

  onUnmounted(() => {
    window.removeEventListener('resize', echartsResize)
  })

  return {
    setOptions
  }
}
