"use client"

import * as React from "react"

import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Currency, currencies } from "@/lib/currencies"
import { useMutation, useQuery } from "@tanstack/react-query"
import SkeletonWrapper from "./SkeletonWrapper"
import { UserSetings } from "@prisma/client"
import { updateUserCurrency } from "@/app/(pages)/wizard/_actions/userSettings"
import { toast } from "sonner"


 function CurrencyComboBox() {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [selectedOption, setSelectedOption] = React.useState<Currency | null>(
    null
  );

  const userSettings = useQuery<UserSetings>({
    queryKey: ["userSettings"],
    queryFn: () => fetch("/api/user-settings").then((res) => res.json())
  });


  React.useEffect(() => {
    if(!userSettings.data) return;
    const userCurrency = currencies.find((currency) => currency.value === userSettings.data.currency);
    if(userCurrency) {
        setSelectedOption(userCurrency);
    }
  }, [userSettings.data])

  const mutation = useMutation({
    mutationFn: updateUserCurrency,
    onSuccess: (data: UserSetings) => {
        toast.success(`Currency updated successfully`, { id: "update-currency" })
        setSelectedOption(
            currencies.find((c) => c.value === data.currency)  || null
        )
    },
    onError: (error) => {
        toast.error(`Something went wrong`, { id: "update-currency" })
    }
  });

  const selectOption = React.useCallback((currencyValue: Currency | null) => {
    if(!currencyValue) {
        toast.error("Please select a currency")
        return;
    }
    toast.loading("Updating currency...", {id: "update-currency"})
    mutation.mutate(currencyValue.value)
  }, [mutation])

  if (isDesktop) {
    return (
        <SkeletonWrapper isLoading={userSettings.isFetching}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button disabled={mutation.isPending} variant="outline" className="w-full justify-start">
            {selectedOption ? <>{selectedOption.label}</> : <>+ Set Currency</>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <OptionsList setOpen={setOpen} setSelectedOption={selectOption} />
        </PopoverContent>
      </Popover>
      </SkeletonWrapper>
    )
  }

  return (
    <SkeletonWrapper isLoading={userSettings.isFetching}>
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button disabled={mutation.isPending} variant="outline" className="w-full justify-start">
          {selectedOption ? <>{selectedOption.label}</> : <>+ Set Currency</>}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <OptionsList setOpen={setOpen} setSelectedOption={selectOption} />
        </div>
      </DrawerContent>
    </Drawer>
    </SkeletonWrapper>
  )
}

export default CurrencyComboBox

function OptionsList({ setOpen, setSelectedOption, }: {
  setOpen: (open: boolean) => void
  setSelectedOption: (curency: Currency | null) => void
}) {
  return (
    <Command>
      <CommandInput placeholder="Filter curency..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {currencies.map((curency) => (
            <CommandItem
              key={curency.value}
              value={curency.value}
              onSelect={(value) => {
                setSelectedOption(
                    currencies.find((priority) => priority.value === value) || null
                )
                setOpen(false)
              }}
            >
              {curency.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
