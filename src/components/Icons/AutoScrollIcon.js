function AutoScrollIcon({ className, width = '1rem', height = '1rem', color = 'currentColor', rotate ='0deg' }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} style={{ transform: `rotate(${rotate})` }} width={width} height={height} fill={color} >
            <path d="M22.77 2.46 3.59 17.42A2 2 0 0 0 4.82 21H17.5v4a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4h12.68a2 2 0 0 0 1.23-3.58L25.23 2.46a2 2 0 0 0-2.46 0M17.5 
            31a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1zm0 10a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v3a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2z"></path>
        </svg>
    );
}

export default AutoScrollIcon;