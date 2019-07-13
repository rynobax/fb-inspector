import React, { useState } from 'react';
import styled from 'styled-components';
import { Menu, MenuList, MenuButton, MenuItem } from '@reach/menu-button';

import { useProject } from 'hooks/project';

import ChevronDown from 'icons/ChevronDown';
import User from 'icons/User';

import AccountsModal from 'components/AccountsModal';

type OpenValues = 'closed' | 'editing' | 'adding';

interface HeaderProps {}

const Header: React.FC<HeaderProps> = props => {
  const { projects, project, selectProject } = useProject();
  const [open, setOpen] = useState(false);

  return (
    <Bar>
      <Content>
        <Menu>
          <ProjectButton>
            {project ? project.name : 'Select a Project'}
            <ChevronDown size={24} />
          </ProjectButton>
          <MenuList className="slide-down">
            {projects.map(p => {
              const selectedMark =
                project && project.id === p.id ? '> ' : '';
              return (
                <MenuItem key={p.id} onSelect={() => selectProject(p.id)}>
                  {selectedMark}{p.name}
                </MenuItem>
              );
            })}
            <MenuItem onSelect={() => setOpen(true)}>
              <User size={24} />
              Manage Accounts
            </MenuItem>
          </MenuList>
        </Menu>
      </Content>
      {open && (
        <AccountsModal
          open={open}
          onClose={() => setOpen(false)}
        />
      )}
    </Bar>
  );
};

const ProjectButton = styled(MenuButton)`
  display: flex;
  flex-direction: row;
  align-items: center;
  border: none;
  :hover {
    border: none;
  }
`;

const Bar = styled.div`
  height: 64px;
`;

const Content = styled.div`
  max-width: 600px;
  margin: auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
`;

export default Header;
