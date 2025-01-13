function MessagesIcon({ className, width = '3.2rem', height = '3.2rem', color = 'currentColor', bold = false }) {
    return (
        bold ?
            <svg className={className} width={width} height={height} fill={color} fontSize="24" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" >
                <path d="M45.73 7A2 2 0 0 0 44 6H4a2 2 0 0 0-1.48 3.35l10.44 11.47a2 2 0 0 0 2.2.52l14.49-5.5c.17-.07.25-.04.28-.03.06.02.14.08.2.2.07.1.08.2.08.27 0 
                .04-.02.12-.16.23l-11.9 10.1a2 2 0 0 0-.62 2.12l4.56 14.51a2 2 0 0 0 3.64.4L45.73 9a2 2 0 0 0 0-2Z"></path>
            </svg>
            :
            <svg className={className} width={width} height={height} fill={color}   fontSize="24" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" >
                <g clipPath="url(#Icon-Paperplane_svg__a)"><path d="M2.18 9.67A2 2 0 0 1 4 8.5h40a2 2 0 0 1 1.74 3l-20 35a2 2 0 0 1-3.65-.4l-5.87-18.6L2.49 11.82a2
            2 0 0 1-.31-2.15Zm18.2 17.72 4.15 13.15L40.55 12.5H8.41l9.98 11.41 11.71-7.2a1 1 0 0 1 1.38.32l1.04 1.7a1 1 0 0 1-.32 1.38L20.38 27.4Z"></path></g>
                <defs><clipPath id="Icon-Paperplane_svg__a"><path d="M0 0h48v48H0z"></path></clipPath></defs>
            </svg>
    );
}

export default MessagesIcon;