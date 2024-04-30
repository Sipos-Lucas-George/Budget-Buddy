import {db} from "@/lib/db";

export async function POST(request: Request, {params}: any) {
    const data = await request.json();
    try {
        if (!params || !params.id) {
            return new Response("User ID not provided!", {status: 400});
        }

        const expense = await db.expense.create({
            data: {
                userId: params.id,
                ...data
            }
        })

        return new Response(JSON.stringify({id: expense.id}), {status: 200});
    } catch (error) {
        console.error("Error posting expense:", error);
        return new Response("Internal Server Error", {status: 500});
    }
}

export async function PATCH(request: Request, {params}: any) {
    const data = await request.json();
    try {
        if (!params || !params.id) {
            return new Response("Expense ID not provided!", {status: 400});
        }
        await db.expense.update({
            where: {id: params.id},
            data: data
        })
        return new Response(JSON.stringify("Expense updated successfully!"), {status: 200});
    } catch (error) {
        console.error("Error updating expense:", error);
        return new Response("Internal Server Error", {status: 500});
    }
}

export async function DELETE(_request: Request, {params}: any) {
    try {
        if (!params || !params.id) {
            return new Response("Expense ID not provided!", {status: 400});
        }
        await db.expense.delete({
            where: {id: params.id}
        })

        return new Response(JSON.stringify("Expense deleted successfully!"), {status: 200});
    } catch (error) {
        console.error("Error deleting expense:", error);
        return new Response("Internal Server Error", {status: 500});
    }
}