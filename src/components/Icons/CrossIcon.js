function CrossIcon({ className, width = '3.2rem', height='3.2rem' , color = 'currentColor' }) {
    return (
        <svg fill= {color} color="inherit" fontSize="16" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className={className} width={width} height={height}>
            <path d="M38.7 12.12a1 1 0 0 0 0-1.41l-1.4-1.42a1 1 0 0 0-1.42 0L24 21.17 12.12 9.3a1 1 0 0 0-1.41 0l-1.42 1.42a1 1 0 0 0 0 1.41L21.17
             24 9.3 35.88a1 1 0 0 0 0 1.41l1.42 1.42a1 1 0 0 0 1.41 0L24 26.83 35.88 38.7a1 1 0 0 0 1.41 0l1.42-1.42a1 1 0 0 0 0-1.41L26.83 24 38.7 12.12Z"></path>
        </svg>
    );
}

export default CrossIcon;