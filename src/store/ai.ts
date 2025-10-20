import {defineStore} from "pinia";
import {queryAgentList} from "@/api/comm";
import {useAuthStore} from "@/store/auth";
import {ACCESS_AI_AGENT_CODE, USER_CENTER_MENU_CODE} from "@/utils/consts";

export const useAIStore = defineStore('ai', () => {
  const showAiButton = ref(false)
  const showAiDrawer = ref(false)
  const agentList = ref<any[]>([])
  const parameters = ref<any>({})

  const isPermission = useAuthStore().hasPermission(
      `${USER_CENTER_MENU_CODE}:${ACCESS_AI_AGENT_CODE}`,
  );

  // 隐藏按钮
  const hideAiButton = () => {
    showAiButton.value = false
  }
  // 关闭窗口/显示窗口
  const setDrawer = (bool: boolean) => {
    showAiDrawer.value = bool
  }
  // 查询智能体列表
  const queryAgent = async (clientId: string, _parameters: any) => {
    console.log(_parameters, '_parameters')
    if (isPermission) {
      const resp = await queryAgentList('pagePoint', clientId)
      if (resp.success && resp.result) {
        agentList.value = resp.result
        if (agentList.value.length > 0) {
          showAiButton.value = true
          parameters.value = _parameters
        }
      }
    }
  }

  return {
    showAiButton,
    showAiDrawer,
    agentList,
    parameters,
    hideAiButton,
    queryAgent,
    setDrawer
  }
})
