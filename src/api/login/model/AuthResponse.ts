import {ApiResponse} from '../../model/ApiResponse';
import {AuthResultCode} from './AuthResultCode';

class AuthResponse implements ApiResponse{

    constructor(
        public resultCode:AuthResultCode,
        public data:any
    ){}
    
}

export {AuthResponse }