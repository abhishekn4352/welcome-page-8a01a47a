import React from 'react';
import { Widget, WidgetType } from '../../types';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface WidgetRendererProps {
    widget: Widget;
}

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))', 'hsl(var(--primary))'];

const getData = () => [
    { name: 'Jan', value: 400, value2: 240 },
    { name: 'Feb', value: 300, value2: 139 },
    { name: 'Mar', value: 200, value2: 980 },
    { name: 'Apr', value: 278, value2: 390 },
    { name: 'May', value: 189, value2: 480 },
];

const WidgetRenderer: React.FC<WidgetRendererProps> = ({ widget }) => {
    const data = getData();

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

    const renderChart = () => {
        switch (widget.type) {
            case 'line_chart':
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                            <XAxis dataKey="name" tick={axisStyle} stroke="hsl(var(--border))" />
                            <YAxis tick={axisStyle} stroke="hsl(var(--border))" />
                            <Tooltip contentStyle={tooltipStyle} />
                            <Legend />
                            <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} />
                            <Line type="monotone" dataKey="value2" stroke="hsl(var(--chart-2))" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                );
            case 'bar_chart':
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                            <XAxis dataKey="name" tick={axisStyle} stroke="hsl(var(--border))" />
                            <YAxis tick={axisStyle} stroke="hsl(var(--border))" />
                            <Tooltip contentStyle={tooltipStyle} />
                            <Legend />
                            <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="value2" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                );
            case 'pie_chart':
            case 'doughnut_chart':
                return (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={widget.type === 'doughnut_chart' ? 60 : 0}
                                outerRadius={80}
                                fill="hsl(var(--primary))"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={tooltipStyle} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                );
            case 'stat_card':
                return (
                    <div className="flex flex-col items-center justify-center h-full">
                        <span className="text-4xl font-bold text-primary">1,234</span>
                        <span className="text-muted-foreground">Active Users</span>
                    </div>
                );
            default:
                return (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                        Unsupported Widget Type: {widget.type}
                    </div>
                );
        }
    };

    return (
        <div className="h-full w-full flex flex-col">
            <div className="px-4 py-2 border-b border-border flex justify-between items-center bg-muted/30">
                <h3 className="font-medium text-foreground text-sm">{widget.name || 'Untitled Widget'}</h3>
            </div>
            <div className="flex-1 p-4 min-h-0">
                {renderChart()}
            </div>
        </div>
    );
};

export default WidgetRenderer;
