"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { format } from "date-fns";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, Pen, PencilIcon, Power, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import "@tanstack/react-table";

declare module "@tanstack/react-table" {
  interface TableMeta<TData> {
    onEdit?: (row: TData) => void;
    handleDeleteCoupon?: (id: string) => void;
    deleting?: boolean;
    deletingId?: string | null;
  }
}

/* ================= TYPES ================= */

export type Category = {
  _id: string;
  name: string;
  discount: number;
  expiryDate: string;
  status: boolean;
  createdAt: string;
};

/* ================= TABLE COLUMNS ================= */

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "name",
    header: "Coupon Code",
    cell: ({ row }) => {
      return <h1 className="text-black font-bold">{row.original?.name}</h1>;
    },
  },
  {
    accessorKey: "discount",
    header: "Discount  (%)",
    cell: ({ row }) => {
      return (
        <h1 className="text-black font-bold">{row.original?.discount}%</h1>
      );
    },
  },
  {
    accessorKey: "expiryDate",
    header: "Expired",
    cell: ({ row }) => {
      const isExpired =
        Date.now() > Date.parse(row.original.expiryDate) ? true : false;
      return (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            !isExpired
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {/* {isActive ? "Active" : "Inactive"} */}
          {isExpired ? "Expired" : "In use"}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.original.status;
      return (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {isActive ? "Active" : "Inactive"}
        </span>
      );
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
      const category = row.original;
      return (
        <div className="flex gap-2">
          {/* <Button className={`${category.isActive ? "bg-red-600" : "bg-green-600"}`} size="icon">
            <Power
              className='h-4 w-4'
            />
          </Button> */}

          {/* <Button
            size="icon"
            onClick={() => {
              table.options.meta?.onEdit?.(category);
            }}
          >
            <PencilIcon className="h-4 w-4 text-white" />
          </Button> */}

          <Button
            className={"bg-red-600"}
            size="icon"
            onClick={() =>
              table.options.meta?.handleDeleteCoupon?.(category._id)
            }
          >
            {table?.options.meta?.deletingId == category._id &&
            table.options?.meta?.deleting ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4 " />
            )}
          </Button>
        </div>
      );
    },
  },
];

/* ================= FORM ================= */

const formSchema = z.object({
  couponCode: z
    .string()
    .min(6, "Coupon Code Name must be at least 6 characters"),
  discount: z.number().min(0).max(100),
  expiryDate: z.string().min(1, "Expiry date is required"),
});

/* ================= PAGE ================= */

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coupons, setCoupons] = useState<Category[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [statusActive, setStatusActive] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { couponCode: "", discount: 0, expiryDate: "" },
  });

  const getCoupons = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/coupons/coupons`,
      );
      if (res.data.success) setCoupons(res.data.coupons);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteCoupon = async (id: string) => {
    try {
      setDeleting(true);
      setDeletingId(id);
      console.log(id);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/coupons/remove-coupon`,
        { couponId: id },
      );
      if (res.data.success) getCoupons();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
      setDeletingId(null);
    }
  };

  useEffect(() => {
    getCoupons();
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      let date = new Date(values.expiryDate);
      let data = {
        name: values.couponCode,
        discount: values.discount,
        expiryDate: date.getTime(),
      };
      console.log(data);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/coupons/create-coupon`,
        data,
      );
      if (response.data.success) {
        toast.success(response.data.message);
        getCoupons();
      }
      form.reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  const table = useReactTable({
    data: coupons,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      handleDeleteCoupon,
      deletingId,
      deleting,
    },
  });

  if (loading) return <p className="p-10 text-center">Loading...</p>;

  return (
    <div className="p-12 w-full min-h-screen">
      <div className="flex justify-between mb-6">
        <h1 className="text-xl font-semibold">Coupons</h1>

        <Dialog>
          <DialogTrigger asChild>
            <Button>Create new Coupon</Button>
          </DialogTrigger>

          <DialogContent
            onOpenAutoFocus={(e) => e.preventDefault()}
            onInteractOutside={(e) => e.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle>Create New Coupon</DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="couponCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Coupon Code</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter coupon code" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="discount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Coupon Discount (%)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={"Enter coupon discount"}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expiryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiry Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          value={field.value ? field.value : ""}
                          min={new Date().toISOString().split("T")[0]}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                            console.log(e.target.value);
                          }}
                        />
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
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  No Coupons found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
