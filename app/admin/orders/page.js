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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {toast} from "sonner"


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
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(2, "Description must be at least 2 characters"),
  category: z.string(),
  gender: z.string(),
})



export const columns = [
  {
    accessorKey: "image",
    header: "",
    cell: ({ row }) => {
      console.log("hello",row)
      let dataOfImages = row.original.items
      console.log(dataOfImages)
      return(
        <div className="flex gap-2">
        {
          dataOfImages && dataOfImages.map((item,index)=>{
            return(
              <Image key={index} src={item.product.image.url} height={100} width={100} className="h-10 w-10 rounded object-contain"/>
            )
          })
        }
        </div>
      )
    },
  },
{
  accessorKey: "userName",
  header: "Name",
  cell: ({ row }) => (
    <div className="font-bold text-sm">
      {row.original.userName}
    </div>
  ),
},
{
  accessorKey: "totalAmount",
  header: "Amount Paid",
  cell: ({ row }) => (
    <div className="lowercase flex gap-2">
      <p className={`text-sm font-semibold ${row.original.totalAmountPaid !== row.original.totalAmount ? "text-red-500" : "text-green-600"}`}>
      {row.original.totalAmount}
      </p>
      <p className={`text-sm font-semibold ${row.original.totalAmountPaid == row.original.totalAmount ? "hidden" :"text-green-500"} `}>
      {row.original.totalAmountPaid}
      </p>
    </div>
  ),
},
{
  accessorKey: "time",
  header: "Ordered On",
  cell: ({ row }) => (
    <div className="lowercase">
      {row.original.time?.split('T')[0]}
    </div>
  ),
},
{
    accessorKey:'variantsCount',
    header:"Total Items",
      cell: ({ row }) => (
    <div className="lowercase">
      {row.original?.items.length}
    </div>
  ),
},
{
    accessorKey:'orderStatus',
    header:"Order Status",
      cell: ({ row }) => (
    <div className="lowercase">
      {row.original?.orderStatus}
    </div>
  ),
},
{
    accessorKey:'paymentStatus',
    header:"Payment Status",
      cell: ({ row }) => (
    <div className="lowercase">
      {row.original?.paymentStatus}
    </div>
  ),
},
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
                table.options.meta?.goToViewOrder(row.original)
              }
            >
              View
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {/* <DropdownMenuItem>View</DropdownMenuItem> */}
            {/* <DropdownMenuItem className="text-red-700 font-bold">Delete</DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export default function DataTableDemo() {
  const [sorting, setSorting] = React.useState([])
  const [columnFilters, setColumnFilters] = React.useState([])
  const [columnVisibility, setColumnVisibility] = React.useState({})
  const [rowSelection, setRowSelection] = React.useState({})

  const router = useRouter();

  const form = useForm({
    resolver:zodResolver(formSchema),
    defaultValues: { name: "",description:'',gender:'',category:'' },
  })

  let goToViewOrder=(a)=>{
    console.log(a)
    router.push(`/admin/orders/${a._id}`)
  }

  const [loading,setLoading] = useState(false)
    const [data,setData] = useState([])
    const [cats,setCats] = useState([])
    const [isSubmitting, setIsSubmitting] = useState(false)

     const getOrders = async () => {
        try {
          setLoading(true)
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/order/all-orders`
          )
          console.log(res.data.allOrders)
          if (res.data.success) setData(res.data.allOrders)
        } catch (err) {
          console.error(err)
        } finally {
          setLoading(false)
        }
      }
   
      React.useEffect(()=>{
        getOrders();
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
        goToViewOrder,
    }
  })

  if(loading){
    return(
        <div className="min-h-screen w-full justify-center items-center">
            <Loader2 className="animate-spin"/>
        </div>
    )
  }

  const onSubmit = async (value) => {
    console.log(value)
    try {
      setIsSubmitting(true);
     
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/create-product`,
        value,
      );
      if (response.data.success) {
        toast.success(response.data.message);
        getOrders();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full min-h-screen p-12">
        <div className="flex justify-between mb-6">
                <h1 className="text-xl font-semibold">Orders</h1>
                 <Input
          placeholder="Filter products"
        //   value={table.getColumn("email")?.getFilterValue() ?? ""}
        //   onChange={(e) =>
            // table.getColumn("email")?.setFilterValue(e.target.value)
        //   }
          className="max-w-sm"
        />
         {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) =>
                    column.toggleVisibility(!!value)
                  }
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu> */}
        
               
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
