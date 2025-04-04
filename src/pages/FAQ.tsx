
import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { useData } from '../context/DataContext';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search } from 'lucide-react';

const FAQ: React.FC = () => {
  const { faqItems } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Extract unique categories
  const categories = Array.from(new Set(faqItems.map(item => item.category)));
  
  // Filter FAQ items based on search term
  const filteredItems = faqItems.filter(item => 
    searchTerm === '' || 
    item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold">Frequently Asked Questions</h1>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Find answers to common questions about our platform, donations, campaigns, and more.
          </p>
        </div>
        
        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search for answers..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {/* FAQ Tabs by Category */}
        <Tabs defaultValue="all" className="max-w-3xl mx-auto">
          <TabsList className="w-full mb-8 overflow-auto">
            <TabsTrigger value="all">All Questions</TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value="all">
            <Accordion type="single" collapsible className="w-full">
              {filteredItems.map((item) => (
                <AccordionItem key={item.id} value={item.id}>
                  <AccordionTrigger className="text-left">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="prose max-w-none pt-2 pb-4">
                      <p>{item.answer}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            
            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold">No Results Found</h3>
                <p className="text-gray-500 mt-2">
                  We couldn't find any questions matching "{searchTerm}".
                </p>
                <p className="text-gray-500">
                  Try using different keywords or browse by category.
                </p>
              </div>
            )}
          </TabsContent>
          
          {categories.map((category) => (
            <TabsContent key={category} value={category}>
              <Accordion type="single" collapsible className="w-full">
                {filteredItems
                  .filter(item => item.category === category)
                  .map((item) => (
                    <AccordionItem key={item.id} value={item.id}>
                      <AccordionTrigger className="text-left">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="prose max-w-none pt-2 pb-4">
                          <p>{item.answer}</p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))
                }
              </Accordion>
              
              {filteredItems.filter(item => item.category === category).length === 0 && (
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold">No Results Found</h3>
                  <p className="text-gray-500 mt-2">
                    We couldn't find any questions in this category matching "{searchTerm}".
                  </p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
        
        {/* Contact Support Section */}
        <div className="max-w-3xl mx-auto mt-16 p-8 bg-gray-50 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Can't find what you're looking for?</h2>
          <p className="text-gray-600 mb-6">
            Our support team is here to help with any questions you might have.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:support@example.com" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
              Email Support
            </a>
            <a href="#" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
              Live Chat
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FAQ;
