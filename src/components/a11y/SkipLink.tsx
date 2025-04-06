
import React from 'react';

interface SkipLinkProps {
  targetId: string;
  label?: string;
}

const SkipLink: React.FC<SkipLinkProps> = ({ 
  targetId, 
  label = "Skip to content" 
}) => {
  return (
    <a href={`#${targetId}`} className="skip-link focus-ring">
      {label}
    </a>
  );
};

export default SkipLink;
