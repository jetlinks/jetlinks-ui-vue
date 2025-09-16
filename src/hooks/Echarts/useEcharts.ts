import echarts from "./library"
import { Ref, onMounted, onUnmounted, unref } from 'vue'
import { debounce } from 'lodash-es'

export const useEcharts = (el: Ref<HTMLDivElement | undefined>, props: any = {}) => {
  let echartsInstance: echarts.ECharts | null = null  // echarts实例
  let resizeObserver: ResizeObserver | null = null

  if (props?.library) { // 添加依赖包
    echarts.use(props.library)
  }

  // 初始化
  function init() {
    const _el = unref(el)
    if (!_el || echartsInstance) return
    echartsInstance = echarts.init(_el)

    if (props.option) {
      setOption(props.option)
    }
  }

  // 配置option
  function setOption(option: any) {
    if (!echartsInstance) {
      init()
    }
    echartsInstance?.setOption(option || {})
  }

  // 更新大小
  const echartsResize = debounce(() => {
    echartsInstance?.resize?.()
  }, 300)

  // 释放资源
  function dispose() {
    resizeObserver?.disconnect()
    resizeObserver = null

    echartsInstance?.dispose()
    echartsInstance = null
  }

  // 监听元素大小变化
  function watchEl() {
    const _el = unref(el)
    if (!_el) return


    // 避免重复监听
    if (resizeObserver) {
      resizeObserver.disconnect()
    }

    resizeObserver = new ResizeObserver(() => echartsResize())
    resizeObserver.observe(_el)
  }


  onMounted(() => {
    init()
    window.addEventListener('resize', echartsResize)
    watchEl()
  })

  onUnmounted(() => {
    window.removeEventListener('resize', echartsResize)
    dispose()
  })

  // 监听 props.option 变化时更新
  watch(
    () => props.option,
    (newVal) => {
      if (newVal) setOption(newVal)
    },
    { deep: true }
  )

  return {
    setOption
  }
}
