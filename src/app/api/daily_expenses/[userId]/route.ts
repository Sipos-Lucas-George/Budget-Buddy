import {db} from "@/lib/db";
import {CATEGORY_MAP} from "@/utils/constants";

export async function POST(request: Request, {params}: any) {
    const data = await request.json();
    try {
        if (!params || !params.userId) {
            return new Response("User ID not provided!", {status: 400});
        }
        if (!data.date) {
            return new Response("Date not provided!", {status: 400});
        }

        const response = await db.expense.findMany({
            where: {
                userId: params.userId,
                date: data.date,
            },
            select: {
                id: true,
                description: true,
                payment: true,
                type: true,
                category: true,
                amount: true
            }
        });
        const clean_response = response.map((item) =>
            ({...item, category: CATEGORY_MAP[item.category] || item.category}));
        return new Response(JSON.stringify(clean_response), {status: 200});
    } catch (error) {
        console.error("Error getting expenses:", error);
        return new Response("Internal Server Error", {status: 500});
    }
}