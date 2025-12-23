import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    console.error('Error stack:', error.stack)
    console.error('Component stack:', errorInfo.componentStack)
    console.error('Error name:', error.name)
    console.error('Error message:', error.message)
    
    // Log user agent for debugging
    if (typeof navigator !== 'undefined') {
      console.error('User agent:', navigator.userAgent)
      console.error('Platform:', navigator.platform)
    }
    
    this.setState({
      error,
      errorInfo,
    })

    // Log to analytics if available
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exception', {
        description: error.toString(),
        fatal: false,
      })
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary__content">
            <h1>Something went wrong</h1>
            <p>We encountered an unexpected error. Don't worry, your data is safe.</p>
            <div className="error-boundary__actions">
              <button className="button button--primary" onClick={this.handleReset}>
                Return Home
              </button>
              <button
                className="button button--ghost"
                onClick={() => window.location.reload()}
              >
                Reload Page
              </button>
            </div>
            {this.state.error && (
              <details className="error-boundary__details" open>
                <summary>Error Details (Click to expand)</summary>
                <div style={{ marginTop: '1rem' }}>
                  <strong>Error:</strong>
                  <pre style={{ background: '#1e1e1e', padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
                    {this.state.error.toString()}
                  </pre>
                  {this.state.error.stack && (
                    <>
                      <strong>Stack Trace:</strong>
                      <pre style={{ background: '#1e1e1e', padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px' }}>
                        {this.state.error.stack}
                      </pre>
                    </>
                  )}
                  {this.state.errorInfo && this.state.errorInfo.componentStack && (
                    <>
                      <strong>Component Stack:</strong>
                      <pre style={{ background: '#1e1e1e', padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px' }}>
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </>
                  )}
                  {typeof navigator !== 'undefined' && (
                    <>
                      <strong>Browser Info:</strong>
                      <pre style={{ background: '#1e1e1e', padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px' }}>
                        User Agent: {navigator.userAgent}
                        Platform: {navigator.platform}
                      </pre>
                    </>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
