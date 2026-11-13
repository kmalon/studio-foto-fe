import { useSyncExternalStore } from 'react'

// breakpoints match the rest of the layout (App.css)
const queries = ['(max-width: 560px)', '(max-width: 900px)'] as const

const getCount = () => {
    if (window.matchMedia(queries[0]).matches) return 1
    if (window.matchMedia(queries[1]).matches) return 2
    return 3
}

const subscribe = (onChange: () => void) => {
    const lists = queries.map((q) => window.matchMedia(q))
    lists.forEach((l) => l.addEventListener('change', onChange))
    return () => lists.forEach((l) => l.removeEventListener('change', onChange))
}

/**
 * Responsive masonry column count: 3 / 2 (≤900px) / 1 (≤560px).
 * Server snapshot = 3: prerendered HTML and hydration agree, React re-renders
 * with the real count right after hydrating.
 */
const useColumnCount = () => useSyncExternalStore(subscribe, getCount, () => 3)

export default useColumnCount
