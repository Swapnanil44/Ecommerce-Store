import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import db from "@/db/db";
import { formatCurrency, formatNumber } from "@/lib/formatter";
import { resolve } from "path";
async function getSalesData(){
    const data = await db.order.aggregate({
        _sum:{pricePaidInCent: true},
        _count: true
    })
    // await wait(2000);
    return {
        amount: (data._sum.pricePaidInCent || 0)/100,
        numberOfSales: data._count
    }
}

async function getUserData(){
    const [userCount,orderData] = await Promise.all([
        db.user.count(),
        db.order.aggregate({
            _sum:{pricePaidInCent: true}
        })
    ])
    return {
        userCount,
        avgValuePeruser: userCount===0 ? 0: ((orderData._sum.pricePaidInCent) || 0)/userCount
    }
}
 
async function getProductdata() {
    const [activeProduct,inactiveProduct] = await Promise.all([
        db.product.count({where:{isAvailableForPurchase: true}}),
        db.product.count({where:{isAvailableForPurchase: false}})
    ])

    return{
        activeProduct,
        inactiveProduct
    }
}

// async function wait(duration: number){
//     return new Promise(resolve=> setTimeout(resolve,duration))
// }

export default async function AdminDashBoard(){
    const [salesData,userData,productData]= await Promise.all([
        getSalesData(),
        getUserData(),
        getProductdata()
    ])
    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <DashBoardCard 
        title={"Sales"} 
        subtitle={`${formatNumber(salesData.numberOfSales)} orders`} 
        body={formatCurrency(salesData.amount)}></DashBoardCard>

        <DashBoardCard 
        title={"Customers"} 
        subtitle={`${formatCurrency(userData.avgValuePeruser)} Average Value`}
        body={formatNumber(userData.userCount)}></DashBoardCard>

        <DashBoardCard 
        title={"Active Products"} 
        subtitle={`${formatNumber(productData.inactiveProduct)} Inactive`}
        body={formatNumber(productData.activeProduct)}></DashBoardCard>
        
    </div>
}

type dashBoardCardPropsType = {
    title: string,
    subtitle: string,
    body: string
}

function DashBoardCard({title,subtitle,body}:dashBoardCardPropsType){
    return <Card>
    <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
    </CardHeader>
    <CardContent>{body}</CardContent>
    </Card>
}