import React from "react";

/**
 * Converts a number to a formatted string (e.g., 1k, 1M).
 * @param {number} num - The number to format.
 * @returns {string} - Formatted string.
 */
const formatNumber = (num) => {
    if (num == null || isNaN(num)) {
        return "0"; 
      }
    if (num >= 1e9) {
        return `${(num / 1e9).toFixed(1).replace(/\.0$/, "")}B`;
    }
    if (num >= 1e6) {
        return `${(num / 1e6).toFixed(1).replace(/\.0$/, "")}M`;
    }
    if (num >= 1e3) {
        return `${(num / 1e3).toFixed(1).replace(/\.0$/, "")}k`;
    }
    return num.toString();
};

const NumberFormatter = ({ value, className }) => (
    <span className={className}>{formatNumber(value)}</span>
);

export default NumberFormatter;
