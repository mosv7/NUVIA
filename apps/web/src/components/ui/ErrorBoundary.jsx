import { Component } from 'react';
import { PageFailure } from './PageState.jsx';
export default class ErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  reset = () => this.setState({ failed: false });
  componentDidMount() {
    window.addEventListener('hashchange', this.reset);
  }
  componentWillUnmount() {
    window.removeEventListener('hashchange', this.reset);
  }
  retry = () => {
    // A rejected React.lazy import is cached; a reload retries its network request.
    if (this.props.onRetry) {
      this.props.onRetry();
      this.reset();
    } else window.location.reload();
  };
  render() {
    return this.state.failed ? <PageFailure onRetry={this.retry} /> : this.props.children;
  }
}
