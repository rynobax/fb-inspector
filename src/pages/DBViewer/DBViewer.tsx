import React from 'react';
import styled from 'styled-components';
import { RouteComponentProps } from '@reach/router';

import Header from './Header';

import Body from './Body';
import FirebaseErrorBoundary from './FirebaseErrorBoundary';

type DBViewerProps = RouteComponentProps<{ projectId: string }>;

const DBViewer: React.FC<DBViewerProps> = (props) => {
  return (
    <Container>
      <HeaderContainer>
        <Header />
      </HeaderContainer>
      <BodyContainer>
        <FirebaseErrorBoundary>
          <Body />
        </FirebaseErrorBoundary>
      </BodyContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const HeaderContainer = styled.div`
  flex: 0;
`;

const BodyContainer = styled.div`
  width: 100%;
  max-width: 600px;
  margin: auto;
  flex: 1;
  display: flex;
`;

export default DBViewer;
