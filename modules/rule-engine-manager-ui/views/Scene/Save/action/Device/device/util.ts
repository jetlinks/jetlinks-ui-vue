import i18n from '@jetlinks-web-core/locales/index'
import { sceneImages } from "../../../../../../assets/index"
const $t = i18n.global.t
export const TypeMap = {
    fixed: {
        label: $t('device.util.9667827-0'),
        value: 'fixed',
        image: sceneImages.deviceCustom,
        tip: $t('device.util.9667827-1'),
        disabled: false
    },
    relation: {
        label: $t('device.util.9667827-2'),
        value: 'relation',
        image: sceneImages.deviceRelation,
        tip: $t('device.util.9667827-3'),
        disabled: false
    },
    tag: {
        label: $t('device.util.9667827-4'),
        value: 'tag',
        image: sceneImages.deviceTag,
        tip: $t('device.util.9667827-5'),
        disabled: false
    },
    context: {
        label: $t('device.util.9667827-6'),
        value: 'context',
        image: sceneImages.deviceVariable,
        tip: $t('device.util.9667827-7'),
        disabled: false
    },
}
