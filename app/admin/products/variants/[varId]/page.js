"use client"

import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, Loader2, MoreHorizontal, MoreVertical } from "lucide-react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useState } from "react"
import axios from "axios"
import { useParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import {z} from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const data2 = [
  {
    id: "m5gr84i9",
    amount: 316,
    status: "success",
    email: "ken99@example.com",
  },
  {
    id: "3u1reuv4",
    amount: 242,
    status: "success",
    email: "Abe45@example.com",
  },
  {
    id: "derv1ws0",
    amount: 837,
    status: "processing",
    email: "Monserrat44@example.com",
  },
  {
    id: "5kma53ae",
    amount: 874,
    status: "success",
    email: "Silas22@example.com",
  },
  {
    id: "bhqecj4p",
    amount: 721,
    status: "failed",
    email: "carmella@example.com",
  },
]

export const columns = [
     {
  id: "image",
  header: "",
  accessorFn: (row) => row.images?.[0]?.url,
  cell: ({ getValue }) => {
    const url = getValue();
    return url ? (
      <img
        src={url}
        className="h-15 w-15 object-contain"
        alt="product"
      />
    ) : null;
  },
},
  {
    accessorKey: "color",
    header: "Name",
    cell: ({ row }) => (
      <h1 className="capitalize text-black font-bold">{row.getValue("color")}</h1>
    ),
  },
  {
    accessorKey: "sizes",
    header: "Sizes",
    accessorFn:(row)=>row.sizes,
    cell: ({ getValue }) => {
        let size = getValue();
        console.log('s',size)
        return(
            <div className="flex gap-3">
                {
                    size ? size.map((s)=>{
                        return(
                            <h1 className="capitalize text-black font-bold">{s.size}</h1>
                        )
                    }) 
                    :
                    <p className="text-xs text-gray-500">No sizes added</p>
                }
            </div>
        )
  },
  },
{
  accessorKey: "createdAt",
  header: "Created At",
  cell: ({ row }) => (
    <div className="lowercase">
      {row.original.createdAt?.split('T')[0]}
    </div>
  ),
},
{
    accessorKey:'imgsCount',
    header:"Total Images"
},
//   {
//     accessorKey: "amount",
//     header: () => <div className="text-right">Amount</div>,
//     cell: ({ row }) => {
//       const amount = Number(row.getValue("amount"))
//       const formatted = new Intl.NumberFormat("en-US", {
//         style: "currency",
//         currency: "USD",
//       }).format(amount)

//       return <div className="text-right font-medium">{formatted}</div>
//     },
//   },
  {
    id: "actions",
    header: "Actions",
    // enableHiding: false,
    cell: ({ row,table }) => {
      const payment = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                table.options.meta?.goToViewProd(row.original)
              }
            >
              View
            </DropdownMenuItem>
            <DropdownMenuItem>Variants</DropdownMenuItem>
            <DropdownMenuSeparator />
            {/* <DropdownMenuItem>View</DropdownMenuItem> */}
            <DropdownMenuItem className="text-red-700 font-bold">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

const createVarSchema = z.object({
  color: z.string().min(2, "Color must be at least 2 characters"),
})

export default function DataTableDemo() {

    let params = useParams();
    let varId = params.varId
    console.log(params)

  const [sorting, setSorting] = React.useState([])
  const [columnFilters, setColumnFilters] = React.useState([])
  const [columnVisibility, setColumnVisibility] = React.useState({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const router = useRouter();

  let goToViewProd=(a)=>{
    console.log(a)
    router.push(`/products/${a.gender}/${a._id}`)
  }

  const [loading,setLoading] = useState(false)
    const [data,setData] = useState([])

     const getVariants = async () => {
        try {
          setLoading(true)
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/get-variants/${varId}`
          )
          console.log(res.data.products)
          if (res.data.success) setData(res.data.variants)
        } catch (err) {
          console.error(err)
        } finally {
          setLoading(false)
        }
      }

      React.useEffect(()=>{
        getVariants();
      },[])

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    meta:{
        goToViewProd
    }
  })
  
    const form = useForm({
      resolver: zodResolver(createVarSchema),
      defaultValues: { color: "" },
    })
  
    const onSubmit=(values)=>{
      console.log(values)
    }

  if(loading){
    return(
        <div className="min-h-screen w-full justify-center items-center">
            <Loader2 className="animate-spin"/>
        </div>
    )
  }

  
//   console.log(route)

  return (
    <div className="w-full min-h-screen p-12">
        <div className="flex justify-between mb-6">
                <h1 className="text-xl font-semibold">Variants</h1>
        
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Add New Variant</Button>
                  </DialogTrigger>
        
                  <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
                    <DialogHeader>
                      <DialogTitle>Add Category</DialogTitle>
                    </DialogHeader>
        
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" >
                        <FormField
                          control={form.control}
                          name="color"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Color</FormLabel>
                              <FormControl>
                                <Input {...field}/>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
        
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogClose>
                          <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Saving..." : "Save"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div> */}
    </div>
  )
}

