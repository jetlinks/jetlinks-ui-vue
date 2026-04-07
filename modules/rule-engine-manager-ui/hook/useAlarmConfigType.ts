import {getTargetTypes} from '../api/configuration';
import {useMenuStore} from "@jetlinks-web-core/store";

export const useAlarmConfigType = (filter: string[] = []) => {
    type Options = { label: string; value: string };
    const supports = ref<Options[]>([]);

    const alarmType = inject('alarmTriggerType', 'iot')
    const menuStore = useMenuStore();

    getTargetTypes().then((res) => {
        const _filter = [...filter]
        if (alarmType === 'iot' && !menuStore.hasMenu('DataCollect/Collector') || (alarmType === 'edge' && !menuStore.hasMenu('data-collect/collector'))) {
            _filter.push('collector')
        }
        if(alarmType === 'edge') {
            _filter.push(...['scene', 'organization'])
        }
        supports.value = res.result.map((item: any) => {
            return {
                label: item.name,
                value: item.id,
            };
        }).filter((item: any) => {
            return !_filter.includes(item.value)
        });
    });
    return {
        supports,
    };
}
