<template>
  <div :class='["trigger-options-content", isAdd ? "is-add" : ""]'>
    <span v-if='!isAdd'> 点击配置设备触发 </span>
    <template v-else>
      <div class='center-item'>
        <AIcon v-if='options.selectorIcon' :type='options.selectorIcon' class='icon-padding-right' />
        <span class='trigger-options-name'>
            <Ellipsis style='max-width: 310px'>
              {{ options.name }}
            </Ellipsis>
        </span>
        <span v-if='options.extraName'>{{ options.extraName }}</span>
      </div>
      <template v-if='!options.onlyName'>
        <div v-if='options.productName' class='center-item'>
          <AIcon type='icon-chanpin1' class='icon-padding-right' />
          <span class='trigger-options-type'>{{ options.productName }}</span>
        </div>

        <div v-if='options.when'>
          <span class='trigger-options-when'>{{ options.when }}</span>
        </div>
        <div v-if='options.time'>
          <span class='trigger-options-time'>{{ options.time }}</span>
        </div>
        <div v-if='options.extraTime'>
          <span class='trigger-options-extraTime'>{{ options.extraTime }}</span>
        </div>
        <div v-if='options.action' class='center-item'>
          <AIcon :type='options.typeIcon' class='icon-padding-right' />
          <span class='trigger-options-action'>{{ options.action }}</span>
        </div>
        <div v-if='options.type' class='center-item'>
          <AIcon :type='options.typeIcon' class='icon-padding-right' />
          <span class='trigger-options-type'>{{ options.type }}</span>
        </div>
      </template>
    </template>
  </div>
</template>

<script setup lang='ts' name='DeviceTitle'>

const props = defineProps({
  options: {
    type: Object,
    default: () => ({})
  }
})

const isAdd = computed(() => {
  console.log(props.options, Object.keys(props.options).length)
  return !!Object.keys(props.options).length
})

</script>

<style scoped lang='less'>
.trigger-options-content {
  display: inline-flex;
  gap: 16px;

  .center-item {
    display: flex;
    align-items: center;
  }

  .icon-padding-right {
    padding-right: 4px;
  }

}
</style>
