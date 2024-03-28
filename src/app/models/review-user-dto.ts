export interface ReviewUserDTO {
    id?:number;
    productID?:number;
    userName:string;
    userID?:string;
    rating?:number;
    comment?:string;
    datePosted?:Date;
}