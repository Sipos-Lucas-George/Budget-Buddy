import {db} from "@/lib/db";

export async function GET(_request: Request, {params}: any) {
    try {
        if (!params || !params.userId) {
            return new Response("UserID not provided!", {status: 400});
        }

        const subscriptions = await db.subscription.findMany({
            where: {userId: params.userId},
            select: {
                id: true,
                name: true,
                renews: true,
                type: true,
                amount: true,
            }
        });
        return new Response(JSON.stringify(subscriptions), {status: 200});
    } catch (error) {
        console.error("Error getting subscriptions:", error);
        return new Response("Internal Server Error", {status: 500});
    }
}