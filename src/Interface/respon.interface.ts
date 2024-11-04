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
        total_page: number;
        page: number;
        total: number;
        nextPage?: number ; // Tambahkan jika diperlukan
        pageSize: number;
        previosPage?: number; // Tambahkan jika diperlukan
    };
}