"use client"

import { addProduct, updateProduct } from "@/app/admin/_actions/products"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { formatCurrency } from "@/lib/formatter"
import { Product } from "@prisma/client"
import Image from "next/image"
import { useState } from "react"
import { useFormState, useFormStatus } from "react-dom"

export function ProductForm({product}:{product? : Product | null}){
    const [priceInCents,setPriceInCents] = useState<number | undefined>(product?.priceInCents)
    const [error,action] = useFormState(
        product == null ?  addProduct: updateProduct.bind(null,product.id),{})
    return(
        <form action={action} className="space-y-8">
            <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input 
            type="text" 
            id="name" 
            name="name"
            defaultValue={product?.name || ""}
            required/>
            </div>
            {error.name && <div className="text-destructive">
                {error.name}</div>}
            <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input 
            type="number" 
            id="priceInCents"
            name="priceInCents" 
            required
            value={priceInCents}
            onChange={(e)=>{setPriceInCents(Number(e.target.value) || undefined)}}
            />
            </div>
            <div className="text-muted-foreground">
            {formatCurrency((priceInCents || 0)/100)}
            </div>
            {error.priceInCents && <div className="text-destructive">
                {error.priceInCents}</div>}
            
            <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
            id="description" 
            name="description"
            defaultValue={product?.description || ""} 
            required></Textarea>
            </div>
            {error.description && <div className="text-destructive">
                {error.description}</div>}
            
            <div className="space-y-2">
            <Label htmlFor="file">File</Label>
            <Input type="file" id="file" name="file" required={product === null}></Input>
            </div>
            {product != null && (
                <div className="text-foreground-muted">{product.filePath}</div>
            )}
            {error.file && <div className="text-destructive">
                {error.file}</div>}
            <div className="space-y-2">
            <Label htmlFor="image">Image</Label>
            <Input type="file" id="image" name="image" required={product === null}></Input>
            </div>
            {product != null && (
                <Image 
                src={product.imagePath}
                alt="product Image"
                height={400}
                width={400} 
                />
            )}
            {error.image && <div className="text-destructive">
                {error.image}</div>}
            
            <SubmitButton/>
        </form>
    )
}

function SubmitButton() {
    const { pending } = useFormStatus()
  
    return (
      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : "Save"}
      </Button>
    )
  }