import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Service from './models/serviceModel.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Sample services data
const sampleServices = [
  {
    title: "Web Development",
    description: "Professional web development services using modern technologies like React, Node.js, and MongoDB",
    shortDescription: "Modern web applications with cutting-edge technology",
    content: "<p>We create stunning, responsive web applications that deliver exceptional user experiences. Our development process includes:</p><ul><li>Custom web application development</li><li>Responsive design implementation</li><li>Database design and optimization</li><li>API development and integration</li><li>Performance optimization</li><li>Security implementation</li></ul><p>Our team uses the latest technologies including React, Vue.js, Node.js, Express, MongoDB, and PostgreSQL to build scalable and maintainable applications.</p>",
    icon: "fa-code",
    image: "/uploads/web-development.jpg",
    category: "Development",
    tags: ["web", "development", "react", "nodejs"],
    status: "active",
    featured: true,
    metaTitle: "Professional Web Development Services",
    metaDescription: "Expert web development services using modern technologies. Custom applications, responsive design, and full-stack solutions.",
    metaKeywords: ["web development", "react", "nodejs", "full stack", "custom applications"]
  },
  {
    title: "Mobile App Development",
    description: "Native and cross-platform mobile applications for iOS and Android",
    shortDescription: "Native and cross-platform mobile apps",
    content: "<p>We develop high-performance mobile applications for both iOS and Android platforms. Our mobile development services include:</p><ul><li>Native iOS app development (Swift)</li><li>Native Android app development (Kotlin/Java)</li><li>Cross-platform development (React Native, Flutter)</li><li>UI/UX design for mobile</li><li>App store optimization</li><li>Push notification implementation</li></ul><p>Whether you need a native app for maximum performance or a cross-platform solution for cost efficiency, we deliver exceptional mobile experiences.</p>",
    icon: "fa-mobile",
    image: "/uploads/mobile-development.jpg",
    category: "Development",
    tags: ["mobile", "ios", "android", "react native"],
    status: "active",
    featured: true,
    metaTitle: "Mobile App Development Services",
    metaDescription: "Professional mobile app development for iOS and Android. Native and cross-platform solutions with modern technologies.",
    metaKeywords: ["mobile development", "ios", "android", "react native", "flutter"]
  },
  {
    title: "AI & Machine Learning",
    description: "Artificial Intelligence and Machine Learning solutions for business automation",
    shortDescription: "AI and ML solutions for business automation",
    content: "<p>Transform your business with our AI and Machine Learning solutions. We help companies leverage artificial intelligence to:</p><ul><li>Automate business processes</li><li>Predict customer behavior</li><li>Optimize operations</li><li>Enhance decision making</li><li>Implement chatbots and virtual assistants</li><li>Data analysis and insights</li></ul><p>Our AI solutions are designed to integrate seamlessly with your existing systems and provide measurable business value.</p>",
    icon: "fa-brain",
    image: "/uploads/ai-ml.jpg",
    category: "AI & Automation",
    tags: ["ai", "machine learning", "automation", "data science"],
    status: "active",
    featured: true,
    metaTitle: "AI & Machine Learning Solutions",
    metaDescription: "Expert AI and Machine Learning services for business automation, predictive analytics, and intelligent solutions.",
    metaKeywords: ["ai", "machine learning", "automation", "data science", "business intelligence"]
  },
  {
    title: "Cloud Solutions",
    description: "Cloud infrastructure setup, migration, and management services",
    shortDescription: "Cloud infrastructure and migration services",
    content: "<p>We provide comprehensive cloud solutions to help your business scale and operate efficiently. Our cloud services include:</p><ul><li>AWS, Azure, and Google Cloud setup</li><li>Cloud migration and optimization</li><li>Serverless architecture implementation</li><li>Container orchestration (Docker, Kubernetes)</li><li>Cloud security and compliance</li><li>Cost optimization strategies</li></ul><p>Our cloud experts ensure your infrastructure is secure, scalable, and cost-effective while maintaining high performance and availability.</p>",
    icon: "fa-cloud",
    image: "/uploads/cloud-solutions.jpg",
    category: "Infrastructure",
    tags: ["cloud", "aws", "azure", "devops"],
    status: "active",
    featured: true,
    metaTitle: "Cloud Solutions & Infrastructure",
    metaDescription: "Professional cloud infrastructure services including AWS, Azure, migration, and optimization solutions.",
    metaKeywords: ["cloud", "aws", "azure", "infrastructure", "migration"]
  },
  {
    title: "UI/UX Design",
    description: "User interface and user experience design for web and mobile applications",
    shortDescription: "Professional UI/UX design services",
    content: "<p>We create intuitive and engaging user experiences that drive user satisfaction and business growth. Our design services include:</p><ul><li>User research and analysis</li><li>Wireframing and prototyping</li><li>Visual design and branding</li><li>Responsive design implementation</li><li>Usability testing and optimization</li><li>Design system creation</li></ul><p>Our design team combines creativity with data-driven insights to create interfaces that not only look great but also deliver exceptional user experiences.</p>",
    icon: "fa-paint-brush",
    image: "/uploads/ui-ux-design.jpg",
    category: "Design",
    tags: ["ui", "ux", "design", "prototyping"],
    status: "active",
    featured: false,
    metaTitle: "UI/UX Design Services",
    metaDescription: "Professional UI/UX design services for web and mobile applications. User-centered design with modern aesthetics.",
    metaKeywords: ["ui design", "ux design", "user experience", "prototyping", "visual design"]
  }
];

// Function to generate slug from title
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
};

// Seed services
const seedServices = async () => {
  try {
    await connectDB();
    
    // Clear existing services
    await Service.deleteMany({});
    console.log('Cleared existing services');
    
    // Add slugs to services
    const servicesWithSlugs = sampleServices.map(service => ({
      ...service,
      slug: generateSlug(service.title)
    }));
    
    // Insert new services
    const createdServices = await Service.insertMany(servicesWithSlugs);
    console.log(`Successfully seeded ${createdServices.length} services`);
    
    // Display created services
    createdServices.forEach(service => {
      console.log(`- ${service.title} (${service.slug})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding services:', error);
    process.exit(1);
  }
};

// Run the seed function
seedServices();