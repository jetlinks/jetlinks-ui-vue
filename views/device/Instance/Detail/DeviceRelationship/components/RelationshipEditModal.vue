<template>
  <a-modal
    :open='true'
    :title="$t('DeviceRelationship.RelationshipEditModal.789342-0')"
    width='600px'
    @cancel='handleCancel'
    @ok='handleOk'
    :confirm-loading='loading'
  >
    <a-form layout='vertical' ref='formRef' :model='modelRef' v-if='dataSource.length > 0'>
      <a-form-item
        :name='item.relation'
        :label='item.relationName'
        v-for='(item, index) in dataSource'
        :key='index'
      >
        <a-select
          showSearch
          mode='multiple'
          v-model:value='modelRef[item.relation]'
          :placeholder='`请选择${item.relationName}`'
        >
          <a-select-option
            :value='item.value'
            v-for='item in _userList'
            :key='item.id'
            :disabled='item.extra'
          >{{ item.name }}
          </a-select-option
          >
        </a-select>
      </a-form-item>
    </a-form>
    <div v-else>
      <j-empty />
    </div>
  </a-modal>
</template>

<script lang='ts' setup>
import { useI18n } from 'vue-i18n'
import { queryUserListNoPaging } from '@jetlinks-web-core/api/system/user';
import { useRequest } from '@jetlinks-web/hooks'
import { useInstanceStore } from '@device-manager-ui/store/instance'
import { map } from 'lodash-es'
import { saveRelations, getRelationUsers } from '@device-manager-ui/api/instance'
import { onlyMessage } from '@jetlinks-web/utils'

const { t: $t } = useI18n()


const dataSource = ref<Record<any, any>[]>([])
const allData = ref<any[]>([])
const modelRef = reactive<any>({})
const instanceStore = useInstanceStore()
const emit = defineEmits(['close', 'save'])

const _userList = computed(() => {
  console.log(userList.value)
  const arr = allData.value.filter(i => {
    return !map(userList.value || [], 'id').includes(i.id)
  })
  return [...userList.value || [], ...arr]
})

const { data: relations } = useRequest(getRelationUsers)

const { data: userList } = useRequest(queryUserListNoPaging, {
  onSuccess: (res) => {
    return (res.result as Record<string, any>[]).map(
      (item) => {
        return {
          ...item,
          label: item.name,
          value: JSON.stringify({
            id: item.id,
            name: item.name
          })
        }
      }
    )
  }
})

const loading = ref(false)
const formRef = ref()

const formData = reactive({
  owner: '张珊强',
  parentChild: '',
  gateway: '',
  upstream: '',
  reverse: ''
})

const handleCancel = () => {
  emit('close')
}

const handleOk = () => {
  formRef.value.validate().then(async () => {
    loading.value = true
    const values = toRaw(modelRef)
    if (Object.keys(values).length > 0) {
      const param: any[] = []
      Object.keys(values).forEach((key) => {
        const item = dataSource.value.find((i) => i.relation === key)
        const items = (values[key] || []).map((i: string) =>
          JSON.parse(i)
        )
        if (item) {
          param.push({
            relatedType: 'user',
            relation: item.relation,
            description: '',
            related: [...items]
          })
        }
      })
      if (param.length && instanceStore.current.id) {
        const resp = await saveRelations(instanceStore.current.id, param).finally(() => {
          loading.value = false
        })
        if (resp.status === 200) {
          onlyMessage($t('Product.index.660348-18'))
          emit('save')
          formRef.value.resetFields()
        }
      }
    }
  })
}

watch(
  () => instanceStore.current?.relations,
  () => {
    allData.value = []
    const arr = (instanceStore.current?.relations || [])
    dataSource.value = arr as Record<any, any>[]
    arr.map((item) => {
      modelRef[item.relation] = [];
      (item?.related || []).map(i => {
        const _item = JSON.stringify(i)
        modelRef[item.relation].push(_item)
        if (!map(allData.value, 'id').includes(i.id)) {
          allData.value.push({
            ...i,
            label: i.name,
            value: _item,
            extra: true
          })
        }
      })
    })
  }, {
    deep: true,
    immediate: true
  })
</script>

<style lang='less' scoped>
.relationship-form {
  padding-top: 16px;
}
</style>
