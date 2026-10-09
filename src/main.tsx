import { Component, StrictMode, type ErrorInfo, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router'
import './index.css'
import App from './App.tsx'

/** TEMPORARY — paired with the debug reporter in index.html. Remove both together. */
declare global {
    interface Window {
        __report?: (label: string, detail: string) => void
    }
}

type BoundaryProps = { children: ReactNode }
type BoundaryState = { failed: boolean }

/** TEMPORARY — surfaces render-time crashes on devices with no console. */
class DebugBoundary extends Component<BoundaryProps, BoundaryState> {
    state: BoundaryState = { failed: false }

    static getDerivedStateFromError(): BoundaryState {
        return { failed: true }
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        window.__report?.(
            'React render error',
            `${error.message}\n\n${error.stack ?? ''}\n${info.componentStack ?? ''}`,
        )
    }

    render() {
        return this.state.failed ? null : this.props.children
    }
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <DebugBoundary>
            <HashRouter>
                <App />
            </HashRouter>
        </DebugBoundary>
    </StrictMode>,
)
