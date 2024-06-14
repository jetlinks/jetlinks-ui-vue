<template>
  <div class='rule-button-warp' :style='style'>
    <slot name="extra"/>
    <div class='rule-button add-button' :class="{'add-circular': showCircular}" @click='click'>
      <slot />
    </div>
  </div>
</template>

<script setup lang='ts' name='AddButton'>
import type { PropType, CSSProperties} from 'vue'

type Emit = {
  (e: 'click'): void
}

const props = defineProps({
  style: {
    type: Object as PropType<CSSProperties>,
    default: () => ({})
  },
  showCircular: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits<Emit>()

const click = () => {
  emit('click')
}

</script>

<style scoped lang='less'>
.rule-button-warp {
  display: inline-block;
  padding: 14px 16px;
  background-color: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 2px;
  cursor: pointer;

.rule-button {
  display: inline-block;
  font-size: 14px;
  line-height: 22px;
}
  .add-circular {
    padding: 6px 20px;
    background-color: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 22px;
  }

.add-button {
  color: #777;

&:hover,
&:active {
   border-color: #d0d0d0;
 }
}
}
</style>
