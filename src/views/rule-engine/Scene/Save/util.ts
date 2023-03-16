import { queryBuiltInParams } from '@/api/rule-engine/scene'
import { handleParamsData } from './components/Terms/util'
import { useSceneStore } from 'store/scene'
import { storeToRefs } from 'pinia'
import type { FormModelType } from '@/views/rule-engine/Scene/typings'

interface Params {
  branch: number
  branchGroup: number
  action: number
}

export const getParams = (params: Params, sceneModel: FormModelType): Promise<any[]> => {
  return new Promise(res => {
    const data = sceneModel.branches!.filter(item => !!item)
    queryBuiltInParams({
      ...sceneModel,
      branches: data
    }, params).then(resp => {
      if (resp.success) {
        res(resp.result as any[])
      }
    })
  })
}

/**
 * @param params
 */
export const useParams = (params: Params) => {
  const sceneStore = useSceneStore()
  const { data: formModel } = storeToRefs(sceneStore)
  const columnOptions = ref<any[]>([])

  const handleParams = async () => {
    const _data = await getParams(params, formModel.value)
    columnOptions.value = handleParamsData(_data, 'id')
  }

  watchEffect(() => {
    if (formModel.value.branches![params.branch].then[params.branchGroup].actions[params.action]) {
      handleParams()
    }
  })

  return {
    columnOptions
  }
}