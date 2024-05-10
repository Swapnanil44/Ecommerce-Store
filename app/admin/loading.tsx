import { Loader2 } from "lucide-react";

export default function AdminLoading(){
    return <div className="flex flex-col justify-center h-screen">
        <div className="flex justify-center">
        <Loader2 className="size-24 animate-spin"></Loader2>
        </div>
    </div>
}