import React from 'react'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Edit } from 'lucide-react';

export default function EditUsers({ product, onUpdated}) {
  return (
    <Dialog>
        <DialogTrigger asChild>
            <Edit size={20} className='text-blue-500 hover:scale-105 transition duration-200 cursor-pointer'/>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    Edit User
                </DialogTitle>
            </DialogHeader>

            <form action="">

            </form>
        </DialogContent>
    </Dialog>
  )
}
