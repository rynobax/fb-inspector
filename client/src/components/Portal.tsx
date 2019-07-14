import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: React.ReactNode;
}

const Portal: React.FC<PortalProps> = ({ children }) => {
  const [portalNode, setPortalNode] = useState<HTMLElement | null>(null);
  useEffect(() => {
    const node = document.createElement('portal');
    document.body.appendChild(node);
    setPortalNode(node);
    return () => {
      document.body.removeChild(node);
    };
  }, []);
  if (!portalNode) return null;
  return createPortal(children, portalNode);
};

export default Portal;
