<template>
  <j-modal
    title="新增关联告警"
  >
    <pro-search :columns="columns" type="simple" @search="handleSearch" />
    <JProTable
      :columns="columns"
      :request="queryAlarmList"
      model="CARD"
    />
  </j-modal>
</template>

<script setup name="AlarmModal">
import {} from '@/api/'

const params = ref({})

const columns = [
  {

  }
]

const handleSearch = (e) => {
  params.value = e
}

</script>

<style scoped>

</style>
