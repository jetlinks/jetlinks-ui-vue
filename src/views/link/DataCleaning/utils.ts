import Record from '@/views/notice/Template/Log/components/Record.vue';

export const copyFormData = (formData: Record<string, any>) => {
    const temp = {};
    for (const key in formData) {
        if (formData[key]) {
            temp[key] = formData[key];
        }
    }
    return temp;
};

export const metadata2Object = (metadata: string) => {
    metadata = metadata.replace(/\\/g, '');
    return JSON.parse(metadata);
};

export const obj2Metadata = (obj: Record<string, any>) => {
    // current内部已做下方注释中的处理，
    return JSON.stringify(obj);
    // const result = temp.replace(/"/g, '\\"');
    // console.log('str', result);
};

export const objectsIsCross = (
    superObj: Record<string, any>,
    baseObj: Record<string, any>,
) => {
    const excludeKeys = ['accuracy', 'offset', 'source', 'type'];
    const superKeys: string[] = [];
    for (let key in superObj) {
        if (!excludeKeys.some((item) => key === item)) {
            superKeys.push(key);
        }
    }
    const baseKeys = Object.keys(baseObj);
    return superKeys.some((key) => baseKeys.includes(key));
};
