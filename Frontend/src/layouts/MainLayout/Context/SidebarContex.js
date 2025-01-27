import { createContext, useContext, useState, useEffect } from "react";

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
    const [isOpenDrawerSidebar, setOpenDrawerSidebar] = useState(false);
    const [isSmall, setIsSmall] = useState(window.innerWidth <= 991);

    useEffect(() => {
        const handleResize = () => {
            if (!isOpenDrawerSidebar) {
                const isSmallScreen = window.innerWidth <= 991;
                setIsSmall(isSmallScreen);
            }
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [isOpenDrawerSidebar]);

    const setSideBarSmallSize = (isOpen) => {
        setOpenDrawerSidebar(isOpen);
        if (isOpen) {
            setIsSmall(true); 
        } else {
            setIsSmall(window.innerWidth <= 991); 
        }
    };

    return (
        <SidebarContext.Provider value={{ isSmall, isOpenDrawerSidebar, setSideBarSmallSize }}>
            {children}
        </SidebarContext.Provider>
    );
};

export const useSidebar = () => {
    return useContext(SidebarContext);
};
