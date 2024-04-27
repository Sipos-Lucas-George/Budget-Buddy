import {db} from "@/lib/db";

export const GET = async (_request: any, {params}: any) => {
    try {
        if (!params || !params.userId) {
            return new Response("User ID not provided", {status: 400});
        }

        const user_settings = await db.userSettings.findUnique({
            where: {userId: params.userId}
        });

        if (!user_settings) return new Response("Settings Not Found", {status: 404});

        return new Response(JSON.stringify(user_settings), {status: 200});
    } catch (error) {
        return new Response("Internal Server Error", {status: 500});
    }
}
export const PATCH = async (request: any, {params}: any) => {
    const data = await request.json();
    try {
        if (!params || !params.userId) {
            return new Response("User ID not provided", {status: 400});
        }

        await db.userSettings.update({
            where: {userId: params.userId},
            data: data
        })
        return new Response(JSON.stringify("Settings updated successfully"), {status: 200});
    } catch (error) {
        console.error("Error updating settings:", error);
        return new Response("Internal Server Error", {status: 500});
    }
};