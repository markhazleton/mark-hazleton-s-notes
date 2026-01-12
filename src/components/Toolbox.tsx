import { 
  Cloud, 
  Database, 
  Server, 
  Code2, 
  GitBranch, 
  Shield, 
  Workflow, 
  Boxes,
  Container,
  Zap
} from 'lucide-react';

const tools = [
  { name: 'Azure', icon: Cloud },
  { name: '.NET', icon: Code2 },
  { name: 'Databases', icon: Database },
  { name: 'APIs & Integration', icon: Workflow },
  { name: 'DevOps', icon: GitBranch },
  { name: 'Security', icon: Shield },
  { name: 'Microservices', icon: Server },
  { name: 'Event-Driven', icon: Zap },
];

export function Toolbox() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
      {tools.map((tool) => (
        <div 
          key={tool.name}
          className="paper-card p-4 flex flex-col items-center gap-2 text-center transition-colors hover:border-primary/30"
        >
          <tool.icon className="h-6 w-6 text-primary" />
          <span className="text-sm font-medium text-foreground">{tool.name}</span>
        </div>
      ))}
    </div>
  );
}
