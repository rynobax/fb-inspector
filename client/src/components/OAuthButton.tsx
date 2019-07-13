import React from 'react';

type ChildFn = (params: { onClick: () => void }) => React.ReactNode;

interface OAuthButtonProps {
  children: ChildFn;
}

const OAuthButton: React.FC<OAuthButtonProps> = props => {
  return null;
};

export default OAuthButton;
