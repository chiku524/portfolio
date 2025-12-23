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
    this.setState({
      error,
      errorInfo,
    })

    // Log to analytics if available
    if (window.gtag) {
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
                <summary>Error Details</summary>
                <pre>{this.state.error.toString()}</pre>
                {this.state.errorInfo && (
                  <>
                    <pre>{this.state.errorInfo.componentStack}</pre>
                    {this.state.errorInfo.componentStack && (
                      <pre>Stack: {JSON.stringify(this.state.errorInfo, null, 2)}</pre>
                    )}
                  </>
                )}
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
