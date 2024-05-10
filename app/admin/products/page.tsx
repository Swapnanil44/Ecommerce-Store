import { Button } from "@/components/ui/button";
import { PageHeader } from "../_components/PageHeader";
import Link from "next/link";
import { Table, TableHead, TableHeader, TableRow , TableBody, TableCell } from "@/components/ui/table";
import db from "@/db/db";
import { CheckCircle2, MoreVertical, XCircle } from "lucide-react";
import { formatCurrency } from "@/lib/formatter";
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger , DropdownMenuContent, DropdownMenuSeparator} from "@/components/ui/dropdown-menu";
import { ActiveToggleDropdownItem, DeleteDropdownItem } from "../_components/ProductAction";

export default async function AdminProductsPage(){
    return <div>
        <div className="flex justify-between items-center gap-4">
        <PageHeader>Products</PageHeader>
        <Button asChild>
            <Link href={"/admin/products/new"}>Add Product</Link>
        </Button>
        </div>
        <ProductsTable></ProductsTable>
    </div>
}

async function  ProductsTable(){
    const products = await db.product.findMany({
        select:{
            id: true,
            name: true,
            priceInCents: true,
            isAvailableForPurchase: true,
            _count:{select:{orders: true}}
        },
        orderBy:{name: "asc"}
    })
    if(products.length === 0) return <div className="text-xl">No products</div>
    return <Table>
        <TableHeader>
            <TableRow>
                <TableHead className="w-0">
                    <span className="sr-only">Available for Purchase</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead className="w-0">
                    <span className="sr-only">Actions</span>
                </TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {products.map(product => 
                <TableRow key={product.id}>
                    <TableCell>
                        {product.isAvailableForPurchase ? (
                            <>
                            <CheckCircle2></CheckCircle2>
                            <span className="sr-only"> Available</span>
                            </>
                        ):(
                            <>
                            <XCircle className="stroke-destructive"></XCircle>
                            <span className="sr-only">Unavailable</span>
                            </>
                        )}
                    </TableCell>
                    <TableCell>
                        {product.name}
                    </TableCell>
                    <TableCell>
                        {formatCurrency(product.priceInCents / 100)}
                    </TableCell>
                    <TableCell>
                        {product._count.orders}
                    </TableCell>
                    <TableCell>
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                            <span className="sr-only">Actions</span>
                            <MoreVertical/>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                            <DropdownMenuItem asChild>
                                <a download href={`/admin/products/${product.id}/download`}>
                                    Download
                                </a>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href={`/admin/products/${product.id}/edit`}>
                                Edit
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator/>
                            <ActiveToggleDropdownItem id={product.id} isAvailableForPurchase={product.isAvailableForPurchase}/>
                            <DeleteDropdownItem id={product.id} disabled={product._count.orders > 0}/>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        
                    </TableCell>
                </TableRow>
            )}
        </TableBody>
    </Table>
}