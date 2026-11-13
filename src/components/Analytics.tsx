import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { loadGa, trackPage } from '../analytics/ga.ts'
import { useConsent } from '../hooks/useConsent.ts'

/**
 * GA page views for SPA navigation. Render AFTER <Routes> so page effects
 * (usePageMeta -> document.title) run first. Renders nothing (SSR-safe).
 */
const Analytics = () => {
    const { pathname } = useLocation()
    const consent = useConsent()

    useEffect(() => {
        if (consent !== 'granted') return
        loadGa()
        trackPage(window.location.pathname, document.title)
    }, [consent, pathname])

    return null
}

export default Analytics
