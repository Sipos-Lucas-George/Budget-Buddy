import {db} from "@/lib/db";
import {CATEGORY_MAP} from "@/utils/constants";

export async function POST(request: Request, {params}: any) {
    const data = await request.json();
    try {
        if (!params || !params.userId) {
            return new Response("User ID not provided!", {status: 400});
        }
        if (!data.start_month || !data.end_month) {
            return new Response("Date not provided!", {status: 400});
        }

        const byDay = await db.expense.groupBy({
            where: {
                userId: params.userId,
                date: {
                    gte: data.start_month,
                    lte: data.end_month,
                }
            },
            by: ["date"],
            _sum: {
                amount: true
            }
        })

        const byPayment = await db.expense.groupBy({
            where: {
                userId: params.userId,
                date: {
                    gte: data.start_month,
                    lte: data.end_month,
                },
            },
            by: ['payment'],
            _sum: {
                amount: true,
            },
        });

        const byType = await db.expense.groupBy({
            where: {
                userId: params.userId,
                date: {
                    gte: data.start_month,
                    lte: data.end_month,
                },
            },
            by: ['type'],
            _sum: {
                amount: true,
            },
        });

        const byCategory = await db.expense.groupBy({
            where: {
                userId: params.userId,
                date: {
                    gte: data.start_month,
                    lte: data.end_month,
                },
            },
            by: ['category'],
            _sum: {
                amount: true,
            },
        });
        const numberOfDays = new Date(data.end_month).getDate();
        let cleanDay = new Array(numberOfDays).fill(0);
        byDay.forEach(item => {
            cleanDay[item.date.getDate() - 1] = item._sum.amount;
        });
        const cleanPayment = byPayment.map(item => ({
            amount: item._sum.amount, payment: item.payment
        }));
        const cleanType = byType.map(item => ({
            amount: item._sum.amount, type: item.type
        }));
        const cleanCategory = byCategory.map(item => ({
            amount: item._sum.amount, category: CATEGORY_MAP[item.category] || item.category
        }))
        console.log(cleanDay)
        console.log(cleanPayment)
        console.log(cleanType)
        console.log(cleanCategory)
        return new Response(JSON.stringify({
            cleanDay,
            cleanPayment,
            cleanType,
            cleanCategory
        }), {status: 200});
    } catch (error) {
        console.error("Error getting expenses:", error);
        return new Response("Internal Server Error", {status: 500});
    }
}