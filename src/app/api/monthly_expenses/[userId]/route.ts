import {db} from "@/lib/db";
import {CATEGORY_ENUM, CATEGORY_MAP} from "@/utils/constants";
import {EnumPayment, EnumType} from "@prisma/client";

const mergeResults = (defaults: any, results: any, key: string) => {
    const resultDict = new Map(results.map((item: any) => [item[key], item.amount]));
    return defaults.map((item: any) => ({
        ...item,
        amount: resultDict.get(item[key]) || item.amount
    }));
};

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

        const defaultPayments = Object.values(EnumPayment).map(payment => ({ payment, amount: 0 }));
        const defaultTypes = Object.values(EnumType).map(type => ({ type, amount: 0 }));
        const defaultCategories = Object.values(CATEGORY_ENUM).map(category => ({ category, amount: 0 }));

        let cleanPayment = byPaymentAwait.map((item: any) => ({
            amount: item._sum.amount, payment: item.payment
        }));
        let cleanType = byTypeAwait.map((item: any) => ({
            amount: item._sum.amount, type: item.type
        }));
        let cleanCategory = byCategoryAwait.map((item: any) => ({
            amount: item._sum.amount, category: CATEGORY_MAP[item.category] || item.category
        }))
        cleanPayment = mergeResults(defaultPayments, cleanPayment, 'payment');
        cleanType = mergeResults(defaultTypes, cleanType, 'type');
        cleanCategory = mergeResults(defaultCategories, cleanCategory, 'category');
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