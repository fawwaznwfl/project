import { Injectable } from '@nestjs/common';

@Injectable()
export class TugasService {

    getList(page : number, page_size: number){
        return {
            msg : 'succes',
            filter : {
                page : page,
                page_size : page_size
            }
        }
    }
    
    getListById(id :string){
        return {
            status: 'succes',
            msg : `user dengan ${id} telah di temukan`
        }
    }
    Save(payload: any) {
        return {
            status: 'success',
            msg: 'Berhasil disimpan',
            payload: payload
          };
    }

deletId(id :string){
    return {
        status: 'succes',
        msg : `user dengan ${id} telah di hapus`
    }
}


}
