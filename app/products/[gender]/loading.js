import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="w-full h-[100vh] flex items-center justify-center">
        <Loader2 className="animate-spin"/>
    </div>
  );
}
