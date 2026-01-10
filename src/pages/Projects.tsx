import { Layout } from '@/components/Layout';
import { ProjectCard } from '@/components/ProjectCard';
import { projects } from '@/data/projects';

export default function Projects() {
  return (
    <Layout>
      <section className="section">
        <div className="container-wide">
          {/* Header */}
          <div className="max-w-2xl mb-12 animate-fade-up">
            <h1 className="font-heading text-4xl font-bold text-foreground mb-4">
              Projects
            </h1>
            <p className="text-lg text-muted-foreground">
              Selected work across web applications, tooling, and product experiments.
            </p>
          </div>

          {/* Projects */}
          <div className="grid gap-6 md:grid-cols-2 stagger-children">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
