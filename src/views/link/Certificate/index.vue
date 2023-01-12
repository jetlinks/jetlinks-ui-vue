<template>
  <a-button type="primary" @click="handlAdd">新增</a-button>
</template>
<script lang="ts" setup name="CertificatePage">

const router = useRouter();


const handlAdd = () => {
  router.push('/link/certificate/detail/add');
  
}

</script>
