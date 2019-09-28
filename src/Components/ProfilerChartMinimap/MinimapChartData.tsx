export interface ChartMinimapItem {
    from: number;
    to: number;
    color?: string;
}

export interface MinimapChartData {
    lines: Array<{ items: ChartMinimapItem[] }>;
}
