import { Layout } from '@/components/Layout';
import { Toolbox } from '@/components/Toolbox';
import { CheckCircle2 } from 'lucide-react';

const howIWork = [
  {
    title: 'Start with discovery',
    description: 'Understanding the problem deeply before proposing solutions. The best architecture comes from understanding the business context.',
  },
  {
    title: 'Embrace constraints',
    description: 'Constraints aren\'t obstacles—they\'re design inputs. Budget, timeline, team skills, and existing systems all shape the right solution.',
  },
  {
    title: 'Make tradeoffs explicit',
    description: 'Every architectural decision involves tradeoffs. I document them clearly so teams can make informed choices.',
  },
  {
    title: 'Document for the future',
    description: 'Architecture decisions should be understandable by someone joining the team in two years. I write ADRs and keep documentation current.',
  },
  {
    title: 'Ship incrementally',
    description: 'Big-bang releases are risky. I prefer incremental delivery that provides value early and often while reducing risk.',
  },
];

export default function About() {
  return (
    <Layout>
      <section className="section">
        <div className="container-blog">
          {/* Intro */}
          <div className="animate-fade-up">
            <h1 className="font-heading text-4xl font-bold text-foreground mb-6">
              About Me
            </h1>
            
            <div className="prose-blog text-lg">
              <p className="text-xl text-muted-foreground leading-relaxed mb-6">
                I'm Mark Hazleton, a Technical Solutions Architect with a passion for 
                building systems that are resilient, maintainable, and actually solve 
                real problems.
              </p>

              <p>
                For the past 15+ years, I've been helping teams design and build distributed 
                systems across healthcare, retail, and financial services. I've seen patterns 
                that work and patterns that fail spectacularly. I write about both.
              </p>

              <p>
                My approach is pragmatic rather than dogmatic. The "right" architecture depends 
                on your constraints, your team, and your business context. I'm more interested 
                in solving problems than following frameworks for their own sake.
              </p>

              <p>
                When I'm not architecting systems, I'm probably reading about distributed systems 
                theory, experimenting with new cloud services, or trying to explain to my family 
                what exactly I do for a living.
              </p>
            </div>
          </div>

          {/* How I Work */}
          <div className="mt-16">
            <h2 className="font-heading text-2xl font-semibold text-foreground mb-6">
              How I work
            </h2>
            <div className="space-y-4">
              {howIWork.map((item, index) => (
                <div 
                  key={index}
                  className="flex gap-4 p-4 paper-card"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-heading font-semibold text-foreground mb-1">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Toolbox */}
          <div className="mt-16">
            <h2 className="font-heading text-2xl font-semibold text-foreground mb-6">
              My toolbox
            </h2>
            <p className="text-muted-foreground mb-6">
              Technologies and practices I work with regularly. The right tool depends on the problem.
            </p>
            <Toolbox />
          </div>

          {/* Background */}
          <div className="mt-16">
            <h2 className="font-heading text-2xl font-semibold text-foreground mb-6">
              Background
            </h2>
            <div className="prose-blog">
              <p>
                I started my career as a developer, building line-of-business applications 
                in .NET. Over time, I became increasingly interested in how systems fit 
                together—the integration patterns, the failure modes, the operational 
                characteristics that determine whether a system thrives or struggles in production.
              </p>
              <p>
                That curiosity led me into architecture roles, where I could think about 
                systems holistically. I've led architecture practices, built platform teams, 
                and consulted for organizations ranging from startups to enterprises.
              </p>
              <p>
                These days, I focus on cloud-native architectures, particularly on Azure. 
                I'm especially interested in event-driven systems, observability, and the 
                organizational patterns that enable teams to build and operate complex systems 
                sustainably.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
