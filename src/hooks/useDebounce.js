import PropTypes from "prop-types";
import { useState, useEffect } from "react";
function useDebounce(value, delay = 300) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay || 300);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
}

useDebounce.propTypes = {
    value: PropTypes.any.isRequired,
    delay: PropTypes.number
};

export default useDebounce;