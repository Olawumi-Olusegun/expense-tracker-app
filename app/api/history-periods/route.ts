import prismaDb from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
    const user = await currentUser();
    if(!user) {
        return redirect("/sign-in");
    }

    const periods = await getHistoryPeriod(user.id);
    return Response.json(periods)
}

export type GetHistoryPeriodsResponseType = Awaited<ReturnType<typeof getHistoryPeriod>>

async function getHistoryPeriod(userId: string) {
    const result = await prismaDb.monthHistory.findMany({
        where: {
            userId,
        },
        select: {
            year: true
        },
        distinct: ["year"],
        orderBy: [
            {
                year: "asc"
            }
        ]
    });

    const years = result.map((el) => el.year);

    if(years.length === 0) {
        return [new Date().getFullYear()]
    }

    return years;
}