import React, { useState } from 'react';
import { Dialog } from '@reach/dialog';
import styled from 'sc';

import { openOathRegister } from 'services/google';
import { useSettings } from 'hooks/settings';

import Button from 'components/Button';

import Add from 'icons/Add';
import Refresh from 'icons/Refresh';
import Close from 'icons/Close';
import Hidden from 'icons/Hidden';
import Visible from 'icons/Visible';

interface AccountsModalProps {
  open: boolean;
  onClose: () => void;
}

const AccountsModal: React.FC<AccountsModalProps> = props => {
  const { settings, actions } = useSettings();
  const { accounts, projects } = settings;

  const [showHidden, setShowHidden] = useState(false);

  const visibleProjects = projects.filter(p => showHidden || !p.hidden);

  return (
    <AddDialog isOpen={props.open} onDismiss={props.onClose}>
      <HeaderLabel>Linked Accounts</HeaderLabel>
      {projects.length > 0 && (
        <Row>
          <ShowLink onClick={() => setShowHidden(!showHidden)}>
            {showHidden ? 'Hide' : 'Show'} hidden projects
          </ShowLink>
        </Row>
      )}
      {accounts.map(account => {
        const accountProjects = visibleProjects.filter(
          p => p.ownerUserId === account.id
        );
        return (
          <AccountSection key={account.id}>
            <AccountRow>
              <AccountText>{account.email}</AccountText>
              <IconButton onClick={() => actions.removeUser(account.id)}>
                <Close size={24} />
              </IconButton>
            </AccountRow>
            {accountProjects.map(project => {
              return (
                <ProjectRow key={project.id}>
                  <RowText>{project.name}</RowText>
                  <IconButton
                    onClick={() =>
                      project.hidden
                        ? actions.showProject(project.id)
                        : actions.hideProject(project.id)
                    }
                  >
                    {project.hidden ? (
                      <Hidden size={16} />
                    ) : (
                      <Visible size={16} />
                    )}
                  </IconButton>
                </ProjectRow>
              );
            })}
          </AccountSection>
        );
      })}
      <StyledButton Icon={Add} onClick={openOathRegister}>
        Link Additional Account
      </StyledButton>
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
  color: ${p => p.theme.color.text.dark};
  font-size: ${p => p.theme.font.size[36]};
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

const AccountRow = styled(Row)``;

const ProjectRow = styled(Row)``;

const IconButton = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 8px;
`;

const RowText = styled.div`
  /* Align text with button */
  margin-bottom: 2px;
`;

const AccountText = styled(RowText)`
  color: ${p => p.theme.color.text.dark};
  font-weight: ${p => p.theme.font.weight.bold};
`;

const ShowLink = styled.button`
  color: ${p => p.theme.color.text.light};
  font-size: ${p => p.theme.font.size[14]};
`;

const AccountSection = styled.div`
  margin-bottom: 42px;
`;

export default AccountsModal;
