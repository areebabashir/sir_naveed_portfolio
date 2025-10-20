import { motion } from "framer-motion";
import { ExternalLink, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

const Projects = () => {
  const projects = [
    {
      title: "E-Commerce AI Recommendation Engine",
      category: "Retail",
      description: "Developed a sophisticated ML-powered recommendation system that increased conversion rates by 45% for a major retail client.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
      date: "January 2024",
      tags: ["Machine Learning", "Python", "TensorFlow"],
    },
    {
      title: "Healthcare Diagnostic Assistant",
      category: "Healthcare",
      description: "AI-powered diagnostic tool helping medical professionals with faster and more accurate patient assessments.",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
      date: "December 2023",
      tags: ["Computer Vision", "Deep Learning", "Medical AI"],
    },
    {
      title: "Financial Fraud Detection System",
      category: "Finance",
      description: "Real-time fraud detection system processing millions of transactions daily with 99.7% accuracy.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
      date: "November 2023",
      tags: ["Anomaly Detection", "Big Data", "Real-time Processing"],
    },
    {
      title: "Smart Manufacturing Analytics",
      category: "Manufacturing",
      description: "Predictive maintenance system reducing downtime by 60% through IoT sensor data analysis.",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",
      date: "October 2023",
      tags: ["IoT", "Predictive Analytics", "Industry 4.0"],
    },
    {
      title: "Customer Service Chatbot Platform",
      category: "Customer Service",
      description: "NLP-powered chatbot handling 10,000+ daily conversations with 95% customer satisfaction.",
      image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&q=80",
      date: "September 2023",
      tags: ["NLP", "Conversational AI", "Chatbots"],
    },
    {
      title: "Supply Chain Optimization",
      category: "Logistics",
      description: "AI-driven logistics optimization reducing costs by 30% and improving delivery times.",
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",
      date: "August 2023",
      tags: ["Optimization", "Forecasting", "Logistics"],
    },
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-20 lg:py-32 gradient-hero">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-background mb-6">
              Our Project Portfolio
            </h1>
            <p className="text-lg lg:text-xl text-background/90">
              Explore real-world AI solutions we've delivered across diverse industries
            </p>
          </motion.div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-xl overflow-hidden shadow-card hover:shadow-elegant transition-smooth group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
                  />
                  <div className="absolute top-4 right-4 bg-accent text-white px-3 py-1 rounded-full text-sm font-medium">
                    {project.category}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center text-sm text-muted-foreground mb-3">
                    <Calendar className="h-4 w-4 mr-2" />
                    {project.date}
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-accent transition-colors">
                    {project.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="text-xs bg-muted px-3 py-1 rounded-full text-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <Button variant="ghost" className="text-accent hover:text-accent/80 p-0">
                    View Case Study
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Start Your AI Journey Today
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Let's discuss how we can create similar success for your organization
            </p>
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-white font-medium">
              Get in Touch
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Projects;
