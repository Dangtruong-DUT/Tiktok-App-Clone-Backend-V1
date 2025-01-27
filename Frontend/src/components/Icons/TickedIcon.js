function TickedIcon({ className, width = '1em', height = '1em', color = 'currentColor' }) {
    return (
        <svg className={className} width={width} height={height} fill={color}  viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" >
            <path fillRule="evenodd" clipRule="evenodd" d="M43 6.08c.7.45 1.06.67 1.25.98.16.27.23.59.2.9-.03.36-.26.72-.7 
            1.43L23.06 42.14a3.5 3.5 0 0 1-5.63.39L4.89 27.62c-.54-.64-.81-.96-.9-1.32a1.5 1.5 0 0 1 .09-.92c.14-.33.46-.6 1.1-1.14l1.69-1.42c.64-.54.96-.81
            1.31-.9.3-.06.63-.04.92.09.34.14.6.46 1.15 1.1l9.46 11.25 18.11-28.7c.45-.72.68-1.07.99-1.26.27-.16.59-.23.9-.2.36.03.71.25 1.43.7L43 6.08Z"></path>
        </svg>
    );
}

export default TickedIcon;