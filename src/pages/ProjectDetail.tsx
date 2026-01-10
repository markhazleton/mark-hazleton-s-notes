import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, FolderOpen } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { projects } from '@/data/projects';

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const project = projects.find((p) => p.slug === slug);
  const links = [
    project?.url && { label: 'Visit Site', url: project.url },
    project?.repository?.url && { label: 'Repository', url: project.repository.url },
  ].filter(Boolean) as { label: string; url: string }[];

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
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-primary/10 text-primary">
                <FolderOpen className="h-6 w-6" />
              </div>
              <span className="tag-pill">
                Project
              </span>
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {project.title}
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed">
              {project.summary}
            </p>

            {/* Keywords */}
            {project.keywords.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {project.keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-secondary text-secondary-foreground"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            )}

            {/* Links */}
            {links.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-6">
                {links.map((link) => (
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
                Overview
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {project.summary}
              </p>
            </div>

            <div className="paper-card p-6">
              <h2 className="font-heading text-xl font-semibold text-foreground mb-3">
                Details
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {project.description}
              </p>
            </div>

            {project.repository && (
              <div className="paper-card p-6">
                <h2 className="font-heading text-xl font-semibold text-foreground mb-3">
                  Repository
                </h2>
                <dl className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex flex-wrap gap-2">
                    <dt className="font-medium text-foreground">Provider</dt>
                    <dd>{project.repository.provider}</dd>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <dt className="font-medium text-foreground">Name</dt>
                    <dd>{project.repository.name}</dd>
                  </div>
                  {project.repository.branch && (
                    <div className="flex flex-wrap gap-2">
                      <dt className="font-medium text-foreground">Branch</dt>
                      <dd>{project.repository.branch}</dd>
                    </div>
                  )}
                  {project.repository.visibility && (
                    <div className="flex flex-wrap gap-2">
                      <dt className="font-medium text-foreground">Visibility</dt>
                      <dd>{project.repository.visibility}</dd>
                    </div>
                  )}
                  {project.repository.notes && (
                    <div className="flex flex-wrap gap-2">
                      <dt className="font-medium text-foreground">Notes</dt>
                      <dd>{project.repository.notes}</dd>
                    </div>
                  )}
                </dl>
              </div>
            )}

            {project.promotion && (
              <div className="paper-card p-6 border-l-4 border-primary">
                <h2 className="font-heading text-xl font-semibold text-foreground mb-3">
                  Delivery Pipeline
                </h2>
                <dl className="space-y-2 text-sm text-muted-foreground">
                  {project.promotion.pipeline && (
                    <div className="flex flex-wrap gap-2">
                      <dt className="font-medium text-foreground">Pipeline</dt>
                      <dd>{project.promotion.pipeline}</dd>
                    </div>
                  )}
                  {project.promotion.currentStage && (
                    <div className="flex flex-wrap gap-2">
                      <dt className="font-medium text-foreground">Stage</dt>
                      <dd>{project.promotion.currentStage}</dd>
                    </div>
                  )}
                  {project.promotion.status && (
                    <div className="flex flex-wrap gap-2">
                      <dt className="font-medium text-foreground">Status</dt>
                      <dd>{project.promotion.status}</dd>
                    </div>
                  )}
                  {project.promotion.lastPromotedOn && (
                    <div className="flex flex-wrap gap-2">
                      <dt className="font-medium text-foreground">Last Promoted</dt>
                      <dd>{project.promotion.lastPromotedOn}</dd>
                    </div>
                  )}
                  {project.promotion.notes && (
                    <div className="flex flex-wrap gap-2">
                      <dt className="font-medium text-foreground">Notes</dt>
                      <dd>{project.promotion.notes}</dd>
                    </div>
                  )}
                  {project.promotion.environments && project.promotion.environments.length > 0 && (
                    <div className="space-y-2">
                      <div className="font-medium text-foreground">Environments</div>
                      <ul className="space-y-2">
                        {project.promotion.environments.map((env) => (
                          <li key={env.name} className="flex flex-col gap-1">
                            <span className="font-medium text-foreground">{env.name}</span>
                            <span>{env.url}</span>
                            {env.status && <span>Status: {env.status}</span>}
                            {env.version && <span>Version: {env.version}</span>}
                            {env.lastPromotedOn && <span>Last Promoted: {env.lastPromotedOn}</span>}
                            {env.notes && <span>{env.notes}</span>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </dl>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
 
