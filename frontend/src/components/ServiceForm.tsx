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
import '@/styles/service-content.css';

// Validation schema
const serviceSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().min(1, 'Description is required').max(500, 'Description must be less than 500 characters'),
  shortDescription: z.string().min(1, 'Short description is required').max(200, 'Short description must be less than 200 characters'),
  content: z.string().min(1, 'Content is required'),
  icon: z.string().min(1, 'Icon is required'),
  image: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()).optional(),
  status: z.enum(['active', 'inactive', 'draft']),
  featured: z.boolean(),
  metaTitle: z.string().max(60, 'Meta title must be less than 60 characters').optional(),
  metaDescription: z.string().max(160, 'Meta description must be less than 160 characters').optional(),
  metaKeywords: z.array(z.string()).optional(),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

interface ServiceFormProps {
  initialData?: any;
  onSubmit: (data: ServiceFormData) => Promise<void>;
  isLoading?: boolean;
  mode: 'create' | 'edit';
}

interface ServicePreviewProps {
  data: any;
  mode: 'desktop' | 'mobile';
}

const ServicePreview: React.FC<ServicePreviewProps> = ({ data, mode }) => {
  const { user } = useAuth();
  
  if (mode === 'mobile') {
    return (
      <div className="flex justify-center">
        <div className="relative w-80 h-[600px] bg-gray-800 rounded-[2.5rem] p-2 shadow-2xl">
          <div className="w-full h-full bg-white rounded-[2rem] overflow-hidden">
            <div className="h-full overflow-y-auto">
              <div className="p-4">
                {/* Header */}
                <header className="mb-4">
                  {data.image && (
                    <div className="mb-4">
                      <img
                        src={data.image}
                        alt={data.title || 'Service'}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{data.icon || '🔧'}</span>
                    <h1 className="font-bold text-gray-900 text-lg">
                      {data.title || 'Service Title'}
                    </h1>
                  </div>
                  
                  {data.shortDescription && (
                    <p className="text-gray-600 text-sm mb-3">
                      {data.shortDescription}
                    </p>
                  )}
                  
                  
                  <Badge variant="outline" className="text-xs">
                    {data.category || 'Category'}
                  </Badge>
                </header>

                {/* Content */}
                <article className="prose prose-sm max-w-none">
                  {data.content ? (
                    <div 
                      dangerouslySetInnerHTML={{ __html: data.content }}
                      className="service-content"
                    />
                  ) : (
                    <p className="text-gray-500 italic">
                      Start writing your service content...
                    </p>
                  )}
                </article>

                {/* Tags */}
                {data.tags && data.tags.length > 0 && (
                  <footer className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex flex-wrap gap-1">
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
        {data.image && (
          <div className="mb-6">
            <img
              src={data.image}
              alt={data.title || 'Service'}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        )}
        
        <div className="flex items-center gap-4 mb-4">
          <span className="text-4xl">{data.icon || '🔧'}</span>
          <div>
            <h1 className="font-bold text-gray-900 text-3xl">
              {data.title || 'Service Title'}
            </h1>
            <Badge variant="outline" className="mt-2">
              {data.category || 'Category'}
            </Badge>
          </div>
        </div>
        
        {data.shortDescription && (
          <p className="text-gray-600 text-lg mb-4">
            {data.shortDescription}
          </p>
        )}
        
        {data.featured && (
          <div className="mb-4">
            <Badge className="bg-yellow-100 text-yellow-800">
              Featured
            </Badge>
          </div>
        )}
      </header>

      {/* Content */}
      <article className="prose prose-lg max-w-none">
        {data.content ? (
          <div 
            dangerouslySetInnerHTML={{ __html: data.content }}
            className="service-content"
          />
        ) : (
          <p className="text-gray-500 italic">
            Start writing your service content...
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

const ServiceForm: React.FC<ServiceFormProps> = ({ 
  initialData, 
  onSubmit, 
  isLoading = false, 
  mode 
}) => {
  const { token, isAuthenticated, user } = useAuth();
  const [newTag, setNewTag] = useState('');
  const [newKeyword, setNewKeyword] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
        defaultValues: {
          title: '',
          description: '',
          shortDescription: '',
          content: '',
          icon: '🔧',
          image: '',
          category: '',
          tags: [],
          status: 'draft',
          featured: false,
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
        description: initialData.description || '',
        shortDescription: initialData.shortDescription || '',
        content: initialData.content || '',
        icon: initialData.icon || '🔧',
        image: initialData.image || '',
        category: initialData.category || '',
        tags: initialData.tags || [],
        status: initialData.status || 'draft',
        featured: initialData.featured || false,
        metaTitle: initialData.metaTitle || '',
        metaDescription: initialData.metaDescription || '',
        metaKeywords: initialData.metaKeywords || [],
      });
    }
  }, [initialData, reset]);

  // Auto-generate meta fields from title and description
  useEffect(() => {
    if (watchedValues.title && !watchedValues.metaTitle) {
      setValue('metaTitle', watchedValues.title);
    }
    if (watchedValues.description && !watchedValues.metaDescription) {
      setValue('metaDescription', watchedValues.description);
    }
  }, [watchedValues.title, watchedValues.description, setValue]);

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


  const handleFileUpload = async (file: File): Promise<string> => {
    try {
      setIsUploading(true);
      setUploadError('');
      
      if (!token || !isAuthenticated) {
        throw new Error('You must be logged in to upload images');
      }
      
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB');
      }
      
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select an image file');
      }

      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('http://localhost:8000/api/services/upload', {
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
      setValue('image', fullImageUrl);
      return fullImageUrl;
    } catch (error) {
      console.error('Upload error:', error);
      if (error instanceof Error && error.message.includes('Failed to fetch')) {
        setUploadError('Cannot connect to server. Please make sure the backend server is running.');
      } else {
        setUploadError(error instanceof Error ? error.message : 'Upload failed');
      }
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleFormSubmit = async (data: ServiceFormData) => {
    await onSubmit(data);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              {mode === 'create' ? 'Create New Service' : 'Edit Service'}
            </h1>
            <p className="text-muted-foreground">
              {mode === 'create' 
                ? 'Create a new service with pricing and features'
                : 'Update your service information and settings'
              }
            </p>
          </div>
          <div className="flex gap-2">
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
                    <span>Service Preview</span>
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
                  <ServicePreview 
                    data={watchedValues} 
                    mode={previewMode}
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
              </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    Essential information for your service
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        {...register('title')}
                        placeholder="Enter service title"
                        className={errors.title ? 'border-red-500' : ''}
                      />
                      {errors.title && (
                        <p className="text-sm text-red-500">{errors.title.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="icon">Icon *</Label>
                      <Input
                        id="icon"
                        {...register('icon')}
                        placeholder="🔧"
                        className={errors.icon ? 'border-red-500' : ''}
                      />
                      {errors.icon && (
                        <p className="text-sm text-red-500">{errors.icon.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      {...register('description')}
                      placeholder="Brief description of your service"
                      rows={3}
                      className={errors.description ? 'border-red-500' : ''}
                    />
                    {errors.description && (
                      <p className="text-sm text-red-500">{errors.description.message}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {watchedValues.description?.length || 0}/500 characters
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shortDescription">Short Description *</Label>
                    <Textarea
                      id="shortDescription"
                      {...register('shortDescription')}
                      placeholder="One-line description for cards"
                      rows={2}
                      className={errors.shortDescription ? 'border-red-500' : ''}
                    />
                    {errors.shortDescription && (
                      <p className="text-sm text-red-500">{errors.shortDescription.message}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {watchedValues.shortDescription?.length || 0}/200 characters
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Content *</Label>
                    <Textarea
                      id="content"
                      {...register('content')}
                      placeholder="Detailed service description with HTML support"
                      rows={8}
                      className={errors.content ? 'border-red-500' : ''}
                    />
                    {errors.content && (
                      <p className="text-sm text-red-500">{errors.content.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image">Service Image</Label>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <input
                          type="file"
                          id="image"
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
                          onClick={() => document.getElementById('image')?.click()}
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
                        {watchedValues.image && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setValue('image', '')}
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
                      {watchedValues.image && (
                        <div className="relative">
                          <img
                            src={watchedValues.image}
                            alt="Service image preview"
                            className="w-full h-48 object-cover rounded-lg border"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Input
                        id="category"
                        {...register('category')}
                        placeholder="Enter service category"
                        className={errors.category ? 'border-red-500' : ''}
                      />
                      {errors.category && (
                        <p className="text-sm text-red-500">{errors.category.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select value={watchedValues.status} onValueChange={(value) => setValue('status', value as 'active' | 'inactive' | 'draft')}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <div className="flex gap-2">
                      <Input
                        id="newTag"
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

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={watchedValues.featured}
                      onChange={(e) => setValue('featured', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="featured">Featured Service</Label>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>


            <TabsContent value="seo" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>SEO Settings</CardTitle>
                  <CardDescription>
                    Optimize your service for search engines
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
                      placeholder="Brief, keyword-rich description for search engines"
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
                    <Label htmlFor="metaKeywords">Meta Keywords</Label>
                    <div className="flex gap-2">
                      <Input
                        id="newKeyword"
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
                        <Badge key={index} variant="outline" className="flex items-center gap-1">
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
          </Tabs>

          <div className="flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => {
                if (mode === 'edit') {
                  // Go back to services list
                  window.history.back();
                } else {
                  // Reset form for create mode
                  reset();
                }
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {mode === 'create' ? 'Create Service' : 'Update Service'}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceForm;
