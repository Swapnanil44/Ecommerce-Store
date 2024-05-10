import db from "@/db/db"
import { notFound } from "next/navigation"
import Stripe from "stripe"
import { CheckoutForm } from "./_components/CheckoutForm"




const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export default async  function PurchasePage({
    params: {id}
}:{
    params:{id : string}
}){
    const product = await db.product.findUnique({
        where:{id}
    })

    if (product === null) return notFound()

    const paymentIntent = await stripe.paymentIntents.create({
        amount: product.priceInCents,
        currency: "INR",
        description: process.env.STRIPE_PAYMENT_DESCRIPTION ?? '',
        metadata: {productId: product.id},
        shipping: {
            name: "Random singh",
            address: {
              line1: "510 Townsend St",
              postal_code: "98140",
              city: "San Francisco",
              state: "CA",
              country: "US",
            },
          },
      
    })

    if(paymentIntent.client_secret == null){
        throw Error("stripe failed to create payment intent")
    }

    return <CheckoutForm
            product={product} 
            clientSecret = {paymentIntent.client_secret}
            />
}

// payment_method
// : 
// allow_redisplay
// : 
// "unspecified"
// billing_details
// : 
// address
// : 
// city
// : 
// null
// country
// : 
// "IN"
// line1
// : 
// null
// line2
// : 
// null
// postal_code
// : 
// null
// state
// : 
// null
// [[Prototype]]
// : 
// Object
// email
// : 
// "veelmle@efoe.com"
// name
// : 
// null
// phone
// : 
// null