import { useState, createContext, useEffect } from 'react';
import useLocalStorage from 'use-local-storage';
import PropTypes from 'prop-types';

const ThemeContext = createContext();

function ThemeProvider({ children }) {
    const [themeMode, setThemeMode] = useLocalStorage("theme", "system");
    const [theme, setTheme] = useState(() =>
        themeMode === "system"
            ? window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light"
            : themeMode
    );

    useEffect(() => {
        const updateTheme = () => {
            const newTheme =
                themeMode === "system"
                    ? window.matchMedia("(prefers-color-scheme: dark)").matches
                        ? "dark"
                        : "light"
                    : themeMode;
            setTheme(newTheme);
            document.documentElement.className = newTheme;
        };

        updateTheme();

        if (themeMode === "system") {
            const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
            mediaQuery.addEventListener("change", updateTheme);

            return () => mediaQuery.removeEventListener("change", updateTheme);
        }
    }, [themeMode]);

    const contextValue = {
        theme,
        setThemeMode,
    };

    return (
        <ThemeContext.Provider value={contextValue}>
            {children}
        </ThemeContext.Provider>
    );
}

ThemeProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export { ThemeProvider, ThemeContext };
