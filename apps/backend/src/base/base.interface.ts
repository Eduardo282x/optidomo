export class BaseResponse {
    message: string;
    success: boolean;
    data?: any;
}

export class BaseResponseLogin extends BaseResponse {
    userData: any;
}

export const baseResponse: BaseResponse = {
    message: '',
    success: true,
    data: null
}

export const badResponse: BaseResponse = {
    message: '',
    success: false,
}