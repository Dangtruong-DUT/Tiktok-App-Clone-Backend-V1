import { useState, useEffect } from 'react';
import { getUserVideos } from '@/services/userService';

export const useUserData = (username) => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const fetchUserData = async () => {
            setLoading(true);
            try {
                const data = await getUserVideos(username);
                if (isMounted) {
                    setUserData(data?.data || null);
                    setError(null);
                }
            } catch (err) {
                if (isMounted) setError(err.message || 'An error occurred.');
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchUserData();

        return () => {
            isMounted = false;
        };
    }, [username]);

    return { userData, loading, error };
};
