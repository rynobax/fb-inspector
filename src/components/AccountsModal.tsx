import React from 'react';
import { Dialog } from '@reach/dialog';
import styled from 'sc';

import Add from 'icons/Add';

import { openOathRegister } from 'services/google';
import { useSettings } from 'hooks/settings';
import Button from 'components/Button';
import Refresh from 'icons/Refresh';

interface AccountsModalProps {
  open: boolean;
  onClose: () => void;
}

const AccountsModal: React.FC<AccountsModalProps> = props => {
  const [settings, { refreshProjects }] = useSettings();
  const { accounts, projects } = settings;
  return (
    <AddDialog isOpen={props.open} onDismiss={props.onClose}>
      <HeaderLabel>Accounts</HeaderLabel>
      {accounts.length === 0 && <div>No accounts!</div>}
      {accounts.map(account => {
        return <Account key={account.id}>{account.email}</Account>;
      })}
      <StyledButton Icon={Add} onClick={openOathRegister}>
        Add Account
      </StyledButton>
      <HeaderLabel>Projects</HeaderLabel>
      {projects.length === 0 && <div>No projects!</div>}
      {projects.map(project => {
        return <Account key={project.id}>{project.name}</Account>;
      })}
      <StyledButton Icon={Refresh} onClick={refreshProjects}>
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

const Account = styled.div`
  margin-bottom: 16px;
`;

export default AccountsModal;
