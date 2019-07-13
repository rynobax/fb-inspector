import React from 'react';
import styled from 'sc';
import { IconProps } from 'icons/types';

interface ButtonProps {
  onClick: () => void;
  Icon?: React.FunctionComponent<IconProps>;
}

const Button: React.FC<ButtonProps> = props => {
  const { onClick, Icon, children } = props;
  return (
    <ButtonContainer onClick={onClick} className={(props as any).className}>
      {Icon && <Icon size={24} />}
      {children}
      {Icon && <IconPadding size={24} />}
    </ButtonContainer>
  );
};

export default Button;

const ButtonContainer = styled.button`
  border: 1px solid #aaa;
  color: ${p => p.theme.color.primary.light};
  fill: ${p => p.theme.color.primary.extraLight};
  padding: 8px;
  border-radius: 4px;
  display: flex;
  flex-direction: row;
  align-items: center;

  :hover {
    border: 1px solid ${p => p.theme.color.primary.regular};
    color: ${p => p.theme.color.primary.regular};
    fill: ${p => p.theme.color.primary.regular};
    transition: 0.5s;
    cursor: pointer;
  }
`;

const IconPadding = styled.div<{ size: number }>`
  width: ${p => p.size / 3}px;
`;
