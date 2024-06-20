import type { Ref } from 'vue';

class ReactiveSet<T = string | number> {
    public value: Set<T>;
    private length: Ref<number>;
    constructor(initLength: Ref<number>) {
        this.value = new Set();
        this.length = initLength;
    }

    hasItem(id: T) {
        return this.value.has(id);
    }

    setItem(id: T) {
        this.value.add(id);
        this.length.value = this.value.size;
    }

    removeItem(id: T) {
        this.value.delete(id);
        this.length.value = this.value.size;
    }

    reset() {
        this.value.clear();
        this.length.value = 0;
    }
}

export { ReactiveSet };
