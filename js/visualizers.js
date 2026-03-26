/* =============================================
   DSA Playground — Sorting Visualizer Engine
   ============================================= */

class SortingVisualizer {
    constructor() {
        this.array = [];
        this.bars = [];
        this.canvas = document.getElementById('sort-canvas');
        this.stepsEl = document.getElementById('sort-steps');
        this.running = false;
        this.aborted = false;
        this.comparisons = 0;
        this.swaps = 0;
        this.speed = 50;
    }

    generateArray(size) {
        this.array = [];
        for (let i = 0; i < size; i++) {
            this.array.push(Math.floor(Math.random() * 280) + 20);
        }
        this.comparisons = 0;
        this.swaps = 0;
        this.renderBars();
        this.stepsEl.textContent = '';
        this.updateInfo();
    }

    renderBars() {
        this.canvas.innerHTML = '';
        const maxVal = Math.max(...this.array);
        this.bars = this.array.map((val, idx) => {
            const bar = document.createElement('div');
            bar.className = 'sort-bar';
            bar.style.height = `${(val / maxVal) * 280}px`;
            this.canvas.appendChild(bar);
            return bar;
        });
    }

    updateBar(idx, val) {
        const maxVal = Math.max(...this.array);
        if (this.bars[idx]) {
            this.bars[idx].style.height = `${(val / maxVal) * 280}px`;
        }
    }

    updateInfo() {
        const infoEl = document.getElementById('sort-info');
        infoEl.innerHTML = `Comparisons: <span>${this.comparisons}</span> | Swaps: <span>${this.swaps}</span> | Array Size: <span>${this.array.length}</span>`;
    }

    logStep(msg) {
        this.stepsEl.textContent += msg + '\n';
        this.stepsEl.scrollTop = this.stepsEl.scrollHeight;
    }

    async sleep(ms) {
        return new Promise(r => setTimeout(r, ms || this.speed));
    }

    setClass(idx, cls) {
        if (this.bars[idx]) {
            this.bars[idx].className = 'sort-bar ' + cls;
        }
    }

    clearClasses() {
        this.bars.forEach(b => b.className = 'sort-bar');
    }

    markAllSorted() {
        this.bars.forEach(b => b.className = 'sort-bar sorted');
    }

    async swap(i, j) {
        [this.array[i], this.array[j]] = [this.array[j], this.array[i]];
        this.updateBar(i, this.array[i]);
        this.updateBar(j, this.array[j]);
        this.swaps++;
        this.updateInfo();
    }

    // ─── Sorting Algorithms ───

    async bubbleSort() {
        const n = this.array.length;
        for (let i = 0; i < n && !this.aborted; i++) {
            let swapped = false;
            for (let j = 0; j < n - i - 1 && !this.aborted; j++) {
                this.setClass(j, 'comparing');
                this.setClass(j + 1, 'comparing');
                this.comparisons++;
                this.updateInfo();
                await this.sleep();

                if (this.array[j] > this.array[j + 1]) {
                    this.setClass(j, 'swapping');
                    this.setClass(j + 1, 'swapping');
                    await this.swap(j, j + 1);
                    swapped = true;
                    await this.sleep();
                }

                this.setClass(j, '');
                this.setClass(j + 1, '');
            }
            this.setClass(n - i - 1, 'sorted');
            if (!swapped) {
                for (let k = 0; k < n - i - 1; k++) this.setClass(k, 'sorted');
                break;
            }
        }
    }

    async selectionSort() {
        const n = this.array.length;
        for (let i = 0; i < n && !this.aborted; i++) {
            let minIdx = i;
            this.setClass(i, 'comparing');

            for (let j = i + 1; j < n && !this.aborted; j++) {
                this.setClass(j, 'comparing');
                this.comparisons++;
                this.updateInfo();
                await this.sleep();

                if (this.array[j] < this.array[minIdx]) {
                    if (minIdx !== i) this.setClass(minIdx, '');
                    minIdx = j;
                    this.setClass(minIdx, 'swapping');
                } else {
                    this.setClass(j, '');
                }
            }

            if (minIdx !== i) {
                this.setClass(i, 'swapping');
                this.setClass(minIdx, 'swapping');
                await this.swap(i, minIdx);
                await this.sleep();
                this.setClass(minIdx, '');
            }
            this.setClass(i, 'sorted');
        }
    }

