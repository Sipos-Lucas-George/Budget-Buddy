import Expense from "@/models/expense";
import {connectToDB} from "@/utils/database";

export const GET = async (request: any) => {
    try {
        await connectToDB()
        const url = new URL(request.url);
        const searchParams = new URLSearchParams(url.searchParams);
        const month = parseInt(searchParams.get("month")!, 10);
        const year = parseInt(searchParams.get("year")!, 10);

        if (!month || !year) {
            return new Response("Month and year parameters are required", {status: 400});
        }

        const startDate = new Date(year, month, 1);
        const endDate = new Date(year, month, 0);

        const totalForMonth = await Expense.aggregate([
            {$match: {date: {$gte: startDate, $lte: endDate}}},
            {$group: {_id: null, total: {$sum: "$amount"}}}
        ]);

        const sumPerDay = await Expense.aggregate([
            {$match: {date: {$gte: startDate, $lte: endDate}}},
            {$group: {_id: {$dayOfMonth: "$date"}, total: {$sum: "$amount"}}},
            {$sort: {"_id": 1}}
        ]);

        const response = {
            totalForMonth: totalForMonth.length > 0 ? totalForMonth[0].total : 0,
            dailyTotals: sumPerDay
        };

        return new Response(JSON.stringify(response), {status: 200});
    } catch (error) {
        return new Response("Internal Server Error", {status: 500});
    }
}