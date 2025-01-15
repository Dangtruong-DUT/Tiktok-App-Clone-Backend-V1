function CommentIcon({ className, width = '1em', height = '1em', color = 'currentColor', rotate = '0deg' }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} rotate={rotate} width={width} height={height} fill={color} >
            <path fillRule="evenodd" d="M2 21.5c0-10.22 9.88-18 22-18s22 7.78 22 18c0 5.63-3.19 
            10.74-7.32 14.8a43.6 43.6 0 0 1-14.14 9.1A1.5 1.5 0 0 1 22.5 44v-5.04C11.13 38.4 2 31.34
            2 21.5M14 25a3 3 0 1 0 0-6 3 3 0 0 0 0 6m10 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6m13-3a3 3 0 1 1-6 0 
            3 3 0 0 1 6 0" clipRule="evenodd"></path>
        </svg>
    );
}

export default CommentIcon;