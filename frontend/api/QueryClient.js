import { QueryClient } from '@tanstack/react-query';
import api from './axiosInstance';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            queryFn: async ({ queryKey }) => {
                const { data } = await api.get(queryKey[0]);
                return data;
            },
        },
    },
});