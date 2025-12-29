import React from "react";
import logger from "../utils/logger";

class MyErrorBoundary extends React.Component {
  state = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    logger.error("Error Boundary caught an error:", error, errorInfo);
    
    // Store error info for display
    this.setState({
      errorInfo,
    });
    
    // TODO: Send to error tracking service (e.g., Sentry)
    // if (process.env.NODE_ENV === 'production') {
    //   Sentry.captureException(error, { extra: errorInfo });
    // }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          backgroundColor: '#f8f9fa'
        }}>
          <div style={{
            maxWidth: '600px',
            width: '100%',
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '3rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚠️</div>
            <h1 style={{ 
              fontSize: '2.4rem', 
              marginBottom: '1rem',
              color: '#1a1d23'
            }}>
              Something went wrong
            </h1>
            <p style={{ 
              fontSize: '1.6rem', 
              color: '#64748b',
              marginBottom: '2rem',
              lineHeight: '1.6'
            }}>
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={this.handleReload}
                style={{
                  padding: '1.2rem 2.4rem',
                  fontSize: '1.6rem',
                  backgroundColor: '#0F4C3A',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#1B6B52'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#0F4C3A'}
              >
                Refresh Page
              </button>
              <button
                onClick={this.handleReset}
                style={{
                  padding: '1.2rem 2.4rem',
                  fontSize: '1.6rem',
                  backgroundColor: '#E2E8F0',
                  color: '#1a1d23',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#CBD5E1'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#E2E8F0'}
              >
                Try Again
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details style={{ 
                marginTop: '2rem', 
                textAlign: 'left',
                padding: '1.5rem',
                backgroundColor: '#f1f5f9',
                borderRadius: '4px'
              }}>
                <summary style={{ 
                  cursor: 'pointer', 
                  fontWeight: '600',
                  marginBottom: '1rem'
                }}>
                  Error Details (Development Only)
                </summary>
                <pre style={{ 
                  fontSize: '1.2rem',
                  overflow: 'auto',
                  color: '#c41e3a'
                }}>
                  {this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default MyErrorBoundary;
