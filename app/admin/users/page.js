"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";

import "@tanstack/react-table";

import useDebounce from "../../hooks/useDebounce";
import { Loader2, X } from "lucide-react";

const columns = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return <h1 className="text-black font-bold">{row.original?.name}</h1>;
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      return <h1 className="text-black font-bold">{row.original?.email}</h1>;
    },
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => {
      return <h1 className="text-black font-bold">{row.original?.phone}</h1>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.original.isVerified;
      return (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {isActive ? "Verified" : "Not Verified"}
        </span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const date = row.original.createdAt
        ? new Date(row.original.createdAt)
        : null;
      return date ? date.toDateString()?.split(" ")?.slice(1,4)?.join(" ") : "N/A";
    },
  },
  // {
  //   id: "actions",
  //   header: "Actions",
  //   enableSorting: false,
  //   cell: ({ row, table }) => {
  //     const category = row.original;
  //     return (
  //       <div className="flex gap-2">
  //         {/* <Button className={`${category.isActive ? "bg-red-600" : "bg-green-600"}`} size="icon">
  //           <Power
  //             className='h-4 w-4'
  //           />
  //         </Button> */}

  //         {/* <Button
  //           size="icon"
  //           onClick={() => {
  //             table.options.meta?.onEdit?.(category);
  //           }}
  //         >
  //           <PencilIcon className="h-4 w-4 text-white" />
  //         </Button> */}

  //         <Button
  //           className={"bg-red-600"}
  //           size="icon"
  //           onClick={() =>
  //             table.options.meta?.handleDeleteCoupon?.(category._id)
  //           }
  //         >
  //           {table?.options.meta?.deletingId == category._id &&
  //           table.options?.meta?.deleting ? (
  //             <Loader2 className="animate-spin" />
  //           ) : (
  //             <Trash2 className="h-4 w-4 " />
  //           )}
  //         </Button>
  //       </div>
  //     );
  //   },
  // },
];

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const [search, setSearch] = useState("");
  let debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/users?query=${encodeURIComponent(debouncedSearch)}`
        );

        setUsers(response.data.users);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [debouncedSearch]);
  

  // if(loading){
  //   return(
  //       <div className="min-h-screen w-full justify-center items-center">
  //           <Loader2 className="animate-spin"/>
  //       </div>
  //   )
  // }

  return (
    <div className="p-12 w-full min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div className="w-1/2">
          <h1 className="text-xl font-semibold">Users</h1>
          <h1 className="text-xs font-semibold mt-2">
            Total Users: {users.length}
          </h1>
        </div>
        <div className="w-1/3 relative">

        <Input
          className="w-full"
          placeholder="Search users"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          />
          {
            search && loading ?
            <Loader2 className="animate-spin size-4"/>
            :
            search && !loading
            ?
            <X className="absolute top-2 size-5 text-gray-500 right-2"/>
            :
            null
          }
          </div>
      </div>
{
  loading 
  ?
   <Loader2 className="animate-spin"/>
   :
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
              {
            table.getRowModel().rows.length ? (
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
                  No Users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>

        </Table>
      </div>
}

    </div>
  );
}
