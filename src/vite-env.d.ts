/// <reference types="vite/client" />

interface ImportMetaEnv {
    /** GA4 Measurement ID; empty disables analytics and the cookie banner. */
    readonly VITE_GA_ID?: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
