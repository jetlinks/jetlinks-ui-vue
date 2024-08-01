import CardSelect from './CardSelect.vue';
import type { App } from 'vue';

CardSelect.name = 'JCardSelect';

CardSelect.install = function (app: App) {
    app.component('JCardSelect', CardSelect);
    return app;
};

export default CardSelect;
