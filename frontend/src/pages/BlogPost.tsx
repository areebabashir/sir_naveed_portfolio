import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Eye, 
  Tag, 
  ArrowLeft, 
  Share2, 
  Twitter,
  Facebook,
  Linkedin,
  Copy,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/Layout';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  status: string;
  publishedAt: string;
  views: number;
  likes: number;
  readingTime: number;
  categories: string[];
  tags: string[];
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
}

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:8000/api/blog/${slug}`);
        
        if (!response.ok) {
          throw new Error('Blog post not found');
        }

        const data = await response.json();
        setBlog(data.blog);
      } catch (error) {
        console.error('Error fetching blog post:', error);
        setError('Failed to load blog post');
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchBlogPost();
    }
  }, [slug]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = async () => {
    if (!blog) return;

    const url = window.location.href;
    const title = blog.title;
    const text = blog.excerpt;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (error) {
        console.log('Error copying to clipboard:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Blog Post Not Found</CardTitle>
            <CardDescription>
              The blog post you're looking for doesn't exist or has been removed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link to="/blog">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Layout>
      <Helmet>
        <title>{blog.metaTitle || blog.title}</title>
        <meta name="description" content={blog.metaDescription || blog.excerpt} />
        <meta name="keywords" content={blog.metaKeywords?.join(', ')} />
        
        {/* Article specific */}
        <meta property="article:published_time" content={blog.publishedAt} />
        {blog.categories.map((category, index) => (
          <meta key={index} property="article:section" content={category} />
        ))}
        {blog.tags.map((tag, index) => (
          <meta key={index} property="article:tag" content={tag} />
        ))}
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 min-h-[70vh] flex items-center">
          {/* Background Image */}
          {blog.featuredImage && (
            <div className="absolute inset-0">
              <img
                src={blog.featuredImage}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/50"></div>
            </div>
          )}
          
          {/* Gradient Overlay (fallback if no image) */}
          {!blog.featuredImage && (
            <div className="absolute inset-0 gradient-hero"></div>
          )}

          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 z-10">
            {/* Back Button */}
            <div className="mb-8">
              <Button variant="ghost" asChild className="text-white hover:bg-white/20">
                <Link to="/blog">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Blog
                </Link>
              </Button>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-4xl mx-auto"
            >
              {/* Categories */}
              <div className="flex justify-center mb-6">
                <div className="flex flex-wrap gap-2">
                  {blog.categories.map((category, index) => (
                    <Badge key={index} variant="secondary" className="px-4 py-2 text-sm font-medium bg-white/20 text-white border-white/30">
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Title */}
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                {blog.title}
              </h1>

              {/* Excerpt */}
              <p className="text-lg lg:text-xl text-white/90 mb-8 leading-relaxed">
                {blog.excerpt}
              </p>

              {/* Meta Information */}
              <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-white/80 mb-8">
                <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(blog.publishedAt)}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                  <Clock className="h-4 w-4" />
                  <span>{blog.readingTime} min read</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                  <Eye className="h-4 w-4" />
                  <span>{blog.views} views</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex justify-center mb-8">
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1 px-3 py-1 bg-white/10 text-white border-white/30">
                      <Tag className="h-3 w-3" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Share Button */}
              <Button 
                variant="outline" 
                onClick={handleShare}
                className="border-white text-white hover:bg-white hover:text-primary"
              >
                <Share2 className="w-4 h-4 mr-2" />
                {isCopied ? 'Copied!' : 'Share'}
              </Button>
            </motion.div>
          </div>
        </section>


        {/* Content Section */}
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="prose prose-lg max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default BlogPost;
