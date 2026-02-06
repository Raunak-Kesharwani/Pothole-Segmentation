import { Target, BarChart3, Crosshair, Percent } from 'lucide-react';


interface AIMetricsProps {
    confidence: number; // 0.0 to 1.0
    area_pixels?: number;
    area_ratio?: number; // 0.0 to 1.0
}

export function AIMetrics({ confidence, area_pixels, area_ratio }: AIMetricsProps) {
    // Static model capabilities (Benchmarks for YOLOv8s on Pothole Dataset)
    const MODEL_SPECS = {
        mAP: 0.894,
        IoU: 0.82,
        dice: 0.88,
    };

    const metrics = [
        {
            label: 'Confidence',
            value: `${((confidence ?? 0) * 100).toFixed(1)}%`,
            desc: 'Detection Certainty',
            icon: Target,
            color: 'text-emerald-500',
            bg: 'bg-emerald-50 dark:bg-emerald-900/20',
            isRealtime: true,
        },
        {
            label: 'Dice Coefficient',
            value: MODEL_SPECS.dice.toFixed(2),
            desc: 'Model F1 Score',
            icon: BarChart3,
            color: 'text-blue-500',
            bg: 'bg-blue-50 dark:bg-blue-900/20',
            isRealtime: false,
        },
        {
            label: 'IoU (Mean)',
            value: MODEL_SPECS.IoU.toFixed(2),
            desc: 'Intersection o/ Union',
            icon: Crosshair,
            color: 'text-purple-500',
            bg: 'bg-purple-50 dark:bg-purple-900/20',
            isRealtime: false,
        },
        {
            label: 'mAP@50',
            value: MODEL_SPECS.mAP.toFixed(3),
            desc: 'Mean Avg Precision',
            icon: Percent,
            color: 'text-orange-500',
            bg: 'bg-orange-50 dark:bg-orange-900/20',
            isRealtime: false,
        },
    ];

    // Dynamic Severity Calculation
    const getSeverity = (ratio: number) => {
        if (ratio > 0.05) return { level: 'Critical', color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30' };
        if (ratio > 0.02) return { level: 'High', color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/30' };
        if (ratio > 0.005) return { level: 'Medium', color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/30' };
        return { level: 'Low', color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' };
    };

    const severity = area_ratio ? getSeverity(area_ratio) : { level: 'Analyzing', color: 'text-slate-500', bg: 'bg-slate-100' };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase text-slate-500 tracking-wider">
                    Analysis Metrics
                </h3>
                <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-500 font-mono">
                    YOLOv8-Seg
                </span>
            </div>

            {/* Core Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {metrics.map((m) => (
                    <div key={m.label} className="bg-white dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
                        {m.isRealtime && (
                            <div className="absolute top-0 right-0 px-2 py-1 bg-emerald-100 dark:bg-emerald-500/20 text-[9px] font-bold text-emerald-700 dark:text-emerald-300 rounded-bl-lg">
                                LIVE
                            </div>
                        )}
                        <div className={`w-10 h-10 ${m.bg} ${m.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                            <m.icon size={20} />
                        </div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                            {m.value}
                        </div>
                        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
                            {m.label}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {m.desc}
                        </div>
                    </div>
                ))}
            </div>

            {/* Detailed Analysis Section */}
            {area_pixels !== undefined && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Severity Card */}
                    <div className="bg-slate-50 dark:bg-slate-900/30 rounded-xl p-4 border border-slate-100 dark:border-slate-800 flex flex-col justify-center">
                        <span className="text-xs font-semibold text-slate-500 uppercase mb-2">Pothole Severity</span>
                        <div className="flex items-center gap-3">
                            <div className={`px-3 py-1 rounded-full text-sm font-bold ${severity.bg} ${severity.color}`}>
                                {severity.level}
                            </div>
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                                Based on {((area_ratio || 0) * 100).toFixed(2)}% coverage
                            </span>
                        </div>
                    </div>

                    {/* Dimensions Card */}
                    <div className="bg-slate-50 dark:bg-slate-900/30 rounded-xl p-4 border border-slate-100 dark:border-slate-800 flex flex-col justify-center">
                        <span className="text-xs font-semibold text-slate-500 uppercase mb-2">Estimated Impact</span>
                        <div className="text-sm text-slate-700 dark:text-slate-300">
                            approx. <strong>{area_pixels.toLocaleString()}</strong> damaged pixels
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                            Recommendation: {
                                severity.level === 'Critical' ? 'Immediate road closure & repair required.' :
                                    severity.level === 'High' ? 'Schedule repair within 48 hours.' :
                                        severity.level === 'Medium' ? 'Monitor and schedule maintenance.' :
                                            'Low priority. Monitor for expansion.'
                            }
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
