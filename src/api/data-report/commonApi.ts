import request from '@/utils/request';
import server from '@/utils/request';
import { number } from 'echarts';
import Record from '@/views/notice/Template/Log/components/Record.vue';

/**
 * 页面索引枚举，用于表示应用中的不同报表页面。
 * 每个枚举成员对应一个特定的报告类型和其对应的URL路径。
 */
export enum PageIndex {
    /**
     * 车辆告警中心页面，展示设备的告警信息。
     * @key 'AlarmSheet'
     * @value 'report_alarm'
     */
    'AlarmSheet' = 'report_alarm',
    /**
     * 故障报告页面，展示设备的故障记录。
     * @key 'FaultSheet'
     * @value 'report_fault'
     */
    'FaultSheet' = 'report_fault',
    /**
     * 超速报警报告页面，显示超速事件。
     * @key 'SpeedAlarm'
     * @value 'speed_alarm'
     */
    'SpeedAlarm' = 'speed_alarm',
    /**
     * 异常振动报告页面，记录设备的碰撞或异常震动事件。
     * @key 'AbnormalVibration'
     * @value 'abnormal_vibration'
     */
    'AbnormalVibration' = 'abnormal_vibration',
    /**
     * 超载报警报告页面，显示设备超载情况。
     * @key 'OverloadAlarm'
     * @value 'overload_alarm'
     */
    'OverloadAlarm' = 'overload_alarm',
    /**
     * ADAS报警报告页面，与高级驾驶辅助系统相关的报警。
     * @key 'ADASAlarm'
     * @value 'adas_alarm'
     */
    'ADASAlarm' = 'adas_alarm',
    'DSMAlarm' = 'dsm_alarm',
}

export const query = (index: PageIndex, data?: any) =>
    request.post(`/vehicle/es/query/${index}`, data);

export const getDicList = (data?: any) =>
    server.post<{
        pageIndex: number;
        pageSize: number;
        total: number;
        data: Record<string, any>[];
    }>(`/dictionary-item/_query`, data);

/**
 * 车辆类型
 */
export const vehicleTypeEnum = () =>
    server.get<any>(`/dictionary/vehicle-type-enum/items`);
