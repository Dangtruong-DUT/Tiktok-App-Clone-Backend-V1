function InforIcon({ className, width = '1em', height = '1em', color = 'currentColor', rotate = '0deg' }) {
    return ( 
        <svg  viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className={className} style={{ transform: `rotate(${rotate})` }} width={width} height={height} fill={color}>
            <path d="M24 6a18 18 0 1 0 0 36 18 18 0 0 0 0-36ZM2 24a22 22 0 1 1 44 0 22 22 0 0 1-44 0Zm25-8a3 3 0 1 1-6 0 3 3 
            0 0 1 6 0Zm-4 6a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V23a1 1 0 0 0-1-1h-2Z"></path>
        </svg>
     );
}

export default InforIcon;
