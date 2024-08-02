import { defineStore } from 'pinia';
import { getReportConfig } from '@/api/system/analysis';
type AnalysisReport = {
    id: string;
    deviceMessages: boolean;
    deviceDistribution: boolean;
    traffic: boolean;
    cpuUsageTrend: boolean;
    jvmUsageTrend: boolean;
    alarmStatistics: boolean;
    pointDataVolume: boolean;
    numberOfPlays: boolean;
    trafficStatistics: boolean;
    trafficUsage: boolean;
};
export const useAnalysisStore = defineStore({
    id: 'analysisReport',
    state: () => ({
        current: {} as AnalysisReport,
    }),
    actions: {
        setCurrent(current: AnalysisReport) {
            this.current = current;
        },
        async refresh() {
            const resp: any = await getReportConfig();
            if (resp.status === 200) {
                this.current = resp.result[0];
            }
        },
    },
});
