import { useEffect, useState } from 'react'

// breakpoints match the rest of the layout (App.css)
const queries = ['(max-width: 560px)', '(max-width: 900px)'] as const

const getCount = () => {
    if (window.matchMedia(queries[0]).matches) return 1
    if (window.matchMedia(queries[1]).matches) return 2
    return 3
}

/** Responsive masonry column count: 3 / 2 (≤900px) / 1 (≤560px). */
const useColumnCount = () => {
    const [count, setCount] = useState(getCount)

    useEffect(() => {
        const lists = queries.map((q) => window.matchMedia(q))
        const update = () => setCount(getCount())
        lists.forEach((l) => l.addEventListener('change', update))
        return () => lists.forEach((l) => l.removeEventListener('change', update))
    }, [])

    return count
}

export default useColumnCount
