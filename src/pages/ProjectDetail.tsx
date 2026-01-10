import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Presentation, FolderOpen } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { projects } from '@/data/projects';

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return <Navigate to="/projects" replace />;
  }

  return (
    <Layout>
      <section className="section">
        <div className="container-blog">
          {/* Back Link */}
          <Link
            to="/projects"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to projects
          </Link>

          {/* Header */}
          <header className="mb-12 animate-fade-up">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                project.type === 'talk' ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary'
              }`}>
                {project.type === 'talk' ? (
                  <Presentation className="h-6 w-6" />
                ) : (
                  <FolderOpen className="h-6 w-6" />
                )}
              </div>
              <span className="tag-pill">
                {project.type === 'talk' ? 'Talk' : 'Project'}
              </span>
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {project.title}
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed">
              {project.summary}
            </p>

            {/* Technologies */}
            <div className="flex flex-wrap gap-2 mt-6">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-secondary text-secondary-foreground"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Links */}
            {project.links && project.links.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-6">
                {project.links.map((link) => (
                  <Button key={link.label} variant="outline" asChild>
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      {link.label}
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                ))}
              </div>
            )}
          </header>

          {/* Content */}
          <div className="space-y-12">
            <div className="paper-card p-6">
              <h2 className="font-heading text-xl font-semibold text-foreground mb-3">
                The Problem
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {project.problem}
              </p>
            </div>

            <div className="paper-card p-6">
              <h2 className="font-heading text-xl font-semibold text-foreground mb-3">
                The Approach
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {project.approach}
              </p>
            </div>

            <div className="paper-card p-6 border-l-4 border-primary">
              <h2 className="font-heading text-xl font-semibold text-foreground mb-3">
                The Outcome
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {project.outcome}
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
