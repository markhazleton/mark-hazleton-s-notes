import { Info, AlertTriangle, Lightbulb, type LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface CalloutProps {
  type?: 'info' | 'warning' | 'tip';
  title?: string;
  children: ReactNode;
}

const calloutConfig: Record<string, { icon: LucideIcon; className: string }> = {
  info: { icon: Info, className: 'callout-info' },
  warning: { icon: AlertTriangle, className: 'callout-warning' },
  tip: { icon: Lightbulb, className: 'callout-tip' },
};

export function Callout({ type = 'info', title, children }: CalloutProps) {
  const config = calloutConfig[type];
  const Icon = config.icon;

  return (
    <div className={`callout ${config.className}`}>
      <div className="flex items-start gap-3">
        <Icon className="h-5 w-5 mt-0.5 shrink-0" />
        <div>
          {title && (
            <p className="font-heading font-semibold text-foreground mb-1">{title}</p>
          )}
          <div className="text-sm text-foreground/90">{children}</div>
        </div>
      </div>
    </div>
  );
}
