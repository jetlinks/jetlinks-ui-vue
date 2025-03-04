<template>
  <div>
    <a-checkbox
        v-model:checked="myValue"
        :indeterminate="indeterminate"
        :disabled='data.code === USER_CENTER_MENU_CODE'
        @change="menuChange"
    >{{ data.i18nName || data.name }}</a-checkbox>
  </div>
</template>

<script setup>
import {USER_CENTER_MENU_CODE} from "@/utils/consts";

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['change', 'update:value'])

const myValue = ref()
const indeterminate = ref()

const menuChange = (e) => {
  emit('update:value', e.target.checked)
  emit('change')
}

function flattenArray(arr = []) {
  return (arr || []).reduce((acc, item) => {
    acc.push(item);
    if (item.children) {
      acc.push(...flattenArray(item.children));
    }
    return acc;
  }, []);
}
const handleData = (dt) => {
  const arr = flattenArray(dt?.children) || []
  const _data = arr.filter(i => i.granted) // 1: true, 0: 没值 -1:false
  const flag = !arr.length ? 0 : arr.length === _data.length ? 1 : -1
  const btns = dt.buttons || []
  const _btns = btns.filter(i => i.granted)
  const _flag = !btns.length ? 0 : btns.length === _btns.length ? 1 : -1;
  if(flag === 0 && _flag === 0) {
    myValue.value = dt.granted
    indeterminate.value = false
  } else if((flag === 1 && _flag === 1) || (flag === 1 && _flag === 0) || (flag === 0 && _flag === 1)){
    myValue.value = true
    indeterminate.value = false
  } else {
    myValue.value = false
    indeterminate.value = _data.length || _btns.length
  }
}

watch(() => props.data, () => {
  handleData(props.data)
}, {
  deep: true,
  immediate: true
})
</script>

<style lang="less" scoped>

</style>
