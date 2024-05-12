"use server"

import prismaDb from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation";

export async function DeleteTransaction(id: string) {
    const user = await currentUser();

    if(!user) {
        return redirect("/sign-in");
    }

    const transaction = await prismaDb.transaction.findUnique({
        where: {
            userId: user.id,
            id
        }
    })

    if(!transaction) {
        throw new Error("Bad request");
    }

    await prismaDb.$transaction([
        // Delete transaction from db
        prismaDb.transaction.delete({
          where: {
            id,
            userId: user.id,
          },
        }),
        // Update month history
        prismaDb.monthHistory.update({
          where: {
            day_month_year_userId: {
              userId: user.id,
              day: transaction.date.getUTCDate(),
              month: transaction.date.getUTCMonth(),
              year: transaction.date.getUTCFullYear(),
            },
          },
          data: {
            ...(transaction.type === "expense" && {
              expense: {
                decrement: transaction.amount,
              },
            }),
            ...(transaction.type === "income" && {
              income: {
                decrement: transaction.amount,
              },
            }),
          },
        }),
        // Update year history
        prismaDb.yearHistory.update({
          where: {
            month_year_userId: {
              userId: user.id,
              month: transaction.date.getUTCMonth(),
              year: transaction.date.getUTCFullYear(),
            },
          },
          data: {
            ...(transaction.type === "expense" && {
              expense: {
                decrement: transaction.amount,
              },
            }),
            ...(transaction.type === "income" && {
              income: {
                decrement: transaction.amount,
              },
            }),
          },
        }),
      ]);
}