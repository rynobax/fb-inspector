import React from 'react';
import styled from 'styled-components';
import { RouteComponentProps } from '@reach/router';

import Header from './Header';

import Body from './Body';
import FirebaseErrorBoundary from './FirebaseErrorBoundary';
import { PathProvider } from 'hooks/path';

type DBViewerProps = RouteComponentProps;

const DBViewer: React.FC<DBViewerProps> = props => {
  return (
    <PathProvider uri={props.uri}>
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
    </PathProvider>
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
