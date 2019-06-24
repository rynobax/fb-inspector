import React, { useState } from 'react';
import styled from 'styled-components';
import { Menu, MenuList, MenuButton, MenuItem } from '@reach/menu-button';

import { useProject } from 'hooks/project';

import ChevronDown from 'icons/ChevronDown';
import Add from 'icons/Add';

import AddProject from './AddProject';

interface HeaderProps {}

const Header: React.FC<HeaderProps> = props => {
  const { projects, project, selectProject } = useProject();
  const [addOpen, setAddOpen] = useState(true);
  return (
    <Bar>
      <Content>
        <Menu>
          <ProjectButton>
            {project ? project.name : 'Select a Project'}
            <ChevronDown size={24} />
          </ProjectButton>
          <MenuList className="slide-down">
            {projects.map(p => (
              <MenuItem key={p.id} onSelect={() => selectProject(p.id)}>
                {p.name}
              </MenuItem>
            ))}
            <MenuItem onSelect={() => setAddOpen(true)}>
              <Add size={24} />
              Add Project
            </MenuItem>
          </MenuList>
        </Menu>
      </Content>
      <AddProject open={addOpen} close={() => setAddOpen(false)} />
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
`;

export default Header;
