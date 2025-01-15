function FlagIcon({ className, width = '1em', height = '1em', color = 'currentColor', rotate = '0deg' }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} style={{ transform: `rotate(${rotate})` }} width={width} height={height} fill={color}>
            <path d="M9 9.31v17.75c5.27-1.73 11.45-2.05 16.16 1.31 4.03 2.88 9.52 2.01 
            13.84.32V10.94c-5.27 1.73-11.45 2.05-16.16-1.31-4-2.86-9.53-2.01-13.84-.32M43 
            8v22a2 2 0 0 1-1.1 1.79c-5.83 2.9-13.5 3.82-19.06-.16C18.8 28.75 13.32 29.6 9 31.3V44a1 1 0 0 1-1
            1H6a1 1 0 0 1-1-1V8c0-.75.44-1.45 1.1-1.79 5.75-2.87 13.62-3.73 19.06.16 4.37 3.13 10.43 2.04 14.95-.16C41.4 5.56 43 6.54 43 8"></path>
        </svg>
    );
}

export default FlagIcon;