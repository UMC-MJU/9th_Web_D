import type { PaginationDTO, ResponseLpDetailDTO, ResponseLpDTO } from './../types/lp';
import { axiosInstance } from './axios';


export const getLpList = async(paginationDTO: PaginationDTO): Promise<ResponseLpDTO[]> => {
    const { data } = await axiosInstance.get(`/v1/lps`, {
        params: paginationDTO,
    })

    return data;
}

export const getLpDetail = async(lpId: number): Promise<ResponseLpDetailDTO> => {
    const { data } = await axiosInstance.get(`/v1/lps/${lpId}`)

    return data;
}