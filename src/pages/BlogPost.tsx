
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useData } from '../context/DataContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Share2, Calendar, User, ArrowLeft } from 'lucide-react';
import { formatDate } from '../utils/donationUtils';

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getBlogPost, blogPosts } = useData();
  
  const post = slug ? getBlogPost(slug) : undefined;
  
  // Get related posts (same category)
  const relatedPosts = post ? blogPosts
    .filter(p => p.category === post.category && p.id !== post.id)
    .slice(0, 3) : [];
    
  if (!post) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
          <p className="mb-8">The article you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/blog">Back to Blog</Link>
          </Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Link to="/blog" className="flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Blog
        </Link>
        
        {/* Header */}
        <div className="mb-8">
          <Badge className="mb-4">{post.category}</Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
          
          <div className="flex flex-wrap items-center text-gray-600 gap-4 mb-6">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{formatDate(post.createdAt)}</span>
            </div>
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              <span>By {post.author}</span>
            </div>
          </div>
          
          <div className="w-full h-[400px] overflow-hidden rounded-lg">
            <img 
              src={post.image} 
              alt={post.title} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        {/* Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-2/3">
            {/* Author Info */}
            <div className="flex items-center mb-8 p-4 bg-gray-50 rounded-lg">
              {post.authorImage && (
                <img 
                  src={post.authorImage} 
                  alt={post.author} 
                  className="w-12 h-12 rounded-full mr-4"
                />
              )}
              <div>
                <p className="font-medium">{post.author}</p>
                <p className="text-sm text-gray-500">Author</p>
              </div>
            </div>
            
            {/* Post Content */}
            <div className="prose max-w-none">
              {post.content.split('\n\n').map((paragraph, index) => {
                // Check if paragraph is a heading
                if (paragraph.startsWith('## ')) {
                  return (
                    <h2 key={index} className="text-2xl font-bold mt-8 mb-4">
                      {paragraph.replace('## ', '')}
                    </h2>
                  );
                }
                return <p key={index} className="mb-6">{paragraph}</p>;
              })}
            </div>
            
            {/* Tags */}
            <div className="my-8">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-sm">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Share */}
            <div className="my-8">
              <Button variant="outline" className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Share This Article
              </Button>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:w-1/3">
            {/* Related Posts */}
            <div className="sticky top-24">
              <h3 className="text-xl font-bold mb-4">Related Articles</h3>
              
              {relatedPosts.length > 0 ? (
                <div className="space-y-4">
                  {relatedPosts.map((relatedPost) => (
                    <Card key={relatedPost.id} className="p-4">
                      <div className="flex gap-4">
                        <img 
                          src={relatedPost.image} 
                          alt={relatedPost.title} 
                          className="w-24 h-24 object-cover rounded"
                        />
                        <div>
                          <h4 className="font-medium line-clamp-2">
                            <Link to={`/blog/${relatedPost.slug}`} className="hover:underline">
                              {relatedPost.title}
                            </Link>
                          </h4>
                          <div className="text-sm text-gray-500 mt-1 flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDate(relatedPost.createdAt)}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No related articles found.</p>
              )}
              
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Categories</h3>
                <div className="space-y-2">
                  {Array.from(new Set(blogPosts.map(p => p.category))).map((category) => (
                    <div key={category} className="flex items-center justify-between">
                      <Link 
                        to={`/blog?category=${category}`}
                        className="text-gray-700 hover:text-gray-900"
                      >
                        {category}
                      </Link>
                      <Badge variant="outline">
                        {blogPosts.filter(p => p.category === category).length}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BlogPost;
