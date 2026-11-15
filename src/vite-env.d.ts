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
