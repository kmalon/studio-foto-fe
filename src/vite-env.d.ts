/// <reference types="vite/client" />

interface ImportMetaEnv {
    /** GA4 Measurement ID; empty disables analytics and the cookie banner. */
    readonly VITE_GA_ID?: string
    /** Web3Forms access key for the contact form. */
    readonly VITE_WEB3FORMS_KEY?: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}

/** Alt texts from the assets dir (`@assets` alias = src/assets or external ASSETS_DIR, see vite.config.ts). */
declare module '@assets/altText.ts' {
    const altText: Record<string, string>
    export default altText
}
