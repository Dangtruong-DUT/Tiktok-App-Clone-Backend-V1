function PlayIcon({ className, width = '3.2rem', height = '3.2rem', color = 'currentColor' }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} width={width} height={height}  viewBox="0 0 24 24">
            <path fill={color} d="M8 5v14l11-7z" />
        </svg>
    );
}

export default PlayIcon;