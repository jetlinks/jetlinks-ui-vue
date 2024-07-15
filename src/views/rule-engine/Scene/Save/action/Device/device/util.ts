import {getImage} from "@/utils/comm";

export const TypeMap = {
    fixed: {
        label: '自定义',
        value: 'fixed',
        image: getImage('/scene/device-custom.png'),
        tip: '自定义选择当前产品下的任意设备',
    },
    relation: {
        label: '按关系',
        value: 'relation',
        image: getImage('/scene/device-relation.png'),
        tip: '选择与触发设备具有相同关系的设备',
    },
    tag: {
        label: '按标签',
        value: 'tag',
        image: getImage('/scene/device-tag.png'),
        tip: '按标签选择产品下具有特定标签的设备',
    },
    context: {
        label: '按变量',
        value: 'context',
        image: getImage('/scene/device-variable.png'),
        tip: '选择设备ID为上游变量值的设备',
    },
}
