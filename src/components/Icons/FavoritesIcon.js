function FavoritesIcon({ className, width = '2.4rem', height = '2.4rem', color = 'currentColor', rotate = '0deg' }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} rotate={rotate} width={width} height={height} fill={color}>
            <path fill={color} d="M4 4.5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v15.13a1 1 0 0 1-1.555.831l-6.167-4.12a.5.5 0 0 0-.556 0l-6.167 4.12A1 1 0 0 1 4 19.63z"></path>
            <path fill={color} fillOpacity=".03" d="M4.032 4.144Q4 4.317 4 4.5v15.13a1 1 0 0 0 1.555.831l6.167-4.12a.5.5 0 0 1 .41-.066l-.427-.198a1.49 1.49 0 0
            0-1.377.063c-.581.339-1.45.85-2.25 1.339-.59.359-1.427.695-2.187.962-.929.325-1.86-.387-1.86-1.37zm8.251 12.202 6.162 4.115A1 1 0 0 0 20 19.63V4.5a2 2 0 0 
            0-1.123-1.798c.21.254.334.58.33.936a117 117 0 0 1-.896 13.408c-.124.99-1.17 1.553-2.076 1.133z"></path>
        </svg>
    );
}

export default FavoritesIcon;