import React from 'react';
import { Dialog } from '@reach/dialog';
import styled from 'styled-components';
import Close from 'icons/Close';

interface AddProjectProps {
  open: boolean;
  close: () => void;
}

const AddProject: React.FC<AddProjectProps> = props => {
  return (
    <AddDialog
      isOpen={props.open}
      onDismiss={props.close}
    >
      <CloseButton onClick={props.close}>
        <Close size={30} />
      </CloseButton>
      Here's the add thing
    </AddDialog>
  );
};

const AddDialog = styled(Dialog)`
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  right: 16px;
  top: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border: none;
  :hover {
    border: none;
  }
`;

export default AddProject;
