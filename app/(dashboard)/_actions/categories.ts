"use server";

import prismaDb from "@/lib/prisma";
import { CreateCategorySchema, CreateCategorySchemaType } from "@/schema/categories";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function CreateCategory(form: CreateCategorySchemaType) {
    const parsedBody = CreateCategorySchema.safeParse(form);

    if(!parsedBody.success) {
        throw new Error("Bad form request")
    }

    const user = await currentUser();

    if(!user) {
        return redirect("/sign-in");
    }

    const { name, icon, type } = parsedBody.data;

    return await prismaDb.category.create({
        data: {
            userId: user.id,
            name, icon, type
        }
    });
}