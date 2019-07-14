import React from 'react';
import { IconProps } from './types';

const Visible: React.FC<IconProps> = props => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="icon-view-visible"
    width={props.size}
    height={props.size}
  >
    <path
      className="primary"
      d="M17.56 17.66a8 8 0 0 1-11.32 0L1.3 12.7a1 1 0 0 1 0-1.42l4.95-4.95a8 8 0 0 1 11.32 0l4.95 4.95a1 1 0 0 1 0 1.42l-4.95 4.95zM11.9 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z"
    />
    <circle cx="12" cy="12" r="3" className="secondary" />
  </svg>
);

export default Visible;
