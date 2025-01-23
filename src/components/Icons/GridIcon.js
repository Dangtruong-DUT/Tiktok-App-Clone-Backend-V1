function GridIcon({ className, width = '1em', height = '1em', color = 'currentColor' }) {
    return (
        <svg className={className} width={width} height={height} fill={color}  viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" >
            <path d="M11 8a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1h-2Zm0 18a1 1 0 0 0-1 1v12a1 1 0 0 0 1 
            1h2a1 1 0 0 0 1-1V27a1 1 0 0 0-1-1h-2ZM22 9a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V9Zm1 17a1 1 
            0 0 0-1 1v12a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V27a1 1 0 0 0-1-1h-2ZM34 9a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-2a1 1 0
            0 1-1-1V9Zm1 17a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V27a1 1 0 0 0-1-1h-2Z"></path>
        </svg>
    );
}

export default GridIcon;