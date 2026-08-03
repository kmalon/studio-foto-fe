import type { ReactNode } from 'react'
import Navbar from './Navbar.tsx'
import Footer from './Footer.tsx'

type PageShellProps = {
    children: ReactNode
}

const PageShell = ({ children }: PageShellProps) => (
    <>
        <Navbar />
        <main className="shell-main">{children}</main>
        <Footer />
    </>
)

export default PageShell
