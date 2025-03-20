import { getObjectList_api } from '@/api/system/relationship';
export const useRelationTypes = () => {
    //关联方列表
    const relationTypes = ref([]);
    //被关联方列表
    const beRelationTypes = ref([]);
    getObjectList_api().then(res => {
        relationTypes.value = res.result.filter(item => item.id === 'device');
        beRelationTypes.value = res.result.filter(item => item.id === 'user');
    })
    return {
        relationTypes,
        beRelationTypes
    }
}
  