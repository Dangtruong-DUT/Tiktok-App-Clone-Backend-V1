import * as httpRequest from '@/utils/httpRequest';

export const getUserVideos = async (username) => {
    try {
        const response = await httpRequest.get(`users/${username}`);
        return response;
    } catch (error) {
        console.error('Error fetching user videos:', error);
        return null;
    }
};