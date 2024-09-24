<template>
  <div class="device-select-warp">
    <pro-search
      :columns="columns"
      type="simple"
      @search="handleSearch"
    />
    <JProTable
      ref="edgeDeviceRef"
      model="CARD"
      :columns="columns"
      :request="query"
      :params="params"
      :gridColumn="1"
    >
    </JProTable>
  </div>
</template>

<script setup name="BatchDeviceSelect">
const params = ref()

const columns = [

]

const handleSearch = (e) => {
  params.value = e
}

const query = () => {
  return {}
}

</script>

<style scoped lang="less">
.device-select-warp {

}
</style>
