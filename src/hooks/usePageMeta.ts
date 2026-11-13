import { useEffect } from 'react'

const SITE = 'Studio Foto'

/**
 * Per-route document title + meta description (SEO).
 * Updates the tags already in index.html instead of adding new ones,
 * so there is never more than one <title> / description in <head>.
 */
const usePageMeta = (title: string, description?: string) => {
    useEffect(() => {
        document.title = `${title} — ${SITE}`
        if (description) {
            document
                .querySelector('meta[name="description"]')
                ?.setAttribute('content', description)
        }
    }, [title, description])
}

export default usePageMeta
