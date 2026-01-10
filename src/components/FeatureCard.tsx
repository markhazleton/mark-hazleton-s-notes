import { Link } from 'react-router-dom';
import { ArrowRight, type LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  color?: 'primary' | 'accent' | 'muted';
}

export function FeatureCard({ title, description, icon: Icon, href, color = 'primary' }: FeatureCardProps) {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    accent: 'bg-accent/10 text-accent',
    muted: 'bg-muted text-muted-foreground',
  };

  return (
    <Link 
      to={href}
      className="group block paper-card p-6 transition-all duration-300 hover:-translate-y-1"
    >
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${colorClasses[color]}`}>
        <Icon className="h-6 w-6" />
      </div>
      
      <h3 className="font-heading text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
        {title}
      </h3>
      
      <p className="text-muted-foreground text-sm leading-relaxed mb-4">
        {description}
      </p>
      
      <span className="inline-flex items-center text-sm font-medium text-primary group-hover:gap-2 gap-1 transition-all">
        Explore
        <ArrowRight className="h-4 w-4" />
      </span>
    </Link>
  );
}
