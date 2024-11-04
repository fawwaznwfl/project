export interface ResponSucces{
    status : string,
    message : string,
    data?: any
}

export interface ResponPagination {
    status: string;
    message: string;
    data: any;
    pagination: {
        totalPage: number;
        page: number;
        total: number;
        nextPage?: number | null; // Tambahkan jika diperlukan
        pageSize: number;
        previosPage?: number | null; // Tambahkan jika diperlukan
    };
}