function WaningMoonIcon({ className, width = '3.2rem', height = '3.2rem', color = 'currentColor' }) {
    return (
        <svg className={className} width={width} height={height} fill={color} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M20.3019 6.38068C21.723 6.08373 22.9615 7.16986 23.009 8.50693C23.2751
        16.0034 29.4377 22 37 22C37.8141 22 38.6105 21.9307 39.3839 21.7982C40.7019 21.5723 42 22.5655 42 24C42 33.9411
        33.9411 42 24 42C14.0589 42 6 33.9411 6 24C6 15.3248 12.1351 8.0871 20.3019 6.38068ZM19.2223 10.8358C13.8426
        12.7885 10 17.9473 10 24C10 31.732 16.268 38 24 38C31.06 38 36.8994 32.7742 37.8611 25.9797C37.5756 25.9932
        37.2886 26 37 26C28.0237 26 20.5827 19.4301 19.2223 10.8358Z"></path>
        </svg>);
}

export default WaningMoonIcon;