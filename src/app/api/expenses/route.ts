import {db} from "@/lib/db";

export async function DELETE(request: Request) {
    const data = await request.json();
    try {
        if (!data || data.length === 0) {
            return new Response("Expenses IDs not provided!", {status: 400});
        }

        await db.expense.deleteMany({
            where: {id: {in: data}}
        })
        return new Response(JSON.stringify("Expenses deleted successfully!"), {status: 200});
    } catch (error) {
        console.error("Error deleting expenses:", error);
        return new Response("Internal Server Error", {status: 500});
    }
}