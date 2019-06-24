import React from 'react';

interface Props {}

interface State {
  error: Error | null;
}

class TopLevelErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { error };
  }

  componentDidCatch(error: Error, info: any) {
    // You can also log the error to an error reporting service
    console.error(error, info);
  }

  render() {
    const { error } = this.state;
    if (error) {
      // You can render any custom fallback UI
      return <pre>{error.toString()}</pre>;
    }

    return this.props.children;
  }
}

export default TopLevelErrorBoundary;
