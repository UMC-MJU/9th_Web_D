import type { CursorBasedResponse, ResponseLikes, PaginationDTO, ResponseLpDetailDTO, ResponseLpDTO } from './../types/lp';
import { axiosInstance } from './axios';

export const getLpList = async(paginationDTO: PaginationDTO): Promise<CursorBasedResponse<ResponseLpDTO[]>> => {
    const { data } = await axiosInstance.get(`/v1/lps`, {
        params: paginationDTO,
    })

    return data;
}

export const getLpDetail = async(lpId: number): Promise<ResponseLpDetailDTO> => {
    const { data } = await axiosInstance.get(`/v1/lps/${lpId}`)

    return data;
}

export const like = async(lpId: number): Promise<ResponseLikes> => {
    const response = await axiosInstance.post(`/v1/lps/${lpId}/likes`);
    
    return response.data;
} ;