import {db} from "@/lib/db";
import {SUBSCRIPTIONS_LIMIT} from "@/utils/constants";

export async function POST(request: Request, {params}: any) {
    const data = await request.json();
    try {
        if (!params || !params.id) {
            return new Response("User ID not provided!", {status: 400});
        }
        const count = await db.subscription.count({
            where: {
                userId: params.id,
                renews: data.renews
            }
        });
        if (count >= SUBSCRIPTIONS_LIMIT) {
            return new Response("Subscription limit reached!", {status: 400});
        }

        const subscription = await db.subscription.create({
            data: {
                userId: params.id,
                ...data
            }
        })

        return new Response(JSON.stringify({id: subscription.id}), {status: 200});
    } catch (error) {
        console.error("Error posting subscription:", error);
        return new Response("Internal Server Error", {status: 500});
    }
}

export async function PATCH(request: Request, {params}: any) {
    const data = await request.json();
    try {
        if (!params || !params.id) {
            return new Response("Subscription ID not provided!", {status: 400});
        }
        await db.subscription.update({
            where: {id: params.id},
            data: data
        })
        return new Response(JSON.stringify("Subscription updated successfully!"), {status: 200});
    } catch (error) {
        console.error("Error updating subscription:", error);
        return new Response("Internal Server Error", {status: 500});
    }
}

export async function DELETE(_request: Request, {params}: any) {
    try {
        if (!params || !params.id) {
            return new Response("Subscription ID not provided!", {status: 400});
        }
        await db.subscription.delete({
            where: {id: params.id}
        })

        return new Response(JSON.stringify("Subscription deleted successfully!"), {status: 200});
    } catch (error) {
        console.error("Error deleting subscription:", error);
        return new Response("Internal Server Error", {status: 500});
    }
}