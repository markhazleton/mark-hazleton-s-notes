import { Layout } from '@/components/Layout';
import { Linkedin, Github, ArrowUpRight, Coffee } from 'lucide-react';
import { Seo } from '@/components/Seo';

export default function Contact() {
  return (
    <Layout>
      <Seo
        title="Contact Mark Hazleton"
        description="Get in touch with Mark Hazleton to collaborate on cloud architecture, integration patterns, and distributed systems."
        keywords="contact Mark Hazleton, cloud architecture consulting, distributed systems, integration patterns, technical solutions architect"
        canonical="/contact"
      />
      <section className="section">
        <div className="container-blog">
          <div className="max-w-xl mx-auto text-center animate-fade-up">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Coffee className="h-8 w-8 text-primary" />
            </div>
            
            <h1 className="font-heading text-4xl font-bold text-foreground mb-4">
              Let's Collaborate
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Got an interesting problem to solve? Want to chat about architecture, 
              cloud patterns, or just geek out about distributed systems? 
              I'm always up for a good conversation.
            </p>

            <p className="text-xl text-foreground font-heading font-medium mb-10">
              Let's build something great together.
            </p>

            {/* Social Links */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://linkedin.com/in/markhazleton"
                target="_blank"
                rel="noopener noreferrer"
                className="group paper-card p-6 flex items-center gap-4 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30"
              >
                <div className="w-12 h-12 rounded-lg bg-[#0A66C2]/10 flex items-center justify-center">
                  <Linkedin className="h-6 w-6 text-[#0A66C2]" />
                </div>
                <div className="text-left">
                  <p className="font-heading font-semibold text-foreground group-hover:text-primary transition-colors">
                    LinkedIn
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Connect professionally
                  </p>
                </div>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors ml-auto" />
              </a>

              <a
                href="https://github.com/markhazleton"
                target="_blank"
                rel="noopener noreferrer"
                className="group paper-card p-6 flex items-center gap-4 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30"
              >
                <div className="w-12 h-12 rounded-lg bg-foreground/10 flex items-center justify-center">
                  <Github className="h-6 w-6 text-foreground" />
                </div>
                <div className="text-left">
                  <p className="font-heading font-semibold text-foreground group-hover:text-primary transition-colors">
                    GitHub
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Check out my code
                  </p>
                </div>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors ml-auto" />
              </a>
            </div>

            {/* Additional context */}
            <p className="mt-12 text-sm text-muted-foreground">
              Whether it's a quick question or a longer collaboration, 
              I typically respond within a day or two.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
