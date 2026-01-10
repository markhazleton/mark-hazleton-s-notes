import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Calendar, Send, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setIsSubmitted(true);
    toast({
      title: 'Message sent!',
      description: 'Thanks for reaching out. I\'ll get back to you soon.',
    });
  };

  return (
    <Layout>
      <section className="section">
        <div className="container-blog">
          <div className="animate-fade-up">
            <h1 className="font-heading text-4xl font-bold text-foreground mb-4">
              Get in Touch
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Have a question, want to collaborate, or just want to say hello? 
              I'd love to hear from you.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
            {/* Form */}
            <div className="paper-card p-6 lg:p-8">
              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="font-heading text-2xl font-semibold text-foreground mb-2">
                    Message Sent!
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Thanks for reaching out. I typically respond within 1-2 business days.
                  </p>
                  <Button variant="outline" onClick={() => setIsSubmitted(false)}>
                    Send another message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Your name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="What's this about?"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Your message..."
                      rows={6}
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      'Sending...'
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="paper-card p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-heading font-semibold text-foreground">
                    Email
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  For general inquiries or quick questions.
                </p>
                <a 
                  href="mailto:hello@markhazleton.com"
                  className="text-sm text-primary hover:underline underline-offset-2"
                >
                  hello@markhazleton.com
                </a>
              </div>

              <div className="paper-card p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-accent" />
                  </div>
                  <h3 className="font-heading font-semibold text-foreground">
                    Schedule a Call
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Want to discuss a project or architecture review?
                </p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    Book a 30-min chat
                  </a>
                </Button>
              </div>

              <div className="p-6 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Response time:</strong>{' '}
                  I typically respond within 1-2 business days. For urgent matters, 
                  scheduling a call is usually faster.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
