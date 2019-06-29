import React from 'react';
import styled from 'styled-components';

import Header from 'components/Header';

import Body from './Body';
import FirebaseErrorBoundary from './FirebaseErrorBoundary';

function Main() {
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
}

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

export default Main;
