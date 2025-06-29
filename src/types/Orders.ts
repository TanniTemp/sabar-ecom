import { Address } from "./Address";
import { Product } from "./product";



export default interface Orders{
    id:string,
    user_id:string,
    address:Address,
    items:Product[],
    total_amount:number,
    currency:string,
   payment_status:string
    order_status:string,
    payment_method:string,
    payment_id:string,
    order_id:string
    created_at:string,

}