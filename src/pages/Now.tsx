import { Layout } from '@/components/Layout';
import { Callout } from '@/components/Callout';
import { BookOpen, Code, Users, MapPin } from 'lucide-react';

export default function Now() {
  return (
    <Layout>
      <section className="section">
        <div className="container-blog">
          <div className="animate-fade-up">
            <h1 className="font-heading text-4xl font-bold text-foreground mb-4">
              What I'm Doing Now
            </h1>
            <p className="text-muted-foreground mb-2">
              Last updated: January 2024
            </p>
            <p className="text-lg text-muted-foreground mb-8">
              A snapshot of what I'm focused on right now. Inspired by{' '}
              <a 
                href="https://nownownow.com/about" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline underline-offset-2"
              >
                the /now page movement
              </a>.
            </p>
          </div>

          <div className="space-y-12">
            {/* Currently Working On */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Code className="h-5 w-5 text-primary" />
                </div>
                <h2 className="font-heading text-2xl font-semibold text-foreground">
                  Currently Working On
                </h2>
              </div>
              <div className="prose-blog">
                <ul>
                  <li>
                    <strong>Event-driven reference architecture</strong> — Building a comprehensive 
                    reference implementation for event-driven microservices on Azure. The goal is 
                    to demonstrate patterns like event sourcing, CQRS, and saga orchestration in a 
                    realistic, production-ready context.
                  </li>
                  <li>
                    <strong>Observability deep-dive</strong> — Exploring OpenTelemetry instrumentation 
                    patterns and building a workshop around practical observability for distributed 
                    systems. Focusing on the "so what" of metrics and traces.
                  </li>
                  <li>
                    <strong>Architecture decision records</strong> — Writing more publicly about 
                    architectural decisions and tradeoffs. Trying to make the implicit explicit.
                  </li>
                </ul>
              </div>
            </div>

            {/* Learning */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-accent" />
                </div>
                <h2 className="font-heading text-2xl font-semibold text-foreground">
                  Learning
                </h2>
              </div>
              <div className="prose-blog">
                <ul>
                  <li>
                    <strong>Platform engineering</strong> — How to build internal developer 
                    platforms that actually get adopted. The organizational patterns matter as 
                    much as the technical ones.
                  </li>
                  <li>
                    <strong>AI/ML integration patterns</strong> — Understanding how to 
                    responsibly integrate AI capabilities into enterprise applications. 
                    Currently focused on RAG patterns and vector databases.
                  </li>
                  <li>
                    <strong>Rust</strong> — Taking my time with this one. The ownership model 
                    is fascinating and I'm curious about its applications in cloud-native tooling.
                  </li>
                </ul>
              </div>
            </div>

            {/* Reading */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                </div>
                <h2 className="font-heading text-2xl font-semibold text-foreground">
                  Reading
                </h2>
              </div>
              <div className="prose-blog">
                <ul>
                  <li>
                    <em>Team Topologies</em> by Matthew Skelton & Manuel Pais — Rereading 
                    this with fresh eyes after some platform team experiences.
                  </li>
                  <li>
                    <em>Designing Data-Intensive Applications</em> by Martin Kleppmann — 
                    The gift that keeps on giving. Always finding new insights.
                  </li>
                  <li>
                    <em>The Staff Engineer's Path</em> by Tanya Reilly — Excellent framework 
                    for thinking about technical leadership.
                  </li>
                </ul>
              </div>
            </div>

            {/* Speaking */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <h2 className="font-heading text-2xl font-semibold text-foreground">
                  Speaking & Community
                </h2>
              </div>
              <div className="prose-blog">
                <ul>
                  <li>
                    Preparing an updated version of my resilience patterns talk for 
                    spring conferences.
                  </li>
                  <li>
                    Running a monthly architecture office hours for a local tech community.
                  </li>
                  <li>
                    Open to podcast appearances and guest posts — reach out if interested.
                  </li>
                </ul>
              </div>
            </div>

            {/* Location */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-accent" />
                </div>
                <h2 className="font-heading text-2xl font-semibold text-foreground">
                  Location
                </h2>
              </div>
              <p className="text-muted-foreground">
                Based in the Dallas-Fort Worth area, working remotely. Occasionally 
                traveling for conferences and client work.
              </p>
            </div>

            <Callout type="info" title="Want to connect?">
              If any of these topics resonate with you, I'd love to chat. The best way 
              to reach me is through the{' '}
              <a href="/contact" className="text-primary hover:underline">contact page</a>.
            </Callout>
          </div>
        </div>
      </section>
    </Layout>
  );
}
