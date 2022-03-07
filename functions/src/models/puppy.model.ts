import { Buyer } from "./buyer.model";
import { Parent } from "./parent.model";

export interface Puppy {
    puppyID: string;
    buyerID: string;
    dadID: string;
    momID: string;
    price: number;
    paidAmount: number;
    sold: boolean;
    live: boolean;
    showPrice: boolean;
    soldDate: string;
    type: string
    weight: number;
    dad: Parent;
    mom: Parent;
    buyer: Buyer;
}