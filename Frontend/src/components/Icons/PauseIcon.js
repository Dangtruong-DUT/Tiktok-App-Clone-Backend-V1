function PlayIcon({ className, width = '3.2rem', height = '3.2rem', color = 'currentColor' }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} width={width} height={height}   viewBox="0 0 24 24">
            <path fill={color} d="M6 19h4V5H6zm8-14v14h4V5z" />
        </svg>
    );
}

export default PlayIcon;