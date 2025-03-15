"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { CompanyPUTSchema, TCompanyPUTBodyType, type CompanyResType } from "@/schemaValidations/company.schema"
import companyApiRequest from "@/apiRequests/company"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

interface EditCompanyDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    company: CompanyResType | null
    onEditComplete: (updatedCompany: CompanyResType) => void
}

// Infer the type from the schema

export function EditCompanyDialog({ open, onOpenChange, company, onEditComplete }: EditCompanyDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Initialize the form with useForm hook
    const form = useForm<TCompanyPUTBodyType>({
        resolver: zodResolver(CompanyPUTSchema),
        defaultValues: {
            id: company?.id || "",
            name: company?.name || "",
            email: company?.email || "",
            phone: company?.phone || "",
            taxCode: company?.taxCode || "",
        },
    })

    // Update form values when company changes
    useEffect(() => {
        if (company) {
            form.reset({
                id: company.id || "",
                name: company.name || "",
                email: company.email || "",
                phone: company.phone || "",
                taxCode: company.taxCode || "",
            })
        }
    }, [company, form])

    // Define the submit handler
    async function onSubmit(data: TCompanyPUTBodyType) {
        setIsSubmitting(true)
        try {
            // Call API to update company
            await companyApiRequest.update(data)

            const updatedCompany: CompanyResType = {
                ...company!, // Keep all original properties
                ...data, // Override with updated fields
            }
            // Show success toast
            toast.success(`Đã cập nhật thông tin công ty ${data.name}`)

            // Close dialog and refresh list
            onOpenChange(false)
            onEditComplete(updatedCompany)
        } catch (error) {
            console.error("Error updating company:", error)
            toast.error("Không thể cập nhật thông tin công ty")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Chỉnh sửa thông tin công ty</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tên công ty</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Tên công ty" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="Email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Số điện thoại</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Số điện thoại" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="taxCode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mã số thuế</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Mã số thuế" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="mt-6">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                                Hủy
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Đang lưu...
                                    </>
                                ) : (
                                    "Lưu thay đổi"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

