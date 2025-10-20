import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Star, 
  DollarSign, 
  Calendar, 
  Eye, 
  Users, 
  CheckCircle, 
  ArrowLeft,
  Share2,
  Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import '@/styles/service-content.css';

interface Service {
  _id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  content: string;
  icon: string;
  image: string;
  category: string;
  tags: string[];
  status: 'active' | 'inactive' | 'draft';
  featured: boolean;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  createdAt: string;
  updatedAt: string;
}

const ServiceDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isInquiring, setIsInquiring] = useState(false);

  // Fetch service details
  const fetchService = async () => {
    if (!slug) return;

    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8000/api/services/${slug}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Service not found');
        }
        throw new Error('Failed to fetch service');
      }

      const data = await response.json();
      setService(data.service);
    } catch (error) {
      console.error('Error fetching service:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch service');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchService();
  }, [slug]);

  // Handle inquiry
  const handleInquiry = async () => {
    if (!service) return;

    try {
      setIsInquiring(true);
      const response = await fetch(`http://localhost:8000/api/services/${service.slug}/inquiry`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to record inquiry');
      }

      // Show success message or redirect to contact form
      alert('Thank you for your interest! We will contact you soon.');
    } catch (error) {
      console.error('Error recording inquiry:', error);
      alert('Failed to record inquiry. Please try again.');
    } finally {
      setIsInquiring(false);
    }
  };

  // Handle share
  const handleShare = async () => {
    if (navigator.share && service) {
      try {
        await navigator.share({
          title: service.title,
          text: service.shortDescription,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Service Not Found</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
        {/* Breadcrumb */}
        <div className="bg-muted/30 py-4">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center space-x-2 text-sm">
              <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <span className="text-muted-foreground">/</span>
              <span>Services</span>
              <span className="text-muted-foreground">/</span>
              <span className="font-medium">{service.title}</span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-4xl">{service.icon}</span>
                  {service.featured && (
                    <Star className="h-6 w-6 text-yellow-500 fill-current" />
                  )}
                </div>
                
                <h1 className="text-4xl font-bold mb-4">{service.title}</h1>
                
                <div className="flex items-center gap-4 mb-6">
                  <Badge variant="outline" className="text-lg px-3 py-1">
                    {service.category}
                  </Badge>
                </div>

                <p className="text-xl text-muted-foreground mb-6">
                  {service.description}
                </p>
              </motion.div>

              {/* Service Image */}
              {service.image && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="aspect-video overflow-hidden rounded-lg"
                >
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              )}

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="prose prose-lg max-w-none"
              >
                <div 
                  dangerouslySetInnerHTML={{ __html: service.content }}
                  className="service-content"
                />
              </motion.div>

              {/* Tags */}
              {service.tags && service.tags.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <h3 className="text-lg font-semibold mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {service.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Action Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="sticky top-6">
                  <CardHeader>
                    <CardTitle>Get Started</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <Button 
                        className="w-full" 
                        size="lg"
                        onClick={handleInquiry}
                        disabled={isInquiring}
                      >
                        {isInquiring ? 'Processing...' : 'Contact Us'}
                      </Button>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={handleShare}
                        >
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <Heart className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>


              {/* Author Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
              </motion.div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default ServiceDetail;
