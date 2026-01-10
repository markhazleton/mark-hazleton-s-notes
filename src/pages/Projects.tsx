import { Layout } from '@/components/Layout';
import { ProjectCard } from '@/components/ProjectCard';
import { projects, projectsOnly, talksOnly } from '@/data/projects';

export default function Projects() {
  return (
    <Layout>
      <section className="section">
        <div className="container-wide">
          {/* Header */}
          <div className="max-w-2xl mb-12 animate-fade-up">
            <h1 className="font-heading text-4xl font-bold text-foreground mb-4">
              Projects & Talks
            </h1>
            <p className="text-lg text-muted-foreground">
              Selected work and conference presentations. Each represents a 
              challenging problem, thoughtful approach, and measurable outcome.
            </p>
          </div>

          {/* Projects */}
          <div className="mb-16">
            <h2 className="font-heading text-2xl font-semibold text-foreground mb-6">
              Projects
            </h2>
            <div className="grid gap-6 md:grid-cols-2 stagger-children">
              {projectsOnly.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          </div>

          {/* Talks */}
          <div>
            <h2 className="font-heading text-2xl font-semibold text-foreground mb-6">
              Talks & Workshops
            </h2>
            <div className="grid gap-6 md:grid-cols-2 stagger-children">
              {talksOnly.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
