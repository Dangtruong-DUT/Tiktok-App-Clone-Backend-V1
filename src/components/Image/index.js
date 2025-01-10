import images from "@/assets/images";
import { useState } from "react";

function Image({ src, fallBack: customFallBack = images.noImage, ...props }) {
    const [fallBack, setFallBack] = useState('');
    const handleImageError = () => {
        setFallBack(customFallBack);
    }

    return (
        <img src={fallBack || src} {...props} onError={handleImageError} />
    );
}

export default Image;