import { useContext, useEffect } from 'react'
import { useLocation } from 'react-router'
import { slides } from '../data/portfolio.ts'
import { HeadContext, applyHead, type PageMeta } from '../seo/head.ts'

/** Default share image: first start slide. */
export const DEFAULT_IMAGE = slides[0]?.src ?? ''

/**
 * Per-route title, description, canonical, robots, Open Graph + Twitter tags.
 * Server (prerender): recorded into HeadContext and written into the static HTML.
 * Client: kept in sync on navigation. Renders nothing -> no hydration mismatch.
 */
const usePageMeta = (meta: PageMeta) => {
    const { pathname } = useLocation()
    const collector = useContext(HeadContext)
    if (collector) {
        collector.meta = meta
        collector.pathname = pathname
    }

    const { title, description, image, noindex } = meta
    useEffect(() => {
        applyHead({ title, description, image, noindex }, pathname, DEFAULT_IMAGE)
    }, [title, description, image, noindex, pathname])
}

export default usePageMeta
