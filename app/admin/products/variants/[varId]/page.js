"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  Loader2,
  MoreHorizontal,
  MoreVertical,
} from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

export const columns = [
  {
    id: "image",
    header: "",
    accessorFn: (row) => row.images?.[0]?.url,
    cell: ({ getValue }) => {
      const url = getValue();
      return url ? (
        <img src={url} className="h-15 w-15 object-contain" alt="product" />
      ) : (
        <p className="font-semibold">No Image added yet!</p>
      );
    },
  },
  {
    accessorKey: "color",
    header: "Name",
    cell: ({ row }) => (
      <h1 className="capitalize text-black font-bold">
        {row.getValue("color")}
      </h1>
    ),
  },
  {
    accessorKey: "sizes",
    header: "Sizes",
    accessorFn: (row) => row.sizes,
    cell: ({ getValue }) => {
      let size = getValue();
      return (
        <div className="flex gap-3">
          {size && size.length > 0 ? (
            size.map((s) => {
              return (
                <h1 className="capitalize text-black font-bold">{s.size}</h1>
              );
            })
          ) : (
            <p className="text-xs text-gray-500">No sizes added</p>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => (
      <div className="lowercase">{row.original.createdAt?.split("T")[0]}</div>
    ),
  },
  {
    accessorKey: "imgsCount",
    header: "Total Images",
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
    cell: ({ row, table }) => {
      const payment = row.original;

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
              onClick={() => {
                table.options.meta?.setShowImageAddingModal(true);
                table.options.meta?.setSelectedVariant(row.original);
                console.log(row.original);
              }}
            >
              Images
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                table.options.meta?.setShowSizeAddingModal(true);
                table.options.meta?.setSelectedVariant(row.original);
                console.log(row.original);
              }}
            >
              Sizes
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {/* <DropdownMenuItem>View</DropdownMenuItem> */}
            <DropdownMenuItem className="text-red-700 font-bold">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const createVarSchema = z.object({
  color: z.string().min(2, "Color must be at least 2 characters"),
});

const imageSchema = z.object({
  url: z.string().min(10, "URL must be at least 10 characters"),
});
const sizeSchema = z.object({
  size: z.string(),
  stock: z.coerce.number().min(0),
  price: z.coerce.number().min(0),
});

export default function DataTableDemo() {
  let params = useParams();
  let varId = params.varId;

  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showImageAddingModal, setShowImageAddingModal] = React.useState(false);
  const [showSizeAddingModal, setShowSizeAddingModal] = React.useState(false);
  const [selectedVariant, setSelectedVariant] = React.useState(false);

  const router = useRouter();

  
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const getVariants = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/get-variants/${varId}`,
      );
      console.log(res.data);
      if (res.data.success) setData(res.data.variants);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getVariants();
  }, []);

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
    meta: {
      setShowImageAddingModal,
      setSelectedVariant,
      setShowSizeAddingModal,
    },
  });

  const form = useForm({
    resolver: zodResolver(createVarSchema),
    defaultValues: { color: "" },
  });

  const imageForm = useForm({
    resolver: zodResolver(imageSchema),
    defaultValues: { url: "" },
  });

  const sizeForm = useForm({
    resolver: zodResolver(sizeSchema),
    defaultValues: {
      size: "",
      stock: "",
      price: "",
    },
  });

  const onSubmit = async (values) => {
    console.log(values);
    try {
      setIsSubmitting(true);
      let dataToSend = { ...values, productId: varId };
      console.log(dataToSend);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/create-variant`,
        dataToSend,
      );
      if (response.data.success) {
        toast.success(response.data.message);
        getVariants();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full justify-center items-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }
  const onSubmitImage = async (values) => {
    console.log(values);
    try {
      setIsSubmitting(true);
      let dataToSend = {
        ...values,
        productId: varId,
        variantId: selectedVariant?._id,
      };
      console.log(dataToSend);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/add-image`,
        dataToSend,
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setShowImageAddingModal(false);
        setSelectedVariant(null);
        getVariants();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const onSubmitSize = async (values) => {
    console.log(values);
    try {
      setIsSubmitting(true);
      let dataToSend = {
        ...values,
        productId: varId,
        variantId: selectedVariant?._id,
      };
      console.log(dataToSend);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/product/create-size`,
        dataToSend,
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setShowSizeAddingModal(false);
        setSelectedVariant(null);
        getVariants();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
              <DialogTitle>Add Variant</DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter the variant name : Color " />
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

      <Dialog
        open={showImageAddingModal}
        onOpenChange={setShowImageAddingModal}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Images </DialogTitle>
          </DialogHeader>

          <div className="flex mt-8 mb-8">
            {selectedVariant?.images?.length > 0 &&
              selectedVariant?.images.map((item) => {
                return (
                  <img
                    key={item._id}
                    src={item?.url}
                    className="h-16 w-16 object-contain rounded"
                  />
                );
              })}
          </div>

          <Form {...imageForm}>
            <form
              onSubmit={imageForm.handleSubmit(onSubmitImage)}
              className="space-y-4"
            >
              <FormField
                control={imageForm.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter the url of the image"/>
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

      <Dialog open={showSizeAddingModal} onOpenChange={setShowImageAddingModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Sizes</DialogTitle>
          </DialogHeader>


          <Form {...sizeForm}>
            <form
              onSubmit={sizeForm.handleSubmit(onSubmitSize)}
              className="space-y-4"
            >
          <FormField
            control={sizeForm.control}
            name="size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Size</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a size" />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent>
                    <SelectItem value="S">S</SelectItem>
                    <SelectItem value="M">M</SelectItem>
                    <SelectItem value="L">L</SelectItem>
                    <SelectItem value="XL">XL</SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
              <FormField
                control={sizeForm.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter stock" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={sizeForm.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter Price" />
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
                          header.getContext(),
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
                        cell.getContext(),
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
  );
}
