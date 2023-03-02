export type rowType = {
    id?: string;
    locale: string;
    state: { text: string, value: "enabled" | 'disabled' };
    subscribeName: string;
    subscriber: string;
    subscriberType: string;
    topicConfig: { alarmConfigId?: string, alarmConfigName?: string };
    alarmConfigId: string;
    alarmConfigName: stirng;
    topicName: string;
    topicProvider: string| undefined;
    notice?:any[]
}