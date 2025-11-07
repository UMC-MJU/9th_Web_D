import type { PaginationDTO, ResponseLpListDTO } from './../types/lp';
import { axiosInstance } from './axios';


export const getLpList = async(paginationDTO: PaginationDTO): Promise<ResponseLpListDTO> => {
    const { data } = await axiosInstance.get(`/v1/lps`, {
        params: paginationDTO,
    })

    return data;
}