import prismaDb from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { z } from "zod";


export async function GET (request: Request) {

    const user = await currentUser();

    if(!user) {
        return redirect("/sign-in");
    }

    const { searchParams } = new URL(request.url);

    const paramsType = searchParams.get("type");

    const validate = z.enum(["expense", "income"]);

    const queryParams = validate.safeParse(paramsType);

    if(!queryParams.success) {
        return Response.json(queryParams.error, { status: 400 });
    }

    const type = queryParams.data;

    const categories = await prismaDb.category.findMany({
        where: {
            userId: user.id,
            ...(type && { type })
        },
        orderBy: {name: "asc"}
    });

    return Response.json(categories);

}