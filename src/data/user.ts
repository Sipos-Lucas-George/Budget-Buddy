import {db} from "@/lib/db";

export const getUserByID = async (id: string) => {
    try {
        return await db.user.findUnique({where: {id}});
    } catch {
        return null;
    }
}