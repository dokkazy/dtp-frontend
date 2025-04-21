
import Checkout from "@/components/sections/checkout";


export default async function CheckoutPage({params}: {params: {id: string}}) {
  const {id} = params;
  return <Checkout itemId={id}/>
}
