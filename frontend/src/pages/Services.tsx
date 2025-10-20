import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Star, 
  DollarSign, 
  Calendar, 
  Eye, 
  Users,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface Service {
  _id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  icon: string;
  image: string;
  category: string;
  tags: string[];
  status: 'active' | 'inactive' | 'draft';
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

const Services: React.FC = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [featuredServices, setFeaturedServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('order');
  const [error, setError] = useState('');

  // Fetch services
  const fetchServices = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        status: 'active',
        featured: 'false',
        sortBy,
        sortOrder: 'asc'
      });

      if (categoryFilter !== 'all') {
        params.append('category', categoryFilter);
      }

      const response = await fetch(`http://localhost:8000/api/services?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }

      const data = await response.json();
      setServices(data.services);
    } catch (error) {
      console.error('Error fetching services:', error);
      setError('Failed to fetch services');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch featured services
  const fetchFeaturedServices = async () => {
    try {
      const params = new URLSearchParams({
        status: 'active',
        featured: 'true',
        sortBy: 'order',
        sortOrder: 'asc'
      });

      const response = await fetch(`http://localhost:8000/api/services?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch featured services');
      }

      const data = await response.json();
      setFeaturedServices(data.services);
    } catch (error) {
      console.error('Error fetching featured services:', error);
    }
  };

  useEffect(() => {
    fetchServices();
    fetchFeaturedServices();
  }, [categoryFilter, sortBy]);

  // Filter services based on search term and price
  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesPrice = true; // Price filtering removed
    
    return matchesSearch && matchesPrice;
  });

  const handleInquiry = async (serviceSlug: string) => {
    try {
      await fetch(`http://localhost:8000/api/services/${serviceSlug}/inquiry`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Error recording inquiry:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 lg:py-32 gradient-hero">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-background mb-6">
                Professional Services
            </h1>
              <p className="text-lg lg:text-xl text-background/90 mb-8">
                Transform your business with our comprehensive range of digital services
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="text-lg px-8">
                  View All Services
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 border-background text-background hover:bg-background hover:text-primary">
                  Get Started
                </Button>
              </div>
          </motion.div>
        </div>
      </section>

        {/* Featured Services */}
        {featuredServices.length > 0 && (
      <section className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Featured Services
                </h2>
                <p className="text-xl text-muted-foreground">
                  Our most popular and highly-rated services
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredServices.map((service, index) => (
          <motion.div
                    key={service._id}
            initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      {service.image && (
                        <div className="aspect-video overflow-hidden rounded-t-lg">
                          <img
                            src={service.image}
                            alt={service.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{service.icon}</span>
                          <Star className="h-5 w-5 text-yellow-500 fill-current" />
                        </div>
                        <CardTitle className="text-xl">{service.title}</CardTitle>
                        <CardDescription>{service.shortDescription}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline">{service.category}</Badge>
                          </div>

                          <div className="flex gap-2">
                            <Button 
                              className="flex-1"
                              onClick={() => handleInquiry(service.slug)}
                            >
                              Get Started
                            </Button>
                            <Button 
                              variant="outline"
                              onClick={() => navigate(`/services/${service.slug}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
          </motion.div>
            ))}
          </div>
        </div>
      </section>
        )}

        {/* All Services */}
      <section className="py-20 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                All Services
              </h2>
              <p className="text-xl text-muted-foreground">
                Explore our complete range of professional services
              </p>
            </div>

            {/* Filters */}
            <div className="mb-8">
              <Card className="shadow-card">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search services..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="Web Development">Web Development</SelectItem>
                        <SelectItem value="Mobile Development">Mobile Development</SelectItem>
                        <SelectItem value="UI/UX Design">UI/UX Design</SelectItem>
                        <SelectItem value="Digital Marketing">Digital Marketing</SelectItem>
                        <SelectItem value="Consulting">Consulting</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={priceFilter} onValueChange={setPriceFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Prices" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Prices</SelectItem>
                        <SelectItem value="low">Under $500</SelectItem>
                        <SelectItem value="medium">$500 - $1500</SelectItem>
                        <SelectItem value="high">Over $1500</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="order">Recommended</SelectItem>
                        <SelectItem value="price">Price</SelectItem>
                        <SelectItem value="title">Name</SelectItem>
                        <SelectItem value="views">Popularity</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Services Grid */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600">{error}</p>
              </div>
            ) : filteredServices.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No services found matching your criteria</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredServices.map((service, index) => (
          <motion.div
                    key={service._id}
            initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow group">
                      {service.image && (
                        <div className="aspect-video overflow-hidden rounded-t-lg">
                          <img
                            src={service.image}
                            alt={service.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{service.icon}</span>
                          {service.featured && (
                            <Star className="h-5 w-5 text-yellow-500 fill-current" />
                          )}
                        </div>
                        <CardTitle className="text-xl">{service.title}</CardTitle>
                        <CardDescription>{service.shortDescription}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline">{service.category}</Badge>
                          </div>

                          {service.tags && service.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {service.tags.slice(0, 3).map((tag, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                          )}

                          <div className="flex gap-2">
                            <Button 
                              className="flex-1"
                              onClick={() => handleInquiry(service.slug)}
                            >
                              Get Started
                            </Button>
                            <Button 
                              variant="outline"
                              onClick={() => navigate(`/services/${service.slug}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
          </motion.div>
            ))}
          </div>
            )}
        </div>
      </section>

        {/* CTA Section */}
        <section className="py-20 lg:py-32 gradient-hero">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-background mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-lg lg:text-xl text-background/90 mb-8">
                Contact us today to discuss your project and get a custom quote
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="text-lg px-8">
                  Contact Us
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 border-background text-background hover:bg-background hover:text-primary">
                  View Portfolio
                </Button>
              </div>
              </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Services;