"use client";

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { TransactionType } from '@/lib/types';
import { Category } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import React, { useCallback, useEffect, useState } from 'react'
import CreateCategoryDialog from './CreateCategoryDialog';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
    type: TransactionType;
    onChange: (value: string) => void;
}

function CategoryPicker({type, onChange}: Props) {

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");


    const categoriesQuery = useQuery({
        queryKey: ["categories", type],
        queryFn: () => fetch(`/api/categories?type=${type}`).then((res) => res.json())
    });

    const selectedCategory = categoriesQuery.data?.find((category: Category) => category.name === value);

    const onSuccessCallback = useCallback((category: Category) => {
        setValue(category.name)
        setOpen((prevState) => !prevState)
    }, [setValue, setOpen])

    useEffect(() => {
        if(!value) return;
        onChange(value);
    }, [onChange, value])

  return (
    <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild className='w-full'>
            <Button variant={"outline"} role='combobox' aria-expanded={open} className='w-full justify-between' >
                { selectedCategory 
                ? <CategoryRow category={selectedCategory} /> 
                : "Select Category" 
                }
                <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
            </Button>
        </PopoverTrigger>
        <PopoverContent className='w-full p-0 '>
            <Command onSubmit={(event) => { 
                event.preventDefault();
             }}>
                <CommandInput placeholder='Search Category' />
                <CreateCategoryDialog type={type} successCallback={onSuccessCallback} />
                <CommandEmpty >
                    <p>Category not found</p>
                    <p className='text-sm text-muted-foreground '>Tip: Create a new category</p>
                </CommandEmpty>
                <CommandGroup>
                    <CommandList>
                        {categoriesQuery.data && categoriesQuery.data.map((category: Category) => (
                            <CommandItem key={category.name} onSelect={() => {
                                setValue(category.name);
                                setOpen((prevState) => !prevState)
                            }}>
                                <CategoryRow category={category} />
                                <Check className={cn("ml-auto w-4 h-4 opacity-0", value === category.name && "opacity-100")} />
                            </CommandItem>
                        ))  }
                    </CommandList>
                </CommandGroup>
             </Command>
        </PopoverContent>
    </Popover>
  )
}


function CategoryRow({category}:{category: Category}) {
    return (<>
      <div className="flex items-center gap-2 ">
        <span role='img'>{category.icon}</span>
        <span>{category.name}</span>
      </div>
    </>)
}

export default CategoryPicker