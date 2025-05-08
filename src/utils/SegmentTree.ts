interface TreeNode {
    name: string;
    attributes: {
        value: number;
        range: string;
        nodeId: number;
    };
    children: TreeNode[];
}

export class SegmentTree {
    private tree: number[];
    private n: number;
    private originalArray: number[];

    constructor(arr: number[]) {
        this.originalArray = [...arr];
        this.n = arr.length;
        // Размер дерева отрезков может быть до 4*n
        this.tree = new Array(4 * this.n).fill(0);
        this.build(arr, 1, 0, this.n - 1);
    }

    // Построение дерева отрезков
    private build(arr: number[], node: number, start: number, end: number): void {
        if (start === end) {
            // Лист дерева
            this.tree[node] = arr[start];
            return;
        }

        const mid = Math.floor((start + end) / 2);
        // Рекурсивно строим левое и правое поддерево
        this.build(arr, 2 * node, start, mid);
        this.build(arr, 2 * node + 1, mid + 1, end);

        // Вычисляем значение для текущего узла на основе его детей
        this.tree[node] = this.tree[2 * node] + this.tree[2 * node + 1];
    }

    // Обновление значения в массиве
    update(index: number, value: number): void {
        // Обновляем оригинальный массив
        this.originalArray[index] = value;
        this.updateTree(1, 0, this.n - 1, index, value);
    }

    private updateTree(node: number, start: number, end: number, idx: number, val: number): void {
        if (start === end) {
            // Обновляем лист
            this.tree[node] = val;
            return;
        }

        const mid = Math.floor((start + end) / 2);
        if (idx <= mid) {
            // Индекс находится в левом поддереве
            this.updateTree(2 * node, start, mid, idx, val);
        } else {
            // Индекс находится в правом поддереве
            this.updateTree(2 * node + 1, mid + 1, end, idx, val);
        }

        // Обновляем текущий узел
        this.tree[node] = this.tree[2 * node] + this.tree[2 * node + 1];
    }

    // Запрос суммы на отрезке [l, r]
    querySum(l: number, r: number): number {
        if (l < 0 || r >= this.n || l > r) {
            throw new Error("Неверный промежуток");
        }
        return this.querySumHelper(1, 0, this.n - 1, l, r);
    }

    private querySumHelper(node: number, start: number, end: number, l: number, r: number): number {
        // Если текущий отрезок полностью вне запрашиваемого отрезка
        if (start > r || end < l) {
            return 0;
        }

        // Если текущий отрезок полностью внутри запрашиваемого отрезка
        if (l <= start && end <= r) {
            return this.tree[node];
        }

        // Если текущий отрезок частично пересекается с запрашиваемым отрезком
        const mid = Math.floor((start + end) / 2);
        const leftSum = this.querySumHelper(2 * node, start, mid, l, r);
        const rightSum = this.querySumHelper(2 * node + 1, mid + 1, end, l, r);

        return leftSum + rightSum;
    }

    // Для визуализации: получаем структуру дерева в формате, подходящем для react-d3-tree
    getTreeVisualization() {
        return this.getTreeVisualizationHelper(1, 0, this.n - 1);
    }

    private getTreeVisualizationHelper(node: number, start: number, end: number): TreeNode {
        if (start === end) {
            return {
                name: `[${start}] = ${this.tree[node]}`,
                attributes: {
                    value: this.tree[node],
                    range: `[${start}, ${end}]`,
                    nodeId: node
                },
                children: []
            };
        }
        const mid = Math.floor((start + end) / 2);
        return {
            name: `Sum: ${this.tree[node]}`,
            attributes: {
                value: this.tree[node],
                range: `[${start}, ${end}]`,
                nodeId: node
            },
            children: [
                this.getTreeVisualizationHelper(2 * node, start, mid),
                this.getTreeVisualizationHelper(2 * node + 1, mid + 1, end)
            ]
        };
    }

    // Путь обхода дерева при запросе
    getQueryPath(l: number, r: number): number[] {
        if (l < 0 || r >= this.n || l > r) {
            return [];
        }
        const path: number[] = [];
        this.getQueryPathHelper(1, 0, this.n - 1, l, r, path);
        return path;
    }

    private getQueryPathHelper(node: number, start: number, end: number, l: number, r: number, path: number[]): void {
        // Если текущий отрезок полностью вне запрашиваемого отрезка
        if (start > r || end < l) {
            return;
        }

        // Добавляем текущий узел в путь
        path.push(node);

        // Если текущий отрезок полностью внутри запрашиваемого отрезка, мы не идем дальше
        if (l <= start && end <= r) {
            return;
        }

        // Если текущий отрезок частично пересекается с запрашиваемым отрезком
        const mid = Math.floor((start + end) / 2);
        this.getQueryPathHelper(2 * node, start, mid, l, r, path);
        this.getQueryPathHelper(2 * node + 1, mid + 1, end, l, r, path);
    }

    // Отдельный метод для получения только тех узлов, значения которых используются при вычислении суммы
    getUsedNodesInQuery(l: number, r: number): number[] {
        if (l < 0 || r >= this.n || l > r) {
            return [];
        }
        const usedNodes: number[] = [];
        this.getUsedNodesInQueryHelper(1, 0, this.n - 1, l, r, usedNodes);
        return usedNodes;
    }

    private getUsedNodesInQueryHelper(node: number, start: number, end: number, l: number, r: number, usedNodes: number[]): void {
        // Если текущий отрезок полностью вне запрашиваемого отрезка
        if (start > r || end < l) {
            return;
        }

        // Если текущий отрезок полностью внутри запрашиваемого отрезка, это используемый узел
        if (l <= start && end <= r) {
            usedNodes.push(node);
            return; // Важно! Не идем дальше по этой ветке
        }

        // Если текущий отрезок частично пересекается с запрашиваемым отрезком
        const mid = Math.floor((start + end) / 2);
        this.getUsedNodesInQueryHelper(2 * node, start, mid, l, r, usedNodes);
        this.getUsedNodesInQueryHelper(2 * node + 1, mid + 1, end, l, r, usedNodes);
    }

}
