import { h, createApp } from 'vue';
import InfoWindow from '../components/InfoWindow.vue';
const createWindow = (
    locationName: string,
    result: any,
    closeApp: Function,
) => {
    const div = document.createElement('div');
    const app = createApp({
        render() {
            return h(InfoWindow, { locationName, result, closeApp });
        },
    });
    app.mount(div);

    return { div, app };
};

export { createWindow };
