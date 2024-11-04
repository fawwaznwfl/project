import { Injectable} from '@nestjs/common';


@Injectable()
export class LatihanService {
    findAll(query: any){
        return {
            msg : "siap latihan servis",
            Param : query
        };
    }
    findDetail(id: string, name:string){
        return{
            method : 'get',
            id : id,
            name : name
        }
    }
    register(payload : any){
        return{
            method : 'get',
            payload : payload
        }

    }
}