    async insertionSort() {
        const n = this.array.length;
        this.setClass(0, 'sorted');

        for (let i = 1; i < n && !this.aborted; i++) {
            const key = this.array[i];
            let j = i - 1;
            this.setClass(i, 'comparing');
            await this.sleep();

            while (j >= 0 && this.array[j] > key && !this.aborted) {
                this.comparisons++;
                this.setClass(j, 'swapping');
                this.array[j + 1] = this.array[j];
                this.updateBar(j + 1, this.array[j + 1]);
                this.swaps++;
                this.updateInfo();
                await this.sleep();
                this.setClass(j, 'sorted');
                j--;
            }
            if (j >= 0) this.comparisons++;

            this.array[j + 1] = key;
            this.updateBar(j + 1, key);
            this.updateInfo();

            for (let k = 0; k <= i; k++) this.setClass(k, 'sorted');
            await this.sleep();
        }
    }

    async mergeSort() {
        await this._mergeSort(0, this.array.length - 1);
    }

    async _mergeSort(lo, hi) {
        if (lo >= hi || this.aborted) return;
        const mid = Math.floor((lo + hi) / 2);
        await this._mergeSort(lo, mid);
        await this._mergeSort(mid + 1, hi);
        await this._merge(lo, mid, hi);
    }

    async _merge(lo, mid, hi) {
        const left = this.array.slice(lo, mid + 1);
        const right = this.array.slice(mid + 1, hi + 1);
        let i = 0, j = 0, k = lo;

        while (i < left.length && j < right.length && !this.aborted) {
            this.setClass(k, 'comparing');
            this.comparisons++;
            this.updateInfo();
            await this.sleep();

            if (left[i] <= right[j]) {
                this.array[k] = left[i++];
            } else {
                this.array[k] = right[j++];
                this.swaps++;
            }
            this.updateBar(k, this.array[k]);
            this.setClass(k, 'sorted');
            k++;
        }

        while (i < left.length && !this.aborted) {
            this.array[k] = left[i++];
            this.updateBar(k, this.array[k]);
            this.setClass(k, 'sorted');
            k++;
            await this.sleep();
        }

        while (j < right.length && !this.aborted) {
            this.array[k] = right[j++];
            this.updateBar(k, this.array[k]);
            this.setClass(k, 'sorted');
            k++;
            await this.sleep();
        }
        this.updateInfo();
    }

    async quickSort() {
        await this._quickSort(0, this.array.length - 1);
    }

    async _quickSort(lo, hi) {
        if (lo >= hi || this.aborted) return;
        const pivotIdx = await this._partition(lo, hi);
        await this._quickSort(lo, pivotIdx - 1);
        await this._quickSort(pivotIdx + 1, hi);
        for (let i = lo; i <= hi; i++) this.setClass(i, 'sorted');
    }

    async _partition(lo, hi) {
        const pivot = this.array[hi];
        this.setClass(hi, 'pivot');
        let i = lo - 1;

        for (let j = lo; j < hi && !this.aborted; j++) {
            this.setClass(j, 'comparing');
            this.comparisons++;
            this.updateInfo();
            await this.sleep();

            if (this.array[j] <= pivot) {
                i++;
                if (i !== j) {
                    this.setClass(i, 'swapping');
                    this.setClass(j, 'swapping');
                    await this.swap(i, j);
                    await this.sleep();
                }
            }
            this.setClass(j, '');
            if (i >= lo) this.setClass(i, '');
        }

        this.setClass(hi, 'swapping');
        this.setClass(i + 1, 'swapping');
        await this.swap(i + 1, hi);
        await this.sleep();
        this.setClass(i + 1, 'sorted');
        this.setClass(hi, '');

        return i + 1;
    }

    async run(algorithm) {
        if (this.running) return;
        this.running = true;
        this.aborted = false;
        this.comparisons = 0;
        this.swaps = 0;
        this.clearClasses();
        this.updateInfo();

        const startTime = performance.now();

        switch (algorithm) {
            case 'bubble':    await this.bubbleSort(); break;
            case 'selection': await this.selectionSort(); break;
            case 'insertion': await this.insertionSort(); break;
            case 'merge':     await this.mergeSort(); break;
            case 'quick':     await this.quickSort(); break;
        }

        if (!this.aborted) {
            this.markAllSorted();
            const elapsed = ((performance.now() - startTime) / 1000).toFixed(2);
            this.logStep(`✅ Done! ${this.comparisons} comparisons, ${this.swaps} swaps in ${elapsed}s`);
        }

        this.running = false;
    }

    stop() {
        this.aborted = true;
        this.running = false;
    }
}
