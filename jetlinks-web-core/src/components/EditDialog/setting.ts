import {
    Input,
    InputNumber,
    Select,
    Radio,
    Switch,
    TimePicker,
    TreeSelect,
    RangePicker,
    DatePicker,
    Slider,
    Rate
} from 'ant-design-vue';

export const componentsType = {
    'input': Input,
    'input-number': InputNumber,
    'select': Select,
    'radio': Radio,
    'switch': Switch,
    'time-picker': TimePicker,
    'tree-select': TreeSelect,
    'range-picker': RangePicker,
    'date-picker': DatePicker,
    'slider': Slider,
    'rate': Rate,
    'textarea': Input.TextArea
}

export const getComponentItem = (itemType: string, _components: any): any => {
    if (itemType === 'component') {
        if (_components) {
            return _components
        }
    } else if (itemType in componentsType) {
        return componentsType[itemType]
    } else {
        return Input
    }
}

/**
 * 合并对象
 * @param target
 * @param source
 */
export function reactiveAssign(target: any = {}, source: any = {}) {
    Object.keys(source).forEach(key => {
        if (typeof source[key] === 'object' && source[key] !== null) {
            // 动态创建缺失的嵌套结构
            if (!target[key]) {
                target[key] = reactive({})
            };
            reactiveAssign(target[key], source[key]);
        } else {
            // 基础类型直接赋值
            target[key] = source[key];
        }
    });
}
