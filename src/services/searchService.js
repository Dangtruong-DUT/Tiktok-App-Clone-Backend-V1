import * as httpRequest from '@/utils/httpRequest';

export const search = async(query, type= 'less') => {
    try {
        const response = await httpRequest.get('users/search', {
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