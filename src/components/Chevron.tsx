const Chevron = ({ dir }: { dir: 'left' | 'right' }) => (
    <svg viewBox="0 0 24 48" aria-hidden="true">
        <path d={dir === 'left' ? 'M20 2 4 24l16 22' : 'M4 2l16 22L4 46'} />
    </svg>
)

export default Chevron
