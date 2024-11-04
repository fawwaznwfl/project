import { ResponPagination, ResponSucces } from "src/Interface";

class BaseResponse{
    _succes(message : string, data? : any) : ResponSucces{
        return {
            status : "Succes",
            message : message,
            data : data ||{},
        }
    }

    //tambahm method lain di sini
    _pagination(message : string, data : any, total : number, page : number, pageSize : number): ResponPagination{
        return {
            status : "Success",
            message : message,
            data : data || {},
            pagination:{
                total_page: page == 0? page + 1 : page, // Menggunakan 'total' sebagai total_page
                page: page, // Menggunakan 'page' sebagai page
                total: total, // Menggunakan 'total' sebagai total
                nextPage : page + 1 , // Menentukan nextPage
                pageSize: pageSize, // Menggunakan 'pageSize'
                previosPage : page -1 == 0? page: page - 1 // Menentukan previosPage
            }
        }
    }
}

export default BaseResponse