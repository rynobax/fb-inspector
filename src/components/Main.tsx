import React from 'react';
import styled from 'styled-components';

import Header from 'components/Header';

import Body from './Body';
import FirebaseErrorBoundary from './FirebaseErrorBoundary';

function Main() {
  return (
    <>
      <Header />
      <Container>
        <FirebaseErrorBoundary>
          <Body />
        </FirebaseErrorBoundary>
      </Container>
    </>
  );
}

const Container = styled.div`
  max-width: 600px;
  margin: auto;
`;

export default Main;
