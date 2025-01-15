function DownloadIcon({ className, width = '1em', height = '1em', color = 'currentColor', rotate = '0deg' }) {
    return (
        <svg  viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className={className} style={{ transform: `rotate(${rotate})` }} width={width} height={height} fill={color} >
            <path d="M21.9 7.38v19.86l-6.73-6.73a.87.87 0 0 0-1.24 0l-1.73 1.73a.88.88 0 0 0 0 1.24l11.18 11.18c.34.35.9.35 
            1.24 0L35.8 23.48a.88.88 0 0 0 0-1.24l-1.73-1.73a.87.87 0 0 0-1.24 0l-6.73 6.73V7.38c0-.49-.4-.88-.87-.88h-2.45c-.49 0-.88.4-.88.88ZM10.88 37.13c-.49
            0-.88.39-.88.87v2.63c0 .48.4.87.88.87h26.24c.49 0 .88-.4.88-.87V38c0-.48-.4-.87-.87-.87H10.86Z"></path>
        </svg>
    );
}

export default DownloadIcon;