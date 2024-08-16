import i18n from '@/i18n'

const $t = i18n.global.t
import {getImage} from "@/utils/comm";

export const TypeMap = {
    fixed: {
        label: $t('device.util.5425995-0'),
        value: 'fixed',
        image: getImage('/scene/device-custom.png'),
        tip: $t('device.util.5425995-1'),
        disabled: false
    },
    relation: {
        label: $t('device.util.5425995-2'),
        value: 'relation',
        image: getImage('/scene/device-relation.png'),
        tip: $t('device.util.5425995-3'),
        disabled: false
    },
    tag: {
        label: $t('device.util.5425995-4'),
        value: 'tag',
        image: getImage('/scene/device-tag.png'),
        tip: $t('device.util.5425995-5'),
        disabled: false
    },
    context: {
        label: $t('device.util.5425995-6'),
        value: 'context',
        image: getImage('/scene/device-variable.png'),
        tip: $t('device.util.5425995-7'),
        disabled: false
    },
}
