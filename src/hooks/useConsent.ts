import { useSyncExternalStore } from 'react'
import { getConsent, isBannerOpen, subscribe } from '../analytics/ga.ts'

/** Stored cookie choice; server/hydration snapshot = null (no window). */
export const useConsent = () => useSyncExternalStore(subscribe, getConsent, () => null)

/** Cookie banner visibility; never rendered on the server (prerendered HTML stays banner-free). */
export const useBannerOpen = () => useSyncExternalStore(subscribe, isBannerOpen, () => false)
