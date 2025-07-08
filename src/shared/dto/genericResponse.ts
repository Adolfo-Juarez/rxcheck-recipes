export default interface GenericResponse<T>{
    message: string;
    success: boolean;
    error?: string;
    data?: T;
}