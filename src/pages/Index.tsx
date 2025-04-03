
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './Home';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to home page
    navigate('/');
  }, [navigate]);

  // Simply render the Home component directly while redirecting
  return <Home />;
};

export default Index;
