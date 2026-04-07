import {useRulePermissionContext, useScenePermissionContext} from '@rule-engine-manager-ui/hook/usePermission'
import {EventEmitter, DeviceEmitterKey, ACTION_DATA} from '@rule-engine-manager-ui/views/Scene/Save/util';

export default {
    components: {
        ruleInstance: defineAsyncComponent(() => import('./views/Instance/index.vue')),
        scenePage: defineAsyncComponent(() => import('./views/Scene/index.vue')),
        sceneSavePage: defineAsyncComponent(() => import('./views/Scene/Save/index.vue')),
        sceneSaveAddButton: defineAsyncComponent(() => import('./views/Scene/Save/components/AddButton.vue')),
        sceneSaveTerms: defineAsyncComponent(() => import('./views/Scene/Save/components/Terms')),
        AlarmDashboard: defineAsyncComponent(() => import('./views/DashBoard/index.vue')),
        AlarmConfig: defineAsyncComponent(() => import('./views/Alarm/Config/index.vue')),
        AlarmConfiguration: defineAsyncComponent(() => import('./views/Alarm/Configuration/index.vue')),
        AlarmConfigurationSave: defineAsyncComponent(() => import('./views/Alarm/Configuration/Save/index.vue')),
        AlarmConfigurationLog: defineAsyncComponent(() => import('./views/Alarm/Log/index.vue')),
        AlarmConfigurationLogDetail: defineAsyncComponent(() => import('./views/Alarm/Log/Detail/index.vue')),
        AlarmConfigurationLogRecord: defineAsyncComponent(() => import('./views/Alarm/Log/Record/index.vue')),
    },
    hooks: {
        useRulePermissionContext,
        useScenePermissionContext
    },
    stores: {},
    utils: {
        EventEmitter, DeviceEmitterKey, ACTION_DATA
    }
}
