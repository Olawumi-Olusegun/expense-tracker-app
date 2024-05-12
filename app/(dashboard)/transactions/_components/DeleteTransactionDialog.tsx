"use client";


import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react'
import { toast } from 'sonner';
import { DeleteTransaction } from '../_actions/deleteTransaction';

type Props = {
    open: boolean;
    setOpen: (open: boolean) => void;
    transaction: string;
}

function DeleteTransactionDialog({open, setOpen, transaction}: Props) {

    const transactionId = `${transaction}`;

    const queryClient = useQueryClient()

    const deleteMutation = useMutation({
        mutationFn: DeleteTransaction,
        onSuccess: async () => {
            toast.success("Transaction deleted", {id: transactionId});
            await queryClient.invalidateQueries({
                queryKey: ["transaction", transactionId],
            })
        },
        onError: () => {
            toast.error("Something went wrong", {id: transactionId});
        }
    })

    const handleDeleteCategory = () => {
        toast.loading("Deleting transaction...", {id: transactionId})
        deleteMutation.mutate(transactionId)
    }


  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>
                    Are sure absolutely sure?
                </AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your transaction
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteCategory} >Continue</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteTransactionDialog