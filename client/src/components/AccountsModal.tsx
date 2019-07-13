import React from 'react';
import { Dialog } from '@reach/dialog';
import styled from 'sc';

import Add from 'icons/Add';

import { openOathRegister } from 'services/google';
import { useSettings } from 'hooks/settings';
import Button from 'components/Button';
import Refresh from 'icons/Refresh';
import Remove from 'icons/Close';

interface AccountsModalProps {
  open: boolean;
  onClose: () => void;
}

const AccountsModal: React.FC<AccountsModalProps> = props => {
  const { settings, actions } = useSettings();
  const { accounts, projects } = settings;
  return (
    <AddDialog isOpen={props.open} onDismiss={props.onClose}>
      <HeaderLabel>Accounts</HeaderLabel>
      {accounts.length === 0 && <div>No accounts!</div>}
      {accounts.map(account => {
        return (
          <Row key={account.id}>
            <RemoveButton onClick={() => actions.removeUser(account.id)}>
              <Remove size={24} />
            </RemoveButton>
            <RowText>{account.email}</RowText>
          </Row>
        );
      })}
      <StyledButton Icon={Add} onClick={openOathRegister}>
        Add Account
      </StyledButton>
      <HeaderLabel>Projects</HeaderLabel>
      {projects.length === 0 && <div>No projects!</div>}
      {projects.map(project => {
        return <Row key={project.id}>{project.name}</Row>;
      })}
      <StyledButton Icon={Refresh} onClick={actions.refreshProjects}>
        Refresh Projects
      </StyledButton>
    </AddDialog>
  );
};

const AddDialog = styled(Dialog)`
  position: relative;
`;

const HeaderLabel = styled.div`
  color: ${p => p.theme.color.text.light};
  font-size: ${p => p.theme.font.size[24]};
  margin-bottom: 16px;
`;

const StyledButton = styled(Button)`
  margin-bottom: 16px;
`;

const Row = styled.div`
  margin-bottom: 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const RemoveButton = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 8px;
`;

const RowText = styled.div`
  /* Align text with button */
  margin-bottom: 2px;
`;

export default AccountsModal;
