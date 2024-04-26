import User_Settings from "@/models/user_settings";
import {connectToDB} from "@/utils/database";

export const GET = async (_request: any, {params}: any) => {
    try {
        await connectToDB()
        const user_settings = await User_Settings.findOne({user_id: params.user_id});

        if (!user_settings) return new Response("", {statusText: "Settings Not Found", status: 404});

        const {_id, __v, ...cleanedUserSettings} = user_settings._doc;
        return new Response(JSON.stringify(cleanedUserSettings), {status: 200});
    } catch (error) {
        return new Response("Internal Server Error", {status: 500});
    }
}
export const PATCH = async (request: any, {params}: any) => {
    const data = await request.json();
    try {
        await connectToDB();
        await User_Settings.findOneAndUpdate({user_id: params.user_id}, data);
        return new Response(JSON.stringify("Settings updated successfully"), {status: 200});
    } catch (error) {
        console.error("Error updating settings:", error);
        return new Response("Internal Server Error", {status: 500});
    }
};