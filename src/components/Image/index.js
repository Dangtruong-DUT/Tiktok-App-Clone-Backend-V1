import images from "@/assets/images";
import { useState } from "react";

function Image({ src, ...props }) {
    const [fallBack, setFallBack] = useState('');
    const handleImageError = () => {
        setFallBack(images.noImage);
    }

    return (
        <img src={fallBack || src} {...props} onError={handleImageError} />
    );
}

export default Image;