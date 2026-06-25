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
      let src = row.getValue("image")
      return(
        
          src ?
          <img src={src} className="h-15 w-15 object-contain"/>
          :
          <p className="font-semibold">No Image</p>
      )
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <h1 className="capitalize text-black font-bold">{row.getValue("name")}</h1>
    ),
  },
{
  accessorKey: "category",
  header: "Category",
  cell: ({ row }) => (
    <div className="lowercase">
      {row.original.category?.category}
    </div>
  ),
},
{
    accessorKey: "gender",
    header: "Gender",
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
    accessorKey:'variantsCount',
    header:"Total Variants"
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
            <DropdownMenuItem onClick={() =>
                table.options.meta?.goToViewVariants(row.original)
              }>Variants</DropdownMenuItem>
            <DropdownMenuSeparator />
            {/* <DropdownMenuItem>View</DropdownMenuItem> */}
            <DropdownMenuItem className="text-red-700 font-bold">Delete</DropdownMenuItem>
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

  let goToViewProd=(a)=>{
    console.log(a)
    router.push(`/products/${a.gender}/${a._id}`)
  }
  let goToViewVariants=(a)=>{
    console.log(a)
    router.push(`/admin/products/variants/${a._id}`)
  }

  const [loading,setLoading] = useState(false)
    const [data,setData] = useState([])
    const [cats,setCats] = useState([])
    const [isSubmitting, setIsSubmitting] = useState(false)

     const getProducts = async () => {
        try {
          setLoading(true)
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/all-products`
          )
          console.log(res.data.products)
          if (res.data.success) setData(res.data.products)
        } catch (err) {
          console.error(err)
        } finally {
          setLoading(false)
        }
      }
     const getCategories = async () => {
        try {
          setLoading(true)
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/categories`
          )
          console.log(res.data.products)
          if (res.data.success) setCats(res.data.categories)
        } catch (err) {
          console.error(err)
        } finally {
          setLoading(false)
        }
      }

      React.useEffect(()=>{
        getProducts();
        getCategories();
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
        goToViewProd,
        goToViewVariants
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
        getProducts();
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
                <h1 className="text-xl font-semibold">Variants</h1>
                 <Input
          placeholder="Filter products"
        //   value={table.getColumn("email")?.getFilterValue() ?? ""}
        //   onChange={(e) =>
            // table.getColumn("email")?.setFilterValue(e.target.value)
        //   }
          className="max-w-sm"
        />
         <DropdownMenu>
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
        </DropdownMenu>
        
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Add New Product</Button>
                  </DialogTrigger>
        
                  <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
                    <DialogHeader>
                      <DialogTitle>Add New Product</DialogTitle>
                    </DialogHeader>
        
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" >
                       
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Enter name" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Enter description" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                         <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <Select
                                          onValueChange={field.onChange}
                                          defaultValue={field.value}
                                        >
                                          <FormControl>
                                            <SelectTrigger>
                                              <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                          </FormControl>
                        
                                          <SelectContent>
                                            {
                                              cats && cats.length > 0 &&
                                              cats.map((item)=>{
                                                return(
                                                  <SelectItem value={item._id}>{item.category}</SelectItem>
                                                )
                                              })
                                            }
                                          </SelectContent>
                                        </Select>
                        
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                          <FormField
                                      control={form.control}
                                      name="gender"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Gender</FormLabel>
                                          <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                          >
                                            <FormControl>
                                              <SelectTrigger>
                                                <SelectValue placeholder="Select Gender" />
                                              </SelectTrigger>
                                            </FormControl>
                          
                                            <SelectContent>
                                              <SelectItem value="womens">Womens</SelectItem>
                                              <SelectItem value="mens">Mens</SelectItem>
                                            </SelectContent>
                                          </Select>
                          
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
