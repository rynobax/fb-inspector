import React from 'react';
import { HTTPError } from 'ky';

type LOL = typeof HTTPError;

function getErrorMessage(error: Error) {
  if (error instanceof HTTPError) {
    return 'Ryan look at getErrorMessage';
    // const { statusCode, statusMessage } = error;
    // switch (statusCode) {
    //   case 401:
    //     return `Got 401: ${statusMessage}.  Check the project settings.`;
    //   default:
    //     return `Unexpected error (${statusCode}): ${statusMessage}`;
    // }
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
      const errorMsg = getErrorMessage(error);
      this.setState({ errorMsg });
    } else {
      console.log('Got non http error, rethrowing');
      throw error;
    }
  }

  render() {
    const { errorMsg } = this.state;
    if (errorMsg) {
      return <div>{errorMsg}</div>;
    }

    return this.props.children;
  }
}

export default FirebaseErrorBoundary;
