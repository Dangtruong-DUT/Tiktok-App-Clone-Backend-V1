function ShareIcon({ className, width = '2.4rem', height = '2.4rem', color = 'currentColor', rotate = '0deg', bold = true }) {
    return (
        bold ?
            <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" className={className} style={{ transform: `rotate(${rotate})` }} width={width} height={height} fill={color}>
                <path fill="currentColor" fillRule="evenodd" d="M10.938 3.175a.674.674 0 0 1
            1.138-.488l6.526 6.215c.574.547.554 1.47-.043 1.991l-6.505 5.676a.674.674 0 0
            1-1.116-.508V13.49s-6.985-1.258-9.225 2.854c-.209.384-1.023.518-.857-1.395.692-3.52
            2.106-9.017 10.082-9.017z" clipRule="evenodd"></path>
                <path fill="#161823" fillRule="evenodd" d="m15.754 6.212 1.295 2.59a1.12 1.12 0 0
            1-.268 1.349l-5.799 5.042s-.28 1.403.562 1.403 7.578-6.174 
            7.578-6.174.28-.842-.561-1.684c-.843-.842-2.807-2.526-2.807-2.526" clipRule="evenodd" opacity=".03"></path>
                <path fill="url(#pc-share-078b3fae_a)" fillRule="evenodd" d="M10.937 6.23v7.297s-6.683-.942-8.777 2.246C.146 
            18.839.331 12.309 3.363 9.057s7.574-2.827 7.574-2.827" clipRule="evenodd" opacity=".09"></path><defs>
                    <radialGradient id="pc-share-078b3fae_a" cx="0" cy="0" r="1" gradientTransform="rotate(-113.046 11.628 5.43)scale(8.93256 8.78076)" gradientUnits="userSpaceOnUse">
                        <stop></stop><stop offset=".995" stopOpacity=".01"></stop><stop offset="1" stopOpacity=".01"></stop></radialGradient></defs>
            </svg >
            :
            <svg className={className} style={{ transform: `rotate(${rotate})` }} width={width} height={height} fill={color} color="inherit" fontSize="inherit" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.68 3.18a2 2 0 0 1 2.14.32l21.5 19a2 2 0 0 1-.02 3.02l-21.5 18.5a2 2 0 0 1-3.3-1.52v-9.97c-5.68.28-11.95 1.75-16.09 5.88A2 2 0 0
                1 1 37c0-11.68 7.7-21.05 19.5-21.94V5a2 2 0 0 1 1.18-1.82ZM24.5 30.5v7.64l16.46-14.16L24.5 9.44V17a2 2 0 0 1-2.05 2c-8.4-.21-15.62
                5.34-17.09 13.66 4.47-2.7 9.8-3.87 14.98-4.13.68-.03 1.22-.04 1.6-.04 1.19 0 2.56.26 2.56 2.01Z"></path>
            </svg>

    );
}

export default ShareIcon;