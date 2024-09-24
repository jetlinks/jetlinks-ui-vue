<template>
  <div class="log">
    <div>
      操作记录
    </div>
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

<script setup name="BatchLog">

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

<style scoped>

</style>
