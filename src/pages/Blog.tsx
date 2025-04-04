
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useData } from '../context/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Search, Book } from 'lucide-react';
import { formatDate } from '../utils/donationUtils';

const Blog: React.FC = () => {
  const { blogPosts, featuredBlogPosts } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Extract unique categories
  const categories = Array.from(new Set(blogPosts.map(post => post.category)));

  // Filter posts based on search and category
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = 
      searchTerm === '' || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      post.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === '' || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Our Blog</h1>
            <p className="text-gray-600 mt-2">
              News, updates and stories about our fundraising community
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button asChild>
              <Link to="/blog/subscribe">
                Subscribe to Updates
              </Link>
            </Button>
          </div>
        </div>

        {/* Featured Post */}
        {featuredBlogPosts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-semibold mb-4">Featured Article</h2>
            <Card className="overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img 
                    src={featuredBlogPosts[0].image} 
                    alt={featuredBlogPosts[0].title} 
                    className="h-64 w-full md:h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-6 md:p-8">
                  <Badge>{featuredBlogPosts[0].category}</Badge>
                  <CardTitle className="mt-4 text-2xl">
                    <Link to={`/blog/${featuredBlogPosts[0].slug}`} className="hover:underline">
                      {featuredBlogPosts[0].title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="mt-2 text-base">
                    {featuredBlogPosts[0].excerpt}
                  </CardDescription>
                  <div className="flex items-center mt-6">
                    {featuredBlogPosts[0].authorImage && (
                      <img 
                        src={featuredBlogPosts[0].authorImage} 
                        alt={featuredBlogPosts[0].author} 
                        className="w-10 h-10 rounded-full mr-3"
                      />
                    )}
                    <div>
                      <p className="font-medium">{featuredBlogPosts[0].author}</p>
                      <p className="text-sm text-gray-500 flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        {formatDate(featuredBlogPosts[0].createdAt)}
                      </p>
                    </div>
                  </div>
                  <CardFooter className="px-0 pt-6">
                    <Button asChild>
                      <Link to={`/blog/${featuredBlogPosts[0].slug}`}>
                        Read More
                      </Link>
                    </Button>
                  </CardFooter>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search articles..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Tabs defaultValue="all" onValueChange={(value) => setSelectedCategory(value === 'all' ? '' : value)}>
            <TabsList className="w-full overflow-auto flex-wrap">
              <TabsTrigger value="all">All</TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger key={category} value={category}>
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Blog Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden flex flex-col">
              <div className="h-48 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <Badge>{post.category}</Badge>
                  <div className="text-sm text-gray-500 flex items-center">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    {formatDate(post.createdAt)}
                  </div>
                </div>
                <CardTitle className="mt-2">
                  <Link to={`/blog/${post.slug}`} className="hover:underline">
                    {post.title}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 line-clamp-3">{post.excerpt}</p>
              </CardContent>
              <CardFooter className="mt-auto">
                <div className="w-full flex justify-between items-center">
                  <div className="flex items-center">
                    {post.authorImage && (
                      <img 
                        src={post.authorImage} 
                        alt={post.author} 
                        className="w-8 h-8 rounded-full mr-2"
                      />
                    )}
                    <span className="text-sm font-medium">{post.author}</span>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/blog/${post.slug}`}>
                      Read More
                    </Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <Book className="mx-auto h-16 w-16 text-gray-300" />
            <h3 className="text-xl font-semibold mt-4">No Articles Found</h3>
            <p className="text-gray-500 mt-2">
              We couldn't find any articles matching your search criteria.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Blog;
