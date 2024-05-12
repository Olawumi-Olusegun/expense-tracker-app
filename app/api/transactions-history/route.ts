import { GetFormatterForCurrency } from "@/lib/helpers";
import prismaDb from "@/lib/prisma";
import { OverViewQuerySchema } from "@/schema/overview";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";


export async function GET(request: Request) {
    
    const user = await currentUser();

    if(!user) {
        return redirect("/sign-in")
    }
    const { searchParams } = new URL(request.url);

    const from = searchParams.get("from")
    const to = searchParams.get("to")

    const queryParams = OverViewQuerySchema.safeParse({from, to});

    if(!queryParams.success) {
        return Response.json(queryParams.error.message, {status: 400})
    }

    const transaction = await getTransactionHistory(user.id, queryParams.data.from, queryParams.data.to)

    return Response.json(transaction);

}


export type GetTransactionHistoryResponseType = Awaited<ReturnType<typeof getTransactionHistory>>


async function getTransactionHistory(userId: string, from: Date, to: Date) {
    const userSettings = await prismaDb.userSetings.findUnique({
        where: {
            userId,
        }
    });

    if(!userSettings) {
        throw new Error("User settings not found")
    }

    const formatter = GetFormatterForCurrency(userSettings.currency);

    const transactions = await prismaDb.transaction.findMany({
        where: {
            userId,
            date: {
                gte: from,
                lte: to
            }
        },
        orderBy: {
            date: "desc"
        }
    });

    return transactions.map((transaction) => ({
        ...transaction,
        formttedAmount: formatter.format(transaction.amount),
    }));
}