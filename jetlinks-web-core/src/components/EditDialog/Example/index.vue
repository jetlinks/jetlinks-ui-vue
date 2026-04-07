<template>
  <div>
    <EditDialog :title="_data.a ? '编辑' : '新增'" :schema="schema" :data="_data" :request="update">
      <template #f="{value, update}">
        <a-input-number :value="value" @change="(val) => update(val)" style="width: 300px" />
      </template>
    </EditDialog>
  </div>
</template>

<script setup>
import Test from "./Test.vue";

const _data = ref({
  a: "11111",
  b: "offline",
  c: "1937765545165430784",
  f: 11111,
  obj: {a: '1111', b: '1111'}
})

const schema = [
  {
    label: 'Input',
    name: 'a',
    rules: [
      {
        required: true,
        message: '请输入ID'
      }
    ],
    componentProps: {
      placeholder: '请输入ID'
    }
  },
  {
    label: 'Select',
    name: 'b',
    itemType: 'select',
    componentProps: {
      placeholder: '请选择',
      options: [
        { label: $t('Instance.index.133466-7'), value: 'notActive' },
        { label: $t('Instance.index.133466-8'), value: 'offline' },
        { label: $t('Instance.index.133466-9'), value: 'online' },
      ],
    }
  },
  // {
  //   label: 'Select-request',
  //   name: 'c',
  //   itemType: 'select',
  //   componentProps: {
  //     placeholder: '请选择',
  //     options: () =>
  //         new Promise((resolve) => {
  //           queryNoPagingPost({ paging: false }).then((resp: any) => {
  //             resolve(
  //                 resp.result.map((item: any) => ({
  //                   label: item.name,
  //                   value: item.id,
  //                 })),
  //             );
  //           });
  //         }),
  //   }
  // },
  {
    label: 'obj.a',
    name: ['obj', 'a'],
    componentProps: {
      placeholder: '请输入名称'
    }
  },
  {
    label: 'obj.b',
    name: ['obj', 'b'],
    componentProps: {
      placeholder: '请输入名称'
    },
    itemType: 'component',
    components: Test
  },
  {
    label: '名称11',
    name: 'f',
    slotName: 'f'
  },
]
</script>

<style lang="less" scoped>

</style>
