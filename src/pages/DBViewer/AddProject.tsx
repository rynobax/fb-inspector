import React, { useState } from 'react';
import { Dialog } from '@reach/dialog';
import styled from 'styled-components';
import Close from 'icons/Close';
import { useProject } from 'hooks/project';

interface AddProjectProps {
  open: boolean;
  close: () => void;
  editing: boolean;
}

const AddProject: React.FC<AddProjectProps> = props => {
  const { addProject, project, updateProject, removeProject } = useProject();
  const [name, setName] = useState(
    props.editing && project ? project.name : ''
  );
  const [id, setId] = useState(props.editing && project ? project.id : '');
  const [legacyToken, setLegacyToken] = useState(
    props.editing && project ? project.legacyToken : ''
  );

  function submit() {
    if (props.editing && project) {
      updateProject({ ...project, name, legacyToken });
    } else {
      const __id = String(Date.now());
      addProject({ __id, id, name, legacyToken });
    }
    props.close();
    setName('');
  }

  function remove() {
    if (project) removeProject(project.id);
  }

  return (
    <AddDialog isOpen={props.open} onDismiss={props.close}>
      <CloseButton onClick={props.close}>
        <Close size={30} />
      </CloseButton>
      <Label>Name*</Label>
      <Input value={name} onChange={e => setName(e.target.value)} />
      <Label>Project URL*</Label>
      <Input value={id} onChange={e => setId(e.target.value)} />
      <Label>Legacy token</Label>
      <Input value={legacyToken} onChange={e => setLegacyToken(e.target.value)} />
      <div>
        <FinishButton onClick={submit}>Save</FinishButton>
        {props.editing && <DeleteButton onClick={remove}>Delete</DeleteButton>}
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

const BottomButton = styled.button`
  padding: 12px;
  border-radius: 4px;
`;

const FinishButton = styled(BottomButton)``;

const DeleteButton = styled(BottomButton)`
  margin-left: 16px;
  color: #c00;
  border: 1px solid #c00;

  :hover {
    color: #f00;
    border: 1px solid #f00;
  }
`;

const Input = styled.input`
  margin-bottom: 8px;
`;

export default AddProject;
