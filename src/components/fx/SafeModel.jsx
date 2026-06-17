import { Component } from 'react'

/**
 * Renders its children, but if a 3D model fails to load (e.g. a missing .glb
 * on a misconfigured host) it silently renders nothing instead of crashing the
 * whole WebGL canvas.
 */
export default class SafeModel extends Component {
  constructor(props) {
    super(props)
    this.state = { failed: false }
  }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(err) {
    console.warn('3D model failed to load — skipping.', err?.message || err)
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}
