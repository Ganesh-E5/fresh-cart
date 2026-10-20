import { Minus, Plus } from "lucide-react";
import useCart from "../../hooks/useCart";

function AddToCartButton({ variant }) {

    const {
        getItemQty,
        addItem,
        increment,
        decrement
    } = useCart();

    const qty = getItemQty(variant._id);

    const outOfStock = variant.qty <= 0;
    if (outOfStock) {
        return (
            <button disabled className="w-full py-1.5 rounded-lg bg-slate-200 text-slate-400 text-xs">
                Out of Stock
            </button>
        );

    }

    if(qty === 0){
        return (
            <button
                onClick={(e)=>{
                    e.stopPropagation();
                    addItem(variant);
                }}
                className="w-full py-2 rounded-lg border border-emerald-600 text-emerald-600 text-sm font-semibold hover:bg-emerald-50"
            >
                Add to Cart
            </button>
        );
    }

    return (
        <div
            onClick={(e)=>e.stopPropagation()}
            className=" flex items-center justify-between rounded-lg bg-emerald-600 text-white overflow-hidden"
        >
           <button
                onClick={(e)=>{
                    e.stopPropagation();
                    decrement(variant._id);
                }}
                className=" flex-1 py-2 flex justify-center"
            >
                <Minus size={15}/>
            </button>

            <span className=" bg-white text-black px-3">
                {qty}
            </span>

            <button
                onClick={(e)=>{
                    e.stopPropagation();
                    increment(variant._id);
                }}
                disabled={qty >= variant.qty}
                className=" flex-1 py-2 flex justify-center disabled:opacity-50 "
            >
                <Plus size={15}/>
            </button>
        </div>
    );
}


export default AddToCartButton;