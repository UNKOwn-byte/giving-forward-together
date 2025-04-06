
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import SkipLink from '../a11y/SkipLink';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <SkipLink targetId="main-content" />
      <Navbar />
      <motion.main 
        id="main-content"
        className="flex-grow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.main>
      <Footer />
    </div>
  );
};

export default Layout;
