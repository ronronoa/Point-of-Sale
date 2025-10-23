import React from 'react'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User } from 'lucide-react';

export default function ProfileEdit() {
  return (
    <Dialog>
        <DialogTrigger asChild>
            <button
                className="border px-4 py-2 rounded bg-[#032f30] flex items-center gap-2 text-white cursor-pointer hover:bg-[#02393a]"
                
              >
                <User size={18} />
                <span>Profile</span>
              </button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    Profie
                </DialogTitle>
            </DialogHeader>
        </DialogContent>
    </Dialog>
  )
}
