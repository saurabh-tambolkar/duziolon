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
import {toast} from "sonner"


import { Button } from "@/components/ui/button"
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
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"
import { getStatusStyles } from "../../../components/ProfilerForm"
import Link from "next/link"



const columns = [
{
  accessorKey: "userName",
  header: "Name",
  cell: ({ row }) => (
    <div className="font-bold text-sm">
      {row.original.user.name}
    </div>
  ),
},
{
  accessorKey: "Order",
  header: "Order",
  cell: ({ row }) => (
     <Link href={`/admin/orders/${row.original.orderId}`} className="font-bold text-sm text-blue-500">
      {row.original.orderId}
    </Link>
  ),
},
{
  accessorKey: "Subject",
  header: "Subject",
  cell: ({ row }) => (
     <p>
      {row.original.subject}
    </p>
  ),
},
{
  accessorKey: "phone",
  header: "Phone",
  cell: ({ row }) => (
     <div className="font-bold text-sm">
      {row.original.user.phone}
    </div>
  ),
},
{
  accessorKey: "status",
  header: "Status",
  cell: ({ row }) => (
    <div className={`lowercase text-center ${getStatusStyles(row.original.status)} rounded-full`}>
      {row.original.status}
    </div>
  ),
},
{
  accessorKey: "createdAt",
  header: "Created On",
  cell: ({ row }) => (
    <div className={`lowercase`}>
      {row.original.createdAt.split("T")[0]}
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
                table.options.meta?.goToChatTicket(row.original)
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
  let goToChatTicket=(a)=>{
    // console.log(a)
    router.push(`/admin/tickets/${a._id}`)
  }

  const [loading,setLoading] = useState(false)
    const [data,setData] = useState([])
    const [cats,setCats] = useState([])
    const [isSubmitting, setIsSubmitting] = useState(false)

     const getTickets = async () => {
        try {
          setLoading(true)
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/tickets/get-admin-tickets`
          )
          console.log("admin",res.data.tickets)
          if (res.data.success) setData(res.data.tickets)
        } catch (err) {
          console.error(err)
        } finally {
          setLoading(false)
        }
      }
   
      React.useEffect(()=>{
        getTickets();
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
        goToChatTicket,
    }
  })

  if(loading){
    return(
        <div className="min-h-screen w-full justify-center items-center">
            <Loader2 className="animate-spin"/>
        </div>
    )
  }
  return (
    <div className="w-full min-h-screen p-12">
        <div className="flex justify-between mb-6">
                <h1 className="text-xl font-semibold">Tickets</h1>
                 {/* <Input
          placeholder="Filter products"
        //   value={table.getColumn("email")?.getFilterValue() ?? ""}
        //   onChange={(e) =>
            // table.getColumn("email")?.setFilterValue(e.target.value)
        //   }
          className="max-w-sm"
        /> */}
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
