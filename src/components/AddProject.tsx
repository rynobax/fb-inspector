import React, { useState } from 'react';
import { Dialog } from '@reach/dialog';
import styled from 'styled-components';
import Close from 'icons/Close';
import { useProject } from 'hooks/project';

interface AddProjectProps {
  open: boolean;
  close: () => void;
}

const AddProject: React.FC<AddProjectProps> = props => {
  const [name, setName] = useState('');
  const { addProject } = useProject();

  function submit() {
    console.log(name);
    const id = String(Date.now());
    addProject({ id, name });
    props.close();
    setName('');
  }

  return (
    <AddDialog isOpen={props.open} onDismiss={props.close}>
      <CloseButton onClick={props.close}>
        <Close size={30} />
      </CloseButton>
      <Label>Name</Label>
      <Input value={name} onChange={e => setName(e.target.value)} />
      <div>
        <FinishButton onClick={submit}>Add</FinishButton>
      </div>
    </AddDialog>
  );
};

const Label = styled.div`
  margin-bottom: 8px;
`;

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

const FinishButton = styled.button`
  padding: 12px;
  border-radius: 4px;
`;

const Input = styled.input`
  margin-bottom: 8px;
`;

export default AddProject;
