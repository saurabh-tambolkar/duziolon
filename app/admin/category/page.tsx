"use client"

import React, { useEffect, useState } from "react"
import axios from "axios"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Loader2, Pen, PencilIcon, Power, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { toast } from "sonner"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

import "@tanstack/react-table"

declare module "@tanstack/react-table" {
  interface TableMeta<TData> {
    onEdit?: (row: TData) => void
    handleDeleteCategory?: (id: string) => void
    deleting?: boolean
    deletingId?: string | null
  }
}


/* ================= TYPES ================= */

export type Category = {
  _id: string
  name: string
  category: string
  isActive: boolean
  createdAt: string
}

/* ================= TABLE COLUMNS ================= */

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "category",
    header: "Category Name",
    cell:({row})=>{
      return(
        <h1 className="text-black font-bold">{row.original?.category}</h1>
      )
    }
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.original.isActive
      return (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            isActive
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {isActive ? "Active" : "Inactive"}
        </span>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => row.original.createdAt.split("T")[0],
  },
  {
    id: "actions",
    header: "Actions",
    enableSorting: false,
    cell: ({ row, table }) => {
      const category = row.original
      return (
        <div className="flex gap-2">
          {/* <Button className={`${category.isActive ? "bg-red-600" : "bg-green-600"}`} size="icon">
            <Power
              className='h-4 w-4'
            />
          </Button> */}

        <Button
  size="icon"
  onClick={() => {
    table.options.meta?.onEdit?.(category)
  }}
>
  <PencilIcon className="h-4 w-4 text-white" />
</Button>

         
           
         <Button
           className={"bg-red-600"} 
            size="icon"
            onClick={() =>
              table.options.meta?.handleDeleteCategory?.(category._id)
            }
          >
            {
              table?.options.meta?.deletingId == category._id && table.options?.meta?.deleting
              ?
              <Loader2 className="animate-spin"/>
              :
            <Trash2 className="h-4 w-4 " />
            }
          </Button>
        </div>
      )
    },
  },
]

/* ================= FORM ================= */

const formSchema = z.object({
  category: z.string().min(2, "Category Name must be at least 2 characters"),
})

/* ================= PAGE ================= */

export default function Page() {
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [catData, setCatData] = useState<Category[]>([])
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
const [editOpen, setEditOpen] = useState(false)
const [statusActive, setStatusActive] = useState(false)

const editForm = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema),
  defaultValues: { category: "" },
})



  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { category: "" },
  })

  const getCategories = async () => {
    try {
      setLoading(true)
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/all-categories`
      )
      if (res.data.success) setCatData(res.data.categories)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }
  const handleDeleteCategory = async (id:string) => {
    try {
      setDeleting(true)
      setDeletingId(id)
      console.log(id)
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/delete-category/${id}`
      )
      if (res.data.success) getCategories();
    } catch (err) {
      console.error(err)
    } finally {
      setDeleting(false)
      setDeletingId(null)
    }
  }

  useEffect(() => {
    getCategories()
  }, [])


  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true)
       const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/product/create-category`,values);
      if(response.data.success){
        toast.success(response.data.message)
        getCategories();
      }
      form.reset()
    } finally {
      setIsSubmitting(false)
    }
  }

  const table = useReactTable({
    data: catData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: { handleDeleteCategory,deletingId,deleting,
       onEdit: (category: Category) => {
      setEditingCategory(category)
      setStatusActive(category.isActive)
      editForm.reset({ category: category.category }) // 👈 PREFILL
      setEditOpen(true)
    },
     },
  })

  if (loading) return <p className="p-10 text-center">Loading...</p>

  const onEditSubmit = async (values: z.infer<typeof formSchema>) => {
  if (!editingCategory) return

  try {
    setIsSubmitting(true)
    // console.log(values,statusActive,editingCategory)
    const dataToUpdate = {
      id:editingCategory._id,
      category:values.category,
      isActive:statusActive
    }
    console.log(dataToUpdate)

    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/update-category`,
      dataToUpdate
    )

    if (res.data.success) {
      toast.success("Category updated")
      getCategories()
      setEditOpen(false)
      setEditingCategory(null)
    }
  } catch (err) {
    toast.error("Update failed")
    console.log(err)
  } finally {
    setIsSubmitting(false)
  }
}


  return (
    <div className="p-12 w-full min-h-screen">

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
  <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
    <DialogHeader>
      <DialogTitle>Edit Category</DialogTitle>
    </DialogHeader>

    <Form {...editForm}>
      <form
        onSubmit={editForm.handleSubmit(onEditSubmit)}
        className="space-y-4"
      >
        <FormField
          control={editForm.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-3">
        <Checkbox checked={statusActive} onClick={()=>setStatusActive(!statusActive)}/>
        <Label>Active</Label>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setEditOpen(false)}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  </DialogContent>
</Dialog>


      <div className="flex justify-between mb-6">
        <h1 className="text-xl font-semibold">Category</h1>

        <Dialog>
          <DialogTrigger asChild>
            <Button>Add New Category</Button>
          </DialogTrigger>

          <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
            <DialogHeader>
              <DialogTitle>Add Category</DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" >
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category Name</FormLabel>
                      <FormControl>
                        <Input {...field}  />
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

      <div className="border rounded-md w-full">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead key={h.id}>
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
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
                <TableCell colSpan={columns.length} className="text-center">
                  No categories found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
