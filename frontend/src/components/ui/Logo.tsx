import { cn } from '../../lib/utils';
import { Target } from 'lucide-react';

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
    iconSize?: number;
}

export function Logo({ className, iconSize = 20, ...props }: LogoProps) {
    return (
        <div
            className={cn(
                "bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-emerald-500/20",
                className
            )}
            {...props}
        >
            <Target size={iconSize} />
        </div>
    );
}
