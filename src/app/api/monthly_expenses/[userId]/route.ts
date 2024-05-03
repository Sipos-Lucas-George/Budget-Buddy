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

        const byDay = db.expense.groupBy({
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

        const byPayment = db.expense.groupBy({
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

        const byType = db.expense.groupBy({
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

        const byCategory = db.expense.groupBy({
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

        const [byDayAwait, byPaymentAwait, byTypeAwait, byCategoryAwait] = await db.$transaction([byDay, byPayment, byType, byCategory]);
        const numberOfDays = new Date(data.end_month).getDate();
        let cleanDay = new Array(numberOfDays).fill(0);
        byDayAwait.forEach((item: any) => {
            cleanDay[item.date.getDate() - 1] = item._sum.amount;
        });
        const cleanPayment = byPaymentAwait.map((item: any) => ({
            amount: item._sum.amount, payment: item.payment
        }));
        const cleanType = byTypeAwait.map((item: any) => ({
            amount: item._sum.amount, type: item.type
        }));
        const cleanCategory = byCategoryAwait.map((item: any) => ({
            amount: item._sum.amount, category: CATEGORY_MAP[item.category] || item.category
        }))
        // console.log(cleanDay)
        // console.log(cleanPayment)
        // console.log(cleanType)
        // console.log(cleanCategory)
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