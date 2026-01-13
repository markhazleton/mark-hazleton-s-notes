import { Layout } from '@/components/Layout';
import { ProjectCard } from '@/components/ProjectCard';
import { projects } from '@/lib/data/projects';
import { Seo } from '@/components/Seo';

export default function Projects() {
  return (
    <Layout>
      <Seo
        title="Software Projects & Architecture Portfolio | Mark Hazleton"
        description="Explore Mark Hazleton's software architecture projects: .NET applications, Azure cloud solutions, developer tools, and open-source contributions."
        keywords="software architecture projects, .NET applications, Azure solutions, developer tools, cloud architecture portfolio, open source projects, Mark Hazleton projects"
        canonical="/projects"
      />
      <section className="section">
        <div className="container-wide">
          {/* Header */}
          <div className="max-w-2xl mb-12 animate-fade-up">
            <h1 className="font-heading text-4xl font-bold text-foreground mb-4">
              Software Architecture Portfolio
            </h1>
            <p className="text-lg text-muted-foreground">
              Selected work across <strong>web applications</strong>, <strong>cloud solutions</strong>, 
              <strong> developer tooling</strong>, and <strong>open-source contributions</strong>. 
              Demonstrating practical architecture and engineering patterns.
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
