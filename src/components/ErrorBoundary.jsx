import React from 'react';
import { ErrorService } from '../services/errorService';
import './ErrorBoundary.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    ErrorService.log(error, 'fatal', { componentStack: info?.componentStack });
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="error-boundary">
        <div className="error-boundary-card">
          <h1>Something went wrong</h1>
          <p>The app hit an unexpected error. You can retry or reload.</p>
          <div className="error-boundary-actions">
            <button onClick={this.handleRetry}>Retry</button>
            <button onClick={() => window.location.reload()}>Reload App</button>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
