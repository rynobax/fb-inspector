import React from 'react';
import styled from 'styled-components';
import { Menu, MenuList, MenuButton, MenuItem } from '@reach/menu-button';
import { useProject } from 'hooks/project';
import ChevronDown from 'icons/ChevronDown';
import Add from 'icons/Add';

interface HeaderProps {}

const Header: React.FC<HeaderProps> = props => {
  const { projects, project, selectProject } = useProject();
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
            <MenuItem onSelect={() => console.log('add')}>
              <Add size={24} />
              Add Project
            </MenuItem>
          </MenuList>
        </Menu>
      </Content>
    </Bar>
  );
};

const ProjectButton = styled(MenuButton)`
  background: white;
  border: none;
  outline: none;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Bar = styled.div`
  height: 64px;
`;

const Content = styled.div`
  max-width: 600px;
  margin: auto;
`;

export default Header;
