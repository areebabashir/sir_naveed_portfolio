import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Save, Eye, EyeOff, Upload, X, Plus, Monitor, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import QuillEditor from './QuillEditor';
import '@/styles/blog-content.css';

// Validation schema
const blogSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  excerpt: z.string().min(1, 'Excerpt is required').max(300, 'Excerpt must be less than 300 characters'),
  content: z.string().min(1, 'Content is required'),
  featuredImage: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']),
  categories: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  metaTitle: z.string().max(60, 'Meta title must be less than 60 characters').optional(),
  metaDescription: z.string().max(160, 'Meta description must be less than 160 characters').optional(),
  metaKeywords: z.array(z.string()).optional(),
});

type BlogFormData = z.infer<typeof blogSchema>;

interface BlogFormProps {
  initialData?: any;
  onSubmit: (data: BlogFormData) => Promise<void>;
  isLoading?: boolean;
  mode: 'create' | 'edit';
}

interface BlogPreviewProps {
  data: any;
  mode: 'desktop' | 'mobile';
}

const BlogPreview: React.FC<BlogPreviewProps> = ({ data, mode }) => {
  const { user } = useAuth();
  
  if (mode === 'mobile') {
    return (
      <div className="flex justify-center">
        <div className="relative w-80 h-[600px] bg-gray-800 rounded-[2.5rem] p-2 shadow-2xl">
          {/* Mobile frame */}
          <div className="w-full h-full bg-white rounded-[2rem] overflow-hidden">
            <div className="h-full overflow-y-auto">
              <div className="p-4">
                {/* Header */}
                <header className="mb-4">
                  {data.featuredImage && (
                    <div className="mb-4">
                      <img
                        src={data.featuredImage}
                        alt={data.title || 'Blog post'}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  
                  <h1 className="font-bold text-gray-900 text-lg mb-2">
                    {data.title || 'Blog Post Title'}
                  </h1>
                  
                  {data.excerpt && (
                    <p className="text-gray-600 text-sm mb-3">
                      {data.excerpt}
                    </p>
                  )}
                  
                  {/* Meta info */}
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="text-gray-500">
                      By {user?.name || 'Author'}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500">
                      {new Date().toLocaleDateString()}
                    </span>
                    {data.categories && data.categories.length > 0 && (
                      <>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-500">
                          {data.categories.join(', ')}
                        </span>
                      </>
                    )}
                  </div>
                </header>

                {/* Content */}
                <article className="prose prose-sm max-w-none">
                  {data.content ? (
                    <div 
                      dangerouslySetInnerHTML={{ __html: data.content }}
                      className="blog-content"
                    />
                  ) : (
                    <p className="text-gray-500 italic">
                      Start writing your blog post content...
                    </p>
                  )}
                </article>

                {/* Tags */}
                {data.tags && data.tags.length > 0 && (
                  <footer className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex flex-wrap gap-2">
                      {data.tags.map((tag: string, index: number) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </footer>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg p-8">
      {/* Header */}
      <header className="mb-8">
        {data.featuredImage && (
          <div className="mb-6">
            <img
              src={data.featuredImage}
              alt={data.title || 'Blog post'}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        )}
        
        <h1 className="font-bold text-gray-900 text-3xl mb-4">
          {data.title || 'Blog Post Title'}
        </h1>
        
        {data.excerpt && (
          <p className="text-gray-600 text-lg mb-4">
            {data.excerpt}
          </p>
        )}
        
        {/* Meta info */}
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="text-gray-500">
            By {user?.name || 'Author'}
          </span>
          <span className="text-gray-400">•</span>
          <span className="text-gray-500">
            {new Date().toLocaleDateString()}
          </span>
          {data.categories && data.categories.length > 0 && (
            <>
              <span className="text-gray-400">•</span>
              <span className="text-gray-500">
                {data.categories.join(', ')}
              </span>
            </>
          )}
        </div>
      </header>

      {/* Content */}
      <article className="prose prose-lg max-w-none">
        {data.content ? (
          <div 
            dangerouslySetInnerHTML={{ __html: data.content }}
            className="blog-content"
          />
        ) : (
          <p className="text-gray-500 italic">
            Start writing your blog post content...
          </p>
        )}
      </article>

      {/* Tags */}
      {data.tags && data.tags.length > 0 && (
        <footer className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {data.tags.map((tag: string, index: number) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        </footer>
      )}
    </div>
  );
};

const BlogForm: React.FC<BlogFormProps> = ({ 
  initialData, 
  onSubmit, 
  isLoading = false, 
  mode 
}) => {
  const { token, isAuthenticated, user } = useAuth();
  const [newCategory, setNewCategory] = useState('');
  const [newTag, setNewTag] = useState('');
  const [newKeyword, setNewKeyword] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isProcessingImages, setIsProcessingImages] = useState(false);
  const [imageProcessingProgress, setImageProcessingProgress] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset
  } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: '',
      excerpt: '',
      content: '',
      featuredImage: '',
      status: 'draft',
      categories: [],
      tags: [],
      metaTitle: '',
      metaDescription: '',
      metaKeywords: [],
    }
  });

  const watchedValues = watch();

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title || '',
        excerpt: initialData.excerpt || '',
        content: initialData.content || '',
        featuredImage: initialData.featuredImage || '',
        status: initialData.status || 'draft',
        categories: initialData.categories || [],
        tags: initialData.tags || [],
        metaTitle: initialData.metaTitle || '',
        metaDescription: initialData.metaDescription || '',
        metaKeywords: initialData.metaKeywords || [],
      });
    }
  }, [initialData, reset]);

  // Auto-generate meta fields from title and excerpt
  useEffect(() => {
    if (watchedValues.title && !watchedValues.metaTitle) {
      setValue('metaTitle', watchedValues.title);
    }
    if (watchedValues.excerpt && !watchedValues.metaDescription) {
      setValue('metaDescription', watchedValues.excerpt);
    }
  }, [watchedValues.title, watchedValues.excerpt, setValue]);

  const addCategory = () => {
    if (newCategory.trim() && !watchedValues.categories?.includes(newCategory.trim())) {
      setValue('categories', [...(watchedValues.categories || []), newCategory.trim()]);
      setNewCategory('');
    }
  };

  const removeCategory = (category: string) => {
    setValue('categories', watchedValues.categories?.filter(c => c !== category) || []);
  };

  const addTag = () => {
    if (newTag.trim() && !watchedValues.tags?.includes(newTag.trim())) {
      setValue('tags', [...(watchedValues.tags || []), newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setValue('tags', watchedValues.tags?.filter(t => t !== tag) || []);
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !watchedValues.metaKeywords?.includes(newKeyword.trim())) {
      setValue('metaKeywords', [...(watchedValues.metaKeywords || []), newKeyword.trim()]);
      setNewKeyword('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setValue('metaKeywords', watchedValues.metaKeywords?.filter(k => k !== keyword) || []);
  };

  const handleFileUpload = async (file: File) => {
    try {
      setIsUploading(true);
      setUploadError('');
      
      // Check if user is authenticated
      if (!token || !isAuthenticated) {
        throw new Error('You must be logged in to upload images');
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB');
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select an image file');
      }

      const formData = new FormData();
      formData.append('image', file);


      const response = await fetch('http://localhost:8000/api/blog/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json();
      const fullImageUrl = `http://localhost:8000${data.imageUrl}`;
      setValue('featuredImage', fullImageUrl);
      return fullImageUrl;
    } catch (error) {
      console.error('Upload error:', error);
      if (error instanceof Error && error.message.includes('Failed to fetch')) {
        setUploadError('Cannot connect to server. Please make sure the backend server is running.');
      } else {
        setUploadError(error instanceof Error ? error.message : 'Upload failed');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const processBase64Images = async (content: string) => {
    console.log('Processing base64 images in content...');
    
    // Find all base64 images in the content - improved regex
    const base64Regex = /<img[^>]+src="data:image\/([^;]+);base64,([^"]+)"/g;
    let processedContent = content;
    let match;
    let processedCount = 0;

    // Count total images first
    const allMatches = content.match(base64Regex);
    const totalImages = allMatches ? allMatches.length : 0;
    
    console.log('Found base64 images:', totalImages);
    console.log('Matches:', allMatches);

    if (totalImages === 0) {
      console.log('No base64 images found, returning original content');
      return processedContent;
    }

    setImageProcessingProgress(`Processing images: 0/${totalImages}`);

    // Reset regex for iteration
    base64Regex.lastIndex = 0;
    
    while ((match = base64Regex.exec(content)) !== null) {
      const [fullMatch, imageType, base64Data] = match;
      processedCount++;
      
      console.log(`Processing image ${processedCount}/${totalImages}:`, {
        imageType,
        base64Length: base64Data.length,
        fullMatch: fullMatch.substring(0, 100) + '...'
      });
      
      try {
        setImageProcessingProgress(`Processing images: ${processedCount}/${totalImages}`);
        
        // Convert base64 to blob
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: `image/${imageType}` });
        
        // Create file from blob
        const file = new File([blob], `image-${Date.now()}-${processedCount}.${imageType}`, {
          type: `image/${imageType}`
        });

        console.log('Uploading file:', file.name, file.size, file.type);

        // Upload the file
        const imageUrl = await handleFileUpload(file);
        
        console.log('Upload successful, image URL:', imageUrl);
        
        // Replace base64 src with uploaded image URL
        processedContent = processedContent.replace(
          fullMatch,
          `<img src="${imageUrl}"`
        );
        
        console.log('Replaced base64 image with URL');
      } catch (error) {
        console.error('Error processing base64 image:', error);
        // Keep the original base64 image if upload fails
      }
    }

    setImageProcessingProgress('');
    console.log('Base64 processing complete');
    return processedContent;
  };

  const handleFormSubmit = async (data: BlogFormData) => {
    try {
      setIsProcessingImages(true);
      
      console.log('Original content:', data.content);
      console.log('Has base64 images:', data.content?.includes('data:image/'));
      
      // Process base64 images in content
      const processedContent = await processBase64Images(data.content);
      console.log('Processed content:', processedContent);
      
      const processedData = {
        ...data,
        content: processedContent
      };
      
      console.log('Final data being submitted:', processedData);
      await onSubmit(processedData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsProcessingImages(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              {mode === 'create' ? 'Create New Blog Post' : 'Edit Blog Post'}
            </h1>
            <p className="text-muted-foreground">
              {mode === 'create' 
                ? 'Write and publish a new blog post with SEO optimization'
                : 'Update your blog post content and settings'
              }
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                console.log('Current form data:', watchedValues);
                console.log('Content:', watchedValues.content);
                console.log('Has base64:', watchedValues.content?.includes('data:image/'));
              }}
            >
              Debug Content
            </Button>
            <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
                <DialogHeader>
                  <DialogTitle className="flex items-center justify-between">
                    <span>Blog Preview</span>
                    <div className="flex gap-2">
                      <Button
                        variant={previewMode === 'desktop' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPreviewMode('desktop')}
                      >
                        <Monitor className="w-4 h-4 mr-2" />
                        Desktop
                      </Button>
                      <Button
                        variant={previewMode === 'mobile' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPreviewMode('mobile')}
                      >
                        <Smartphone className="w-4 h-4 mr-2" />
                        Mobile
                      </Button>
                    </div>
                  </DialogTitle>
                </DialogHeader>
                <div className="overflow-auto max-h-[70vh]">
                  <BlogPreview 
                    data={watchedValues} 
                    mode={previewMode}
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Essential information for your blog post
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    {...register('title')}
                    placeholder="Enter blog post title"
                    className={errors.title ? 'border-red-500' : ''}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500">{errors.title.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt *</Label>
                  <Textarea
                    id="excerpt"
                    {...register('excerpt')}
                    placeholder="Brief description of your blog post"
                    rows={3}
                    className={errors.excerpt ? 'border-red-500' : ''}
                  />
                  {errors.excerpt && (
                    <p className="text-sm text-red-500">{errors.excerpt.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {watchedValues.excerpt?.length || 0}/300 characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="featuredImage">Featured Image</Label>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <input
                        type="file"
                        id="featuredImage"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileUpload(file);
                          }
                        }}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('featuredImage')?.click()}
                        disabled={isUploading || !token}
                      >
                        {isUploading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-2" />
                            {token ? 'Choose Image' : 'Login Required'}
                          </>
                        )}
                      </Button>
                      {watchedValues.featuredImage && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setValue('featuredImage', '')}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    {uploadError && (
                      <Alert variant="destructive">
                        <AlertDescription>{uploadError}</AlertDescription>
                      </Alert>
                    )}
                    {watchedValues.featuredImage && (
                      <div className="relative">
                        <img
                          src={watchedValues.featuredImage}
                          alt="Featured image preview"
                          className="w-full h-48 object-cover rounded-lg border"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content *</Label>
                  <QuillEditor
                    value={watchedValues.content || ''}
                    onChange={(value) => setValue('content', value)}
                    placeholder="Write your blog post content here..."
                    height="400px"
                  />
                  {errors.content && (
                    <p className="text-sm text-red-500">{errors.content.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Categories & Tags</CardTitle>
                <CardDescription>
                  Organize your blog post with categories and tags
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Categories</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="Add category"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCategory())}
                    />
                    <Button type="button" onClick={addCategory} variant="outline">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {watchedValues.categories?.map((category, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {category}
                        <X 
                          className="w-3 h-3 cursor-pointer" 
                          onClick={() => removeCategory(category)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add tag"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <Button type="button" onClick={addTag} variant="outline">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {watchedValues.tags?.map((tag, index) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-1">
                        {tag}
                        <X 
                          className="w-3 h-3 cursor-pointer" 
                          onClick={() => removeTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
                <CardDescription>
                  Optimize your blog post for search engines
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="metaTitle">Meta Title</Label>
                  <Input
                    id="metaTitle"
                    {...register('metaTitle')}
                    placeholder="SEO optimized title"
                    className={errors.metaTitle ? 'border-red-500' : ''}
                  />
                  {errors.metaTitle && (
                    <p className="text-sm text-red-500">{errors.metaTitle.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {watchedValues.metaTitle?.length || 0}/60 characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea
                    id="metaDescription"
                    {...register('metaDescription')}
                    placeholder="SEO optimized description"
                    rows={3}
                    className={errors.metaDescription ? 'border-red-500' : ''}
                  />
                  {errors.metaDescription && (
                    <p className="text-sm text-red-500">{errors.metaDescription.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {watchedValues.metaDescription?.length || 0}/160 characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Meta Keywords</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      placeholder="Add keyword"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                    />
                    <Button type="button" onClick={addKeyword} variant="outline">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {watchedValues.metaKeywords?.map((keyword, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {keyword}
                        <X 
                          className="w-3 h-3 cursor-pointer" 
                          onClick={() => removeKeyword(keyword)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>


          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Publishing Settings</CardTitle>
                <CardDescription>
                  Control when and how your blog post is published
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={watchedValues.status}
                    onValueChange={(value) => setValue('status', value as 'draft' | 'published' | 'archived')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading || isProcessingImages}>
            {isLoading || isProcessingImages ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {isProcessingImages ? (imageProcessingProgress || 'Processing Images...') : 'Saving...'}
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {mode === 'create' ? 'Create Post' : 'Update Post'}
              </>
            )}
          </Button>
        </div>
      </form>
      </div>
    </div>
  );
};

export default BlogForm;
