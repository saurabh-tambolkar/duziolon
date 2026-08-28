import apiClient from "@/app/context/apiInstance";
import React, { useEffect, useState } from "react";
import {
  MapPin,
  CheckCircle2,
  Home,
  Pencil,
  Trash2,
  Loader2,
  PlusIcon,
  Ticket,
  CircleCheck,
  CircleCheckBig,
} from "lucide-react";
import Image from "next/image";
import noAddress from "../app/assets/noAddress.png";
import { Button } from "./ui/button";
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "./ui/input";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { stateInfo } from "../lib/stateDistrict";
import Link from "next/link";
import { useUser } from "@/app/context/AuthContext";

function ProfilerForm({ activeForm }) {
  const getUserHeaderTitle = () => {
    switch (activeForm) {
      case "profile":
        return "Personal Information";
      case "address":
        return "Your Addresses";
      case "tickets":
        return "Your Tickets";
      case "payment":
        return "Payment Methods";
    }
  };

  const getUserSection = () => {
    switch (activeForm) {
      case "profile":
        return <Profile title={getUserHeaderTitle()}/>;
      case "address":
        return <Addresses title={getUserHeaderTitle()} />;
      case "tickets":
        return <Tickets title={getUserHeaderTitle()} />;
      case "payment":
        return "Payment Methods";
    }
  };

  return <div>{getUserSection()}</div>;
}

export default ProfilerForm;

