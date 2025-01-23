function LikeIcon({ className, width = '2.4rem', height = '2.4rem', color = 'currentColor', rotate = '0deg', unWatch = false }) {
    return (
        unWatch ?
            <svg className={className} style={{ transform: `rotate(${rotate})` }} width={width} height={height} fill={color} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.71 10.56c4.24-4.2 10.93-4.15 15.29.63 4.36-4.78 11.05-4.84 15.29-.63a10.82 10.82 0 0 1 2.82
                10.55L39.5 18.5c.06-2.1-.71-4.21-2.32-5.81-3.06-3.03-7.92-3.03-11.17.75l-.03.04-.92.91a1.5 1.5 0 0 1-2.12 
                0l-.92-.91-.03-.04c-3.25-3.78-8.11-3.78-11.17-.75a7.82 7.82 0 0 0 0 11.12L24 36.89l1.95-1.94 2.12 2.12-3.01
                3a1.5 1.5 0 0 1-2.12 0L8.71 25.93a10.82 10.82 0 0 1 0-15.38Zm33.14 21.3a16.64 16.64 0 0 0 2.25-2.68 4 4 0 0
                0 .22-.41c.04-.09.18-.4.18-.77 0-.3-.09-.56-.12-.64a8.38 8.38 0 0 0-.68-1.32c-.43-.67-1.07-1.5-1.91-2.31a11.15
                11.15 0 0 0-10.85-2.8l2.57 2.58.49-.01c2.5 0 4.4 1.14 5.71 2.4a9.87 9.87 0 0 1 1.63 2.02 13.67 13.67 0 0 1-1.6
                1.8l2.11 2.13Zm-5.84.27c-.65.24-1.33.37-2.01.37-1.95 0-3.85-1.1-5.37-2.44a13.9 13.9 0 0 1-1.97-2.14l.17-.26a9.87
                9.87 0 0 1 2.26-2.45L36 32.13Zm-9.06-9.06a12.74 12.74 0 0 0-3.17 3.89c-.06.13-.12.27-.16.4-.03.08-.12.34-.12.64
                0 .37.14.68.18.76a9.6 9.6 0 0 0 .84 1.3c.51.66 1.23 1.47 2.12 2.25 1.74 1.54 4.34 3.19 7.36 3.19 1.57 0 3.02-.44
                4.3-1.08l1.93 1.93a1 1 0 0 0 1.42 0l.7-.7a1 1 0 0 0 0-1.42L27.77 19.65a1 1 0 0 0-1.42 0l-.7.7a1 1 0 0 0 0 1.42l1.3 1.3Z"></path>
            </svg>
            :
            <svg viewBox="0 0 24 24" className={className} style={{ transform: `rotate(${rotate})` }} width={width} height={height} fill={color} xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M7.5 2.25C10.5 2.25 12 4.25 12 4.25C12 4.25 13.5 2.25 16.5
            2.25C20 2.25 22.5 4.99999 22.5 8.5C22.5 12.5 19.2311 16.0657 16.25 18.75C14.4095 20.4072 13 21.5 12 21.5C11
            21.5 9.55051 20.3989 7.75 18.75C4.81949 16.0662 1.5 12.5 1.5 8.5C1.5 4.99999 4 2.25 7.5 2.25Z"></path>
                <path fillRule="evenodd" clipRule="evenodd" d="M2.40179 12.1998C3.58902 14.6966 5.7592 16.9269 7.74989
            18.75C9.5504 20.3989 10.9999 21.5 11.9999 21.5C12.9999 21.5 14.4094 20.4072 16.2499 18.75C19.231 16.0657
            22.4999 12.5 22.4999 8.49997C22.4999 8.41258 22.4983 8.32566 22.4952 8.23923C20.5671 13.6619 13.6787 18.5
            11.75 18.5C10.3127 18.5 5.61087 15.8131 2.40179 12.1998Z" fillOpacity="0.03"></path>

                <path fillRule="evenodd" clipRule="evenodd" d="M7.5 2.25C10.5 2.25 12 4.25 12 4.25C12 4.25 13.5 2.25
            16.5 2.25C20 2.25 22.5 4.99999 22.5 8.5C22.5 12.5 19.2311 16.0657 16.25 18.75C14.4095 20.4072 13 21.5 12 21.5C11 
            21.5 9.55051 20.3989 7.75 18.75C4.81949 16.0662 1.5 12.5 1.5 8.5C1.5 4.99999 4 2.25 7.5 2.25Z"></path>
                <path fillRule="evenodd" clipRule="evenodd" d="M2.40179 12.1998C3.58902 14.6966 5.7592 16.9269 7.74989 18.75C9.5504
            20.3989 10.9999 21.5 11.9999 21.5C12.9999 21.5 14.4094 20.4072 16.2499 18.75C19.231 16.0657 22.4999 12.5 22.4999
            8.49997C22.4999 8.41258 22.4983 8.32566 22.4952 8.23923C20.5671 13.6619 13.6787 18.5 11.75 18.5C10.3127 18.5 5.61087
            15.8131 2.40179 12.1998Z" fillOpacity="0.03"></path>
                <defs><filter id="HeartFill_filter0_d" x="-0.9" y="1.05" width="25.8" height="24.05" filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>
                    <feOffset dy="1.2"></feOffset><feGaussianBlur stdDeviation="1.2"></feGaussianBlur>
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"></feColorMatrix>
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"></feBlend>
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"></feBlend></filter>
                    <clipPath id="HeartFill_clip0"><rect width="24" height="24" fill={color}></rect></clipPath></defs>
            </svg>
    );
}

export default LikeIcon;