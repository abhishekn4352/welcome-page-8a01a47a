import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { dashboardService } from '../../services/dashboard.service';

interface SmartWidgetProps {
    config: any;
    globalFilters?: Record<string, any>;
    dummyData?: any[];
}

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))', 'hsl(var(--primary))'];

// Default dummy data for demo/showcase
const DEFAULT_DUMMY_DATA = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 5000 },
    { name: 'Apr', value: 2780 },
    { name: 'May', value: 1890 },
    { name: 'Jun', value: 2390 },
    { name: 'Jul', value: 3490 },
    { name: 'Aug', value: 4200 },
];

const SmartWidget: React.FC<SmartWidgetProps> = ({ config, globalFilters, dummyData }) => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // If dummy data is provided, use it directly
        if (dummyData) {
            setData(dummyData);
            return;
        }

        // If table is 'dummy', use default dummy data
        if (config.table === 'dummy') {
            setData(DEFAULT_DUMMY_DATA);
            return;
        }

        const fetchData = async () => {
            if (!config.table || !config.xAxis || !config.chartType) {
                return;
            }

            setLoading(true);
            try {
                const yAxis = Array.isArray(config.yAxis) ? config.yAxis.join(',') : config.yAxis;
                let filters = '';
                const filterObj: Record<string, any> = {};

                if (config.baseFilters && Array.isArray(config.baseFilters) && config.baseFilters.length > 0) {
                    config.baseFilters.forEach((filter: any) => {
                        if (filter.field && filter.value !== undefined && filter.value !== null && filter.value !== '') {
                            filterObj[filter.field] = filter.value;
                        }
                    });
                }

                if (globalFilters) {
                    Object.entries(globalFilters).forEach(([key, value]) => {
                        if (value !== undefined && value !== null && value !== '') {
                            filterObj[key] = value;
                        }
                    });
                }

                if (Object.keys(filterObj).length > 0) {
                    filters = JSON.stringify(filterObj);
                }

                const response = await dashboardService.getChartData(
                    config.table,
                    config.chartType,
                    config.xAxis,
                    yAxis,
                    config.connection ? Number(config.connection) : undefined,
                    undefined,
                    undefined,
                    filters
                );

                if (response) {
                    let formattedData: any[] = [];

                    if (response.chartLabels && response.chartData) {
                        formattedData = response.chartLabels.map((label: string, index: number) => ({
                            name: label,
                            value: response.chartData[index]
                        }));
                    } else if (response.labels && response.datasets) {
                        const dataset = response.datasets[0];
                        formattedData = response.labels.map((label: string, index: number) => ({
                            name: label,
                            value: dataset ? dataset.data[index] : 0
                        }));
                    } else if (Array.isArray(response)) {
                        formattedData = response;
                    }

                    setData(formattedData);
                }
            } catch (err: any) {
                console.error(`[SmartWidget] Error:`, err);
                setError('Failed to load data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [config, globalFilters, dummyData]);

    if (loading) return <div className="flex h-full items-center justify-center text-muted-foreground text-xs">Loading...</div>;
    if (error) return <div className="flex h-full items-center justify-center text-destructive text-xs">{error}</div>;
    if (!data.length) return <div className="flex h-full items-center justify-center text-muted-foreground text-xs">No Data</div>;

    const renderChart = () => {
        const type = (config.chartType || 'bar').toLowerCase();

        const axisStyle = { 
            fontSize: 11, 
            fill: 'hsl(var(--muted-foreground))' 
        };
        
        const tooltipStyle = {
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            fontSize: '12px',
            color: 'hsl(var(--foreground))'
        };

        switch (type) {
            case 'line':
            case 'line_chart':
                return (
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                        <XAxis dataKey="name" tick={axisStyle} stroke="hsl(var(--border))" />
                        <YAxis tick={axisStyle} stroke="hsl(var(--border))" />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Legend />
                        <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: 'hsl(var(--primary))' }} />
                    </LineChart>
                );
            case 'pie':
            case 'pie_chart':
                return (
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={80}
                            fill="hsl(var(--primary))"
                            dataKey="value"
                            label
                        >
                            {data.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={tooltipStyle} />
                        <Legend />
                    </PieChart>
                );
            case 'bar':
            case 'bar_chart':
            default:
                return (
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                        <XAxis dataKey="name" tick={axisStyle} stroke="hsl(var(--border))" />
                        <YAxis tick={axisStyle} stroke="hsl(var(--border))" />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Legend />
                        <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                );
        }
    };

    return (
        <div className="flex flex-col h-full w-full bg-card p-2 rounded-lg shadow-sm border border-border">
            <h4 className="text-sm font-semibold text-foreground mb-2 truncate" title={config.charttitle || config.name}>
                {config.charttitle || config.name}
            </h4>
            <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    {renderChart()}
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default SmartWidget;
