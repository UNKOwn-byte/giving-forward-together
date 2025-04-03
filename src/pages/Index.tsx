
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './Home';

const Index = () => {
  const navigate = useNavigate();

  // Simply render the Home component directly
  return <Home />;
};

export default Index;
