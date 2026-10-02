import { Component, type ReactNode } from "react";

interface SceneBoundaryProps {
  children: ReactNode;
}

interface SceneBoundaryState {
  failed: boolean;
}

export default class SceneBoundary extends Component<
  SceneBoundaryProps,
  SceneBoundaryState
> {
  state: SceneBoundaryState = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error) {
    console.error("HeroScene error:", error?.message, error?.stack);
  }

  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}