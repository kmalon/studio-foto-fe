import { BRAND, LOGO_PATH } from '../seo/site.ts'

/** Line-art logo (public/logo.svg) — black on transparent, inverted in CSS for the dark theme. */
const Logo = () => <img className="logo" src={LOGO_PATH} alt={BRAND} width="1600" height="1600" />

export default Logo
