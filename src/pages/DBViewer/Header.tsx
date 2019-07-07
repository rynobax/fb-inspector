import React, { useState } from 'react';
import styled from 'styled-components';
import { Menu, MenuList, MenuButton, MenuItem } from '@reach/menu-button';

import { useProject } from 'hooks/project';

import ChevronDown from 'icons/ChevronDown';
import Add from 'icons/Add';
import Edit from 'icons/Edit';

import AddProject from './AddProject';

type OpenValues = 'closed' | 'editing' | 'adding';

interface HeaderProps {}

const Header: React.FC<HeaderProps> = props => {
  const { projects, project, selectProject } = useProject();
  const [modal, setModal] = useState<OpenValues>('closed');

  const open = modal !== 'closed';

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
                project && project.__id === p.__id ? '> ' : '';
              return (
                <MenuItem key={p.id} onSelect={() => selectProject(p.id)}>
                  {selectedMark}{p.name}
                </MenuItem>
              );
            })}
            <MenuItem onSelect={() => setModal('editing')}>
              <div style={{ width: 3 }} />
              <Edit size={18} />
              <div style={{ width: 3 }} />
              Edit Selected Project
            </MenuItem>
            <MenuItem onSelect={() => setModal('adding')}>
              <Add size={24} />
              New Project
            </MenuItem>
          </MenuList>
        </Menu>
      </Content>
      {open && (
        <AddProject
          open={open}
          close={() => setModal('closed')}
          editing={modal === 'editing'}
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
