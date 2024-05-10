import prismaDb from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function GET(request: Request) {

    const user = await currentUser();

    if(!user) {
        return redirect("/sign-in");
    }

    let userSettings = await prismaDb.userSetings.findUnique({
        where: {
            userId: user.id,
        }
    });

    if(!userSettings) {
        userSettings = await prismaDb.userSetings.create({
            data: {
                userId: user.id,
                currency: "USD",
            }
        })
    }
    // revalidate the home page that uses the currency
    revalidatePath('/')
    return Response.json(userSettings)
}