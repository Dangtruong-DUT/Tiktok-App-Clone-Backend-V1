import * as request from '@/Utils/http';

export const search = async(query, type= 'less') => {
    try {
        const response = await request.get('users/search', {
            params:  {
                q: query,
                type: type,
            }
        });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}