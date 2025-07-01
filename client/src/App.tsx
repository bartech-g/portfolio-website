
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { trpc } from '@/utils/trpc';
import { useState, useEffect, useCallback } from 'react';
import type { 
  Project, 
  Skill, 
  AboutMe, 
  CreateContactSubmissionInput
} from '../../server/src/schema';

function App() {
  // State for data
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [aboutMe, setAboutMe] = useState<AboutMe | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string>('');

  // Contact form state
  const [contactForm, setContactForm] = useState<CreateContactSubmissionInput>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  // Load data functions
  const loadProjects = useCallback(async () => {
    try {
      const result = await trpc.getProjects.query();
      setProjects(result);
    } catch (error) {
      console.error('Failed to load projects:', error);
    }
  }, []);

  const loadSkills = useCallback(async () => {
    try {
      const result = await trpc.getSkills.query();
      setSkills(result);
    } catch (error) {
      console.error('Failed to load skills:', error);
    }
  }, []);

  const loadAboutMe = useCallback(async () => {
    try {
      const result = await trpc.getAboutMe.query();
      setAboutMe(result);
    } catch (error) {
      console.error('Failed to load about me:', error);
    }
  }, []);

  // Load all data on mount
  useEffect(() => {
    loadProjects();
    loadSkills();
    loadAboutMe();
  }, [loadProjects, loadSkills, loadAboutMe]);

  // Handle contact form submission
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');
    
    try {
      await trpc.createContactSubmission.mutate(contactForm);
      setContactForm({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setSubmitMessage('✨ Thank you! Your message has been sent successfully.');
    } catch (error) {
      console.error('Failed to submit contact form:', error);
      setSubmitMessage('❌ Sorry, there was an error sending your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Default skills for modern full-stack engineer (since API returns empty array initially)
  // Using proper Skill type structure to match schema
  const defaultSkills: Skill[] = [
    { id: 1, name: 'TypeScript', category: 'frontend', proficiency_level: 'advanced', years_experience: 4, is_featured: true, created_at: new Date() },
    { id: 2, name: 'React', category: 'frontend', proficiency_level: 'expert', years_experience: 5, is_featured: true, created_at: new Date() },
    { id: 3, name: 'Next.js', category: 'frontend', proficiency_level: 'advanced', years_experience: 3, is_featured: true, created_at: new Date() },
    { id: 4, name: 'Node.js', category: 'backend', proficiency_level: 'expert', years_experience: 5, is_featured: true, created_at: new Date() },
    { id: 5, name: 'Express.js', category: 'backend', proficiency_level: 'advanced', years_experience: 4, is_featured: true, created_at: new Date() },
    { id: 6, name: 'Python', category: 'backend', proficiency_level: 'advanced', years_experience: 4, is_featured: true, created_at: new Date() },
    { id: 7, name: 'Django', category: 'backend', proficiency_level: 'intermediate', years_experience: 2, is_featured: false, created_at: new Date() },
    { id: 8, name: 'Flask', category: 'backend', proficiency_level: 'intermediate', years_experience: 2, is_featured: false, created_at: new Date() },
    { id: 9, name: 'PostgreSQL', category: 'database', proficiency_level: 'advanced', years_experience: 4, is_featured: true, created_at: new Date() },
    { id: 10, name: 'MongoDB', category: 'database', proficiency_level: 'intermediate', years_experience: 3, is_featured: false, created_at: new Date() },
    { id: 11, name: 'Docker', category: 'devops', proficiency_level: 'advanced', years_experience: 3, is_featured: true, created_at: new Date() },
    { id: 12, name: 'Kubernetes', category: 'devops', proficiency_level: 'intermediate', years_experience: 2, is_featured: false, created_at: new Date() },
    { id: 13, name: 'AWS', category: 'devops', proficiency_level: 'advanced', years_experience: 3, is_featured: true, created_at: new Date() },
    { id: 14, name: 'GCP', category: 'devops', proficiency_level: 'intermediate', years_experience: 2, is_featured: false, created_at: new Date() },
    { id: 15, name: 'Azure', category: 'devops', proficiency_level: 'intermediate', years_experience: 1, is_featured: false, created_at: new Date() },
    { id: 16, name: 'Git', category: 'tools', proficiency_level: 'expert', years_experience: 6, is_featured: true, created_at: new Date() },
    { id: 17, name: 'GraphQL', category: 'backend', proficiency_level: 'advanced', years_experience: 3, is_featured: true, created_at: new Date() },
    { id: 18, name: 'RESTful APIs', category: 'backend', proficiency_level: 'expert', years_experience: 5, is_featured: true, created_at: new Date() },
    { id: 19, name: 'TDD/BDD', category: 'tools', proficiency_level: 'advanced', years_experience: 4, is_featured: true, created_at: new Date() }
  ];

  const displaySkills = skills.length > 0 ? skills : defaultSkills;

  const getProficiencyColor = (proficiency: string) => {
    switch (proficiency) {
      case 'expert': return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      case 'advanced': return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
      case 'intermediate': return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
      default: return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'frontend': return '🎨';
      case 'backend': return '⚙️';
      case 'database': return '🗄️';
      case 'devops': return '🚀';
      case 'tools': return '🛠️';
      default: return '💡';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header/Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <nav className="flex justify-between items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              🚀 Full-Stack Engineer
            </h1>
            <div className="flex space-x-6">
              <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">About</a>
              <a href="#projects" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Projects</a>
              <a href="#skills" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Skills</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Contact</a>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-6xl">
              👨‍💻
            </div>
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Building Amazing Digital Experiences
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Passionate full-stack engineer crafting modern web applications with cutting-edge technologies and clean, scalable code.
            </p>
          </div>
        </div>
      </section>

      {/* About Me Section */}
      <section id="about" className="py-16 px-6">
        <div className="container mx-auto">
          <Card className="max-w-4xl mx-auto shadow-lg border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ✨ About Me
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg mx-auto">
              {aboutMe ? (
                <div>
                  <h3 className="text-xl font-semibold mb-4">{aboutMe.title}</h3>
                  <p className="text-gray-700 leading-relaxed">{aboutMe.content}</p>
                  <p className="text-sm text-gray-500 mt-4">
                    Last updated: {aboutMe.updated_at.toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">
                    🎯 I'm a passionate full-stack engineer with expertise in modern web technologies. 
                    I love creating scalable applications that solve real-world problems and deliver exceptional user experiences.
                  </p>
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">
                    💡 With a strong foundation in both frontend and backend development, 
                    I enjoy working across the entire technology stack to bring ideas to life.
                  </p>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    🌟 When I'm not coding, you can find me exploring new technologies, 
                    contributing to open source projects, or sharing knowledge with the developer community.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-16 px-6 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              🚀 Featured Projects
            </h2>
            <p className="text-gray-600 text-lg">
              Check out some of my recent work and open source contributions
            </p>
          </div>

          {projects.length === 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {/* Placeholder project cards */}
              {[1, 2, 3].map((i) => (
                <Card key={i} className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:scale-105">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">🔧</span>
                      Project Coming Soon #{i}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Exciting project in development! This will showcase modern full-stack architecture and best practices.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">React</Badge>
                      <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">Node.js</Badge>
                      <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">TypeScript</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" disabled>
                        🔗 Demo (Coming Soon)
                      </Button>
                      <Button variant="outline" size="sm" disabled>
                        📂 GitHub (Coming Soon)
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {projects.map((project: Project) => (
                <Card key={project.id} className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:scale-105">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">🚀</span>
                      {project.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech, index) => (
                        <Badge key={index} className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      {project.demo_url && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                            🔗 Demo
                          </a>
                        </Button>
                      )}
                      {project.github_url && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                            📂 GitHub
                          </a>
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-3">
                      Created: {project.created_at.toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-16 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              💡 Technical Skills
            </h2>
            <p className="text-gray-600 text-lg">
              Modern full-stack technologies and tools I work with
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid gap-6">
              {['frontend', 'backend', 'database', 'devops', 'tools'].map((category) => {
                const categorySkills = displaySkills.filter((skill: Skill) => skill.category === category);
                if (categorySkills.length === 0) return null;

                return (
                  <Card key={category} className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-xl">
                        <span className="text-3xl">{getCategoryIcon(category)}</span>
                        <span className="capitalize bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          {category} Technologies
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-3">
                        {categorySkills.map((skill: Skill, index) => (
                          <Badge 
                            key={skill.id || index}
                            className={`text-sm py-2 px-4 font-medium transition-all hover:scale-105 ${getProficiencyColor(skill.proficiency_level)}`}
                          >
                            {skill.name}
                            <span className="ml-2 text-xs opacity-80">
                              ({skill.proficiency_level})
                            </span>
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 px-6 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              📬 Get In Touch
            </h2>
            <p className="text-gray-600 text-lg">
              Have a project in mind? Let's work together!
            </p>
          </div>

          <Card className="max-w-2xl mx-auto shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-center text-xl">
                💌 Send me a message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      👤 Name *
                    </label>
                    <Input
                      value={contactForm.name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setContactForm((prev: CreateContactSubmissionInput) => ({ ...prev, name: e.target.value }))
                      }
                      placeholder="Your name"
                      required
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📧 Email *
                    </label>
                    <Input
                      type="email"
                      value={contactForm.email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setContactForm((prev: CreateContactSubmissionInput) => ({ ...prev, email: e.target.value }))
                      }
                      placeholder="your.email@example.com"
                      required
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📝 Subject *
                  </label>
                  <Input
                    value={contactForm.subject}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setContactForm((prev: CreateContactSubmissionInput) => ({ ...prev, subject: e.target.value }))
                    }
                    placeholder="Project collaboration, job opportunity, etc."
                    required
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    💬 Message *
                  </label>
                  <Textarea
                    value={contactForm.message}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setContactForm((prev: CreateContactSubmissionInput) => ({ ...prev, message: e.target.value }))
                    }
                    placeholder="Tell me about your project or how we can work together..."
                    rows={5}
                    required
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 text-lg font-medium transition-all hover:scale-105"
                >
                  {isSubmitting ? '🚀 Sending...' : '✨ Send Message'}
                </Button>

                {submitMessage && (
                  <div className={`text-center p-4 rounded-lg ${
                    submitMessage.includes('✨') 
                      ? 'bg-green-50 text-green-700 border border-green-200' 
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {submitMessage}
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-gray-900 text-white">
        <div className="container mx-auto text-center">
          <p className="text-gray-400">
            Built with ❤️ using React, TypeScript, and modern web technologies
          </p>
          <p className="text-gray-500 text-sm mt-2">
            © 2024 Full-Stack Engineer Portfolio
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
