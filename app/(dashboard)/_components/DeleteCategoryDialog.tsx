"use client";

import { Category } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { ReactNode } from 'react'
import { DeleteCategory } from '../_actions/categories';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { TransactionType } from '@/lib/types';

type Props = {
    trigger: ReactNode;
    category: Category;
}

function DeleteCategoryDialog({trigger, category}: Props) {

    const categoryIdentifier = `${category.name}-${category.type}`;

    const queryClient = useQueryClient()

    const deleteMutation = useMutation({
        mutationFn: DeleteCategory,
        onSuccess: async () => {
            toast.success("Category deleted", {id: categoryIdentifier});
            await queryClient.invalidateQueries({
                queryKey: ["categories"],
            })
        },
        onError: () => {
            toast.error("Something went wrong", {id: categoryIdentifier});
        }
    })

    const handleDeleteCategory = (category: Category) => {
        toast.loading("Deleting category...", {id: categoryIdentifier})
        deleteMutation.mutate({
            name: category.name,
            type: category.type as TransactionType
        })
    }

  return (
    <AlertDialog>
        <AlertDialogTrigger asChild>
            {trigger}
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>
                    Are sure absolutely sure?
                </AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your category
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDeleteCategory(category)} >Continue</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteCategoryDialog