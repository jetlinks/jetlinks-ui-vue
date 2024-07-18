<template>
  <div ref='dialog' :style='styleName' class='dialog'>
    <Transition name='dialog'>
      <div class='dialog-sprite' ref='header'>
        <div class='header' v-if="title !== false">
          <span>{{ title }}</span>
          <a-button size='small' type='text' @click.stop='onClose'>
            <AIcon type='CloseOutlined' />
          </a-button>
        </div>
        <div class='dialog-body' :style="bodyStyle">
          <slot></slot>
        </div>
<!--        <div class='dialog-footer' v-if='slots?.footer'>-->
<!--          <slot name='footer'></slot>-->
<!--        </div>-->
      </div>
    </Transition>
<!--    <template v-for='item in rangeList'>-->
<!--      <div :class="{'range': true, [item.classname]: true}" @mousedown.stop='rangeMove($event,item.classname)'></div>-->
<!--    </template>-->

    <div :class="{'range': true, 'bottom-right': true}" @mousedown.stop='rangeMove($event,"bottom-right")'></div>
  </div>
</template>

<script setup lang='ts'>

defineOptions({
  name: 'DragModal'
})

const props = defineProps({
  title: {
    type: [String, Boolean],
    default: ''
  },
  width: {
    type: Number,
    default: 400
  },
  height: {
    type: Number,
    default: 100
  },
  dragRang: {
    type: [Array , Number],
    default: [400, 200]
  },
  bodyStyle: {
    type: Object,
    default: () => ({})
  }
})
const emits = defineEmits(['close', 'heightChange'])
const slots = useSlots()

const ele = document.body

const dialog = ref()
const header = ref()
const baseWidth = ref(props.width || 400)
const baseHeight = ref(props.height || 100)
const baseLeft = ref(100)
const baseTop = ref(100)

const rangeList = [
  // {
  //   classname: 'top-left'
  // },
  // {
  //   classname: 'top-right'
  // },
  // {
  //   classname: 'bottom-left'
  // },
  {
    classname: 'bottom-right'
  }
]

const styleName = computed(() => {
  return {
    top: getFixed(baseTop.value) + 'px',
    left: getFixed(baseLeft.value) + 'px',
    width: getFixed(baseWidth.value) + 'px',
    height: getFixed(baseHeight.value) + 'px'
  }
})

const getFixed = (val: number) => {
  return Number(val.toFixed(2))
}

const onDrag = () => {
  let active = false
  let initialX: number
  let initialY: number
  let initialWindowX: number
  let initialWindowY: number

  header.value.addEventListener('mousedown', (e: MouseEvent) => {
    active = true

    initialX = e.clientX
    initialY = e.clientY

    initialWindowX = dialog.value.offsetLeft
    initialWindowY = dialog.value.offsetTop
  })

  document.addEventListener('mouseup', () => {
    active = false
  })

  document.addEventListener('mousemove', (e) => {
    if (active) {
      const dx = e.clientX - initialX
      const dy = e.clientY - initialY

      baseLeft.value = initialWindowX + dx
      baseTop.value = initialWindowY + dy
    }
  })
}

const handleClear = () => {
  document.onmouseup = () => {
    document.onmousemove = null
    document.onmouseup = null
  }
}

const rangeMove = (e: MouseEvent, position: string) => {
  //移动的方向
  let x: boolean = false
  let y: boolean = false
  //移动的位置
  let xp: boolean = false
  let yp: boolean = false
  //移动的正负
  let xc: boolean = false
  let yc: boolean = false
  let disX = e.clientX
  let disY = e.clientY
  document.onmousemove = e => {
    if (position === 'bottom-right') {
      x = true
      y = true
    } else if (position === 'bottom-left') {
      x = true
      y = true
      xp = true
      xc = true
    } else if (position === 'top-right') {
      x = true
      y = true
      yp = true
      yc = true
    } else if (position === 'top-left') {
      x = true
      y = true
      xp = true
      xc = true
      yp = true
      yc = true
    }
    let left = e.clientX - disX
    let top = e.clientY - disY
    disX = e.clientX
    disY = e.clientY
    if (x) {
      let calc = left

      if (xc) {
        calc = -calc
      }

      if (xp) {
        baseLeft.value = baseLeft.value - calc
      }

      const width = baseWidth.value + calc

      baseWidth.value = width <= props.dragRang[0] ? props.dragRang[0] : width
    }
    if (y) {
      let calc = top
      if (yc) {
        calc = -calc
      }

      if (yp) {
        baseTop.value = baseTop.value - calc
      }

      const height = baseHeight.value + calc

      baseHeight.value = height <= props.dragRang[1] ? props.dragRang[1] : height

      emits('heightChange', baseHeight.value)
    }
  }
  handleClear()
}

const onClose = () => {
  console.log('close---1')
  emits("close")
}

onMounted(() => {
  if (dialog.value && header.value) {
    onDrag()
  }
  if (ele) {
    const data = ele?.getBoundingClientRect()
    baseLeft.value = (data?.right - baseWidth.value) / 2 || 0
    baseTop.value = data?.top + 200 || 0
  }
})

watch(() => props.height, () => {
  if (props.height > baseHeight.value) {
    baseHeight.value = props.height
  }
})
</script>

<style lang='less' scoped>
@boxColor: rgb(@primary-color);

// 弹窗动画
.dialog-enter-active,
.dialog-leave-active {
  transition: opacity .5s;
}

.dialog-enter,
.dialog-leave-to {
  opacity: 0;
}

.dialog {
  position: fixed;
  z-index: 1000;

  .dialog-sprite {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    z-index: 23456765435;
    background-color: #ffffff;
    border-radius: 4px;
    border: 1px solid #91CAFF;
    box-shadow: 0 3px 8px 0 rgba(#1677FF, 0.24);

    .header {
      padding: 5px 15px;
      font-size: 18px;
      font-weight: 700;
      color: #333;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #f0f0f0;
      cursor: move;
    }

    .dialog-body {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      padding: 24px 20px;
    }

    .dialog-footer {
      border-top: 1px solid #f0f0f0;
      padding: 5px 15px;
    }
  }

  .range {
    position: absolute;
    width: 16px;
    height: 16px;
    border-radius: 100%;
    z-index: 23456765436;
  }

  .bottom-right, .top-left {
    &:hover {
      cursor: nwse-resize
    }
  }

  .bottom-left, .top-right {
    &:hover {
      cursor: nesw-resize
    }
  }

  .top-right {
    top: -6px;
    right: -6px;
  }

  .top-left {
    top: -6px;
    left: -6px;
  }

  .bottom-right {
    bottom: -6px;
    right: -6px;
  }

  .bottom-left {
    bottom: -6px;
    left: -6px;
  }
}
</style>
