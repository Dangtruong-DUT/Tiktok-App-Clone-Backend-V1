function horizontalThreeDotIcon({ className, width = '3.2rem', height='3.2rem' , color = 'currentColor' }) {
    return (
        <svg fill={color} viewBox="-9 0 68 48" xmlns="http://www.w3.org/2000/svg"  className={className} width={width} height={height}>
            <path d="M5 24a4 4 0 1 1 8 0 4 4 0 0 1-8 0Zm15 0a4 4 0 1 1 8 0 4 4 0 0 1-8 0Zm15 0a4 4 0 1 1 8 0 4 4 0 0 1-8 0Z"></path>
        </svg>
    );
}

export default horizontalThreeDotIcon;