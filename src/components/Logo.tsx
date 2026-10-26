/** Monogram mark (same "S" as the favicon) + wordmark. */
const Logo = () => (
    <>
        <svg className="logo__mark" viewBox="0 0 32 32" aria-hidden="true">
            <rect x="0.5" y="0.5" width="31" height="31" fill="none" stroke="currentColor" />
            <text
                x="16"
                y="23"
                fontFamily="Cormorant Garamond, Georgia, serif"
                fontSize="20"
                fill="currentColor"
                textAnchor="middle"
            >
                S
            </text>
        </svg>
        <span className="logo__word">Studio Foto</span>
    </>
)

export default Logo