function Addresses({ title }) {
  let [addresses, setAddress] = useState([]);
  let [loading, setLoading] = useState(false);
  let [deleting, setDeleting] = useState(false);
  let [deletingId, setDeletingId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editAddress, setEditAddress] = useState(null);

  const formSchema = z.object({
    flat: z.string().trim().min(2, "Flat / House No. is required"),

    street: z
      .string()
      .trim()
      .min(2, "Street name must be at least 2 characters"),

    landmark: z
      .string()
      .trim()
      .min(2, "Landmark must be at least 2 characters"),

    city: z.string().trim().min(2, "City must be at least 2 characters"),

    taluqa: z.string().trim().min(2, "Taluqa must be at least 2 characters"),

    district: z.string().trim().min(2, "Please select a district"),

    state: z.string().trim().min(2, "Please select a state"),

    postalCode: z
      .string()
      .trim()
      .regex(/^\d{6}$/, "Postal Code must be exactly 6 digits"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      flat: "",
      street: "",
      landmark: "",
      city: "",
      taluqa: "",
      district: "",
      postalCode: "",
    },
  });
  const editForm = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      flat: "",
      street: "",
      landmark: "",
      city: "",
      taluqa: "",
      district: "",
      postalCode: "",
    },
  });

  let getAddress = async () => {
    try {
      setLoading(true);
      let result = await apiClient.post("/address/addresses");
      if (result.data.success) {
        setAddress(result.data.addresses);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  let deleteAddress = async (id) => {
    try {
      setDeleting(true);
      setDeletingId(id);
      let result = await apiClient.post(`/address/address-delete/${id}`);
      if (result.data.success) {
        getAddress();
      }
    } catch (err) {
      console.log(err);
    } finally {
      setDeleting(false);
      setDeletingId("");
    }
  };

  useEffect(() => {
    getAddress();
  }, []);

  const selectedState = form.watch("state");

  const states = stateInfo.map((item) => item.state);

  const selectedStateData = stateInfo.find(
    (item) => item.state === selectedState,
  );

  const districts = selectedStateData?.districts || [];

  const selectedStateEdit = editForm.watch("state");

  const selectedStateDataEdit = stateInfo.find(
    (item) => item.state === selectedStateEdit,
  );

  const districtsEdit = selectedStateDataEdit?.districts || [];

  const onSubmit = async (values) => {
    try {
      console.log(values);
      setIsSubmitting(true);
      const response = await apiClient.post("/address/add-address", values);
      if (response.data.success) {
        toast.success(response.data.message);
        getAddress();
      }
      form.reset();
    } catch (err) {
      console.log(err);
      toast.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  const onEditSubmit = async (values) => {
    try {
      console.log(values);
      setIsSubmitting(true);
      const response = await apiClient.post(
        `/address/address/${editAddress._id}`,
        values,
      );
      if (response.data.success) {
        toast.success(response.data.message);
        getAddress();
      }
      form.reset();
    } catch (err) {
      console.log(err);
      toast.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Edit Address</DialogTitle>
          </DialogHeader>

          <Form {...editForm}>
            <form
              onSubmit={editForm.handleSubmit(onEditSubmit)}
              className="space-y-5"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Flat */}
                <FormField
                  control={editForm.control}
                  name="flat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Flat / House No.</FormLabel>
                      <FormControl>
                        <Input placeholder="Flat No. 302" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Street */}
                <FormField
                  control={editForm.control}
                  name="street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street/Society</FormLabel>
                      <FormControl>
                        <Input placeholder="MG Road" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Landmark */}
                <FormField
                  control={editForm.control}
                  name="landmark"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Landmark</FormLabel>
                      <FormControl>
                        <Input placeholder="Near SBI Bank" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* City */}
                <FormField
                  control={editForm.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="Pune" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Taluqa */}

                {/* District */}
                <FormField
                  control={editForm.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>

                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          editForm.setValue("district", ""); // Reset district when state changes
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select State" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent className="max-h-60 overflow-scroll">
                          {states.map((state) => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="district"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>District</FormLabel>

                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={!selectedStateEdit}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                selectedStateEdit
                                  ? "Select District"
                                  : "Select State First"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          {districtsEdit.map((district) => (
                            <SelectItem key={district} value={district}>
                              {district}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="taluqa"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Taluqa</FormLabel>
                      <FormControl>
                        <Input placeholder="Haveli" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Postal Code */}
                <FormField
                  control={editForm.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Postal Code</FormLabel>
                      <FormControl>
                        <Input placeholder="411001" maxLength={6} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>

                <DialogClose asChild>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save"}
                  </Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{title}</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon />{" "}
              <span className="hidden md:block">Add New Address</span>
            </Button>
          </DialogTrigger>

          <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
            <DialogHeader>
              <DialogTitle>Add Category</DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Flat */}
                  <FormField
                    control={form.control}
                    name="flat"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Flat / House No.</FormLabel>
                        <FormControl>
                          <Input placeholder="Flat No. 302" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Street */}
                  <FormField
                    control={form.control}
                    name="street"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street/Society</FormLabel>
                        <FormControl>
                          <Input placeholder="MG Road" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Landmark */}
                  <FormField
                    control={form.control}
                    name="landmark"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Landmark</FormLabel>
                        <FormControl>
                          <Input placeholder="Near SBI Bank" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* City */}
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="Pune" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Taluqa */}

                  {/* District */}
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>

                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            form.setValue("district", ""); // Reset district when state changes
                          }}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select State" />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent className="max-h-60 overflow-scroll">
                            {states.map((state) => (
                              <SelectItem key={state} value={state}>
                                {state}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="district"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>District</FormLabel>

                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={!selectedState}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={
                                  selectedState
                                    ? "Select District"
                                    : "Select State First"
                                }
                              />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent className="max-h-60 overflow-scroll">
                            {districts.map((district) => (
                              <SelectItem key={district} value={district}>
                                {district}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="taluqa"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Taluqa</FormLabel>
                        <FormControl>
                          <Input placeholder="Haveli" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Postal Code */}
                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="411001"
                            maxLength={6}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>

                  <DialogClose asChild>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Saving..." : "Save"}
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      {loading ? (
        <div className="flex items-center min-h-screen justify-center">
          <Loader2 className="animate-spin -mt-24" />
        </div>
      ) : addresses && addresses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {addresses.map((item) => (
            <div
              key={item._id}
              className="relative rounded-2xl border border-gray-200 bg-white p-2 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              {/* Default Badge */}
              {item.isDefault && (
                <div className="absolute top-4 right-4 flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                  <CheckCircle2 size={14} />
                  Default
                </div>
              )}

              {/* Icon */}
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
                <Home className="text-gray-700" size={24} />
              </div>

              {/* Address */}
              <div className="space-y-2 text-sm text-gray-700">
                <h2 className="text-lg font-bold text-black">
                  {item.flat}
                  {item.flat && ","} {item.street}
                </h2>

                {item.landmark && (
                  <p className="text-gray-500">{item.landmark}</p>
                )}

                <div className="flex items-start gap-2">
                  <MapPin size={18} className="mt-0.5 text-gray-500" />

                  <div>
                    <p>
                      {item.city}, {item.taluqa}
                    </p>

                    <p>{item.district}</p>

                    <p>
                      {item.state} -{" "}
                      <span className="font-semibold">{item.postalCode}</span>
                    </p>

                    <p>{item.country}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-2 flex items-center justify-end gap-3 border-t pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditAddress(item);
                    console.log(item);

                    editForm.reset({
                      flat: item.flat,
                      street: item.street,
                      landmark: item.landmark,
                      city: item.city,
                      taluqa: item.taluqa,
                      district: item.district,
                      state: item.state,
                      postalCode: item.postalCode,
                    });

                    setEditOpen(true);
                  }}
                >
                  Edit
                </Button>

                <button
                  onClick={() => {
                    deleteAddress(item._id);
                  }}
                  className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                >
                  {item._id == deletingId ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      <Trash2 size={16} />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <Image
            alt="img"
            src={noAddress}
            className="w-full h-100 object-center mt-16 object-contain"
            width={200}
            height={200}
          />
        </div>
      )}
    </div>
  );
}

 export const getStatusStyles = (status) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800 text-sm border-green-600 border-2";
      case "in-process":
        return "bg-amber-100 text-amber-800 text-sm border-amber-600 border-2";
      case "closed":
        return "bg-red-100 text-red-800 text-sm border-red-600 border-2";
    }
  };

function Tickets({ title }) {
  let [tickets, setTickets] = useState([]);
  let [loading, setLoading] = useState(false);

  let getTickets = async () => {
    try {
      setLoading(true);
      let result = await apiClient.get("/tickets/tickets");
      if (result.data.success) {
        setTickets(result.data.tickets);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTickets();
  }, []);

 

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
      {loading ? (
        <Loader2 className="animate-spin size-4 text-center m-12" />
      ) : (
        <div>
          {tickets && tickets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {tickets.map((item) => {
                return (
                  <Link
                    href={`/tickets/${item._id}`}
                    key={item._id}
                    className="relative rounded-2xl border border-gray-200 bg-white p-2 shadow-sm hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex justify-between items-center">
                      <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
                        <Ticket className="text-gray-700" size={24} />
                      </div>
                      <p
                        className={`${getStatusStyles(item.status)} px-4 rounded-full`}
                      >
                        {item?.status?.charAt(0).toUpperCase() + item?.status?.slice(1)}
                      </p>
                    </div>
                    <h1 className="text-gray-600 my-2 font-bold text-sm truncate">
                      Ticket ID: {item._id}
                    </h1>
                    <h1 className="text-black font-bold text-md truncate">
                      {item.subject}
                    </h1>
                    <p className="text-gray-500 text-sm line-clamp-2 overflow-hidden">
                      {item.description}
                    </p>
                    <p className="text-gray-500 mt-2 text-xs line-clamp-2 overflow-hidden">
                      {item.createdAt.split("T")[0]}
                    </p>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-sm text-gray-400 mt-12">
              No tickets found
            </p>
          )}
        </div>
      )}
    </div>
  );
}

const formSchema=z.object({
  email:z.email(),
  name:z.string().min(2,"Name must be atleast 2 characters"),
  phone:z.string().min(10, { message: 'Must be a valid mobile number' })
      .max(10, { message: 'Must be a valid mobile number' }),
})

function Profile({title}){
  const {currentUser,setCurrentUser} = useUser()

  const [isSubmitting,setIsSubmitting] = useState(false)

  const form = useForm({
    resolver:zodResolver(formSchema),
    defaultValues:{
      email:currentUser.email,
      phone:currentUser.phone,
      name:currentUser.name,
    }
  })

  const { isDirty } = form.formState;

  async function onSubmit(values) {
      try{
        setIsSubmitting(true)
        let response = await apiClient.put("/update-profile",values)
        if(response.data.success){
          let {name,phone} = response.data.userDetails
          setCurrentUser((prev)=>{
            return({...prev,name:name,phone:phone})
          })
          toast.success(response.data.message)
        }
      }
      catch(err){
        console.log(err)
        toast.error(err?.response.data.message)
      }
      finally{
        setIsSubmitting(false)
      }
    }

  return(
    <div>
    <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
      <div className="mt-12 mx-auto w-full md:w-1/3">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="relative space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({field})=>(
                <FormItem>
                  <FormLabel className="text-black">Email</FormLabel>
                  <FormControl>
                    <Input disabled={true} placeholder="Enter your email" {...field}/>
                  </FormControl>
                  {/* <FormDescription>You cant edit your email.</FormDescription> */}
                  <CircleCheckBig className="absolute top-8 right-5 size-4 text-green-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({field})=>(
                <FormItem>
                  <FormLabel className="text-black">Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({field})=>(
                <FormItem>
                  <FormLabel className="text-black">Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter phone number" {...field}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-black hover:bg-gray-900 text-white" disabled={isSubmitting || !isDirty}>
                      {isSubmitting ? (
                        <>
                          Please wait
                          <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                        </>
                      ) : (
                        'Update Profile'
                      )}
                    </Button>
          </form>
        </Form>
        {/* <FormDescription/> */}
      </div>
    </div>
  )
}
