import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, userMessage: '', messageColor: '' };
  }

  static getDerivedStateFromError(error) {
    let userMessage = 'Something went wrong.';
    let messageColor = 'text-yellow-600';

    const errorMsg = error?.message?.toLowerCase() || '';

    if (errorMsg.includes('network') || errorMsg.includes('failed to fetch')) {
      userMessage = 'Network error. Please check your internet connection.';
      messageColor = 'text-red-500';
    } else if (errorMsg.includes('500') || errorMsg.includes('internal server')) {
      userMessage = 'Server error. Please try again later.';
      messageColor = 'text-red-500';
    } else if (errorMsg.includes('404')) {
      userMessage = 'Requested resource not found.';
      messageColor = 'text-orange-500';
    } else if (errorMsg.includes('unauthorized') || errorMsg.includes('401')) {
      userMessage = 'Unauthorized access. Please login again.';
      messageColor = 'text-pink-600';
    } else if (errorMsg.includes('timeout')) {
      userMessage = 'Request timed out. Please try again.';
      messageColor = 'text-red-500';
    }

    return {
      hasError: true,
      userMessage,
      messageColor,
    };
  }

  handleRefresh = () => {
    window.location.reload();
  };

  render() {
    const { hasError, userMessage, messageColor } = this.state;
    const { isLightMode, children } = this.props;

    const bgColor = isLightMode ? 'bg-neutral-100 text-gray-900' : 'bg-[#0a0a0a] text-white';
    const borderColor = isLightMode ? 'border-gray-200 bg-white' : 'border-[#444] bg-[#1a1a1a]';
    const activeState = isLightMode ? 'active:bg-gray-200' : 'active:bg-zinc-800';

    if (hasError) {
      return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center px-6 ${bgColor}`}>
          <div className={`border rounded-xl p-6 max-w-md w-full shadow-xl text-center ${borderColor}`}>
            <h2 className={`text-xl font-semibold mb-3 ${messageColor}`}>
              {userMessage}
            </h2>
            <p className="text-sm mb-6 opacity-90">
              If this issue is temporary, try refreshing the page. If the problem persists, please wait until it's resolved.
            </p>
            <button
              onClick={this.handleRefresh}
              className={`px-4 py-2 rounded-md font-semibold cursor-pointer ${activeState}`}
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
