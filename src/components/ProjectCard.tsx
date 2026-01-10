import { Link } from 'react-router-dom';
import { ArrowRight, Presentation, FolderOpen } from 'lucide-react';
import type { Project } from '@/data/projects';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link 
      to={`/projects/${project.slug}`}
      className="group block paper-card p-6 transition-all duration-300 hover:-translate-y-1"
    >
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
          project.type === 'talk' ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary'
        }`}>
          {project.type === 'talk' ? (
            <Presentation className="h-5 w-5" />
          ) : (
            <FolderOpen className="h-5 w-5" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="tag-pill text-xs">
              {project.type === 'talk' ? 'Talk' : 'Project'}
            </span>
          </div>
          
          <h3 className="font-heading text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
            {project.title}
          </h3>
          
          <p className="text-muted-foreground text-sm leading-relaxed mb-3 line-clamp-2">
            {project.summary}
          </p>
          
          <div className="flex flex-wrap gap-1.5 mb-3">
            {project.technologies.slice(0, 4).map((tech) => (
              <span 
                key={tech} 
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground">
                +{project.technologies.length - 4}
              </span>
            )}
          </div>
          
          <span className="inline-flex items-center text-sm font-medium text-primary group-hover:gap-2 gap-1 transition-all">
            View details
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
