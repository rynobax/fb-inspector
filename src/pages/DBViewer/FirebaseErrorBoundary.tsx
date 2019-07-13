import React from 'react';
import { HTTPError } from 'ky';

async function getErrorMessage(error: Error) {
  if (error instanceof HTTPError) {
    const text = await error.response.clone().json();
    console.log(text);
    return JSON.stringify(text, null, 2);
  } else {
    throw Error();
  }
}

interface Props {}

interface State {
  errorMsg: string;
}

class FirebaseErrorBoundary extends React.Component<Props, State> {
  state: State = { errorMsg: '' };

  componentDidCatch(error: Error, info: any) {
    // You can also log the error to an error reporting service
    if (error instanceof HTTPError) {
      this.setState({ errorMsg: 'loading error' });
      getErrorMessage(error).then(msg => this.setState({ errorMsg: msg }));
    } else {
      console.log('Got non http error, rethrowing');
      throw error;
    }
  }

  render() {
    const { errorMsg } = this.state;
    if (errorMsg) {
      return <pre>{errorMsg}</pre>;
    }

    return this.props.children;
  }
}

export default FirebaseErrorBoundary;
