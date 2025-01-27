function SearchIcon({ className, width = '3.2rem', height = '3.2rem', color = 'currentColor' }) {
    return (
        <svg className={className} width={width} height={height} viewBox="0 0 48 48" fill={color} xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M21.83 7.5a14.34 14.34 0 1 1 0 28.68 14.34 14.34 0 0 1 0-28.68Zm0-4a18.33 18.33 
          0 1 0 11.48 32.64l8.9 8.9a1 1 0 0 0 1.42 0l1.4-1.41a1 1 0 0 0 0-1.42l-8.89-8.9A18.34 18.34 0 0 0 21.83 3.5Z"></path>
        </svg>
    )
}

export default SearchIcon;