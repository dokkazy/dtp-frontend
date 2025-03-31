"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { Loader2 } from "lucide-react"
import { tourOdataResType, TourResType } from "@/schemaValidations/tour-operator.shema"
import { TourEditInfoForm } from "./edit-tour-info-form"
import TourEditScheduleForm from "./edit-tour-schedule"

interface UpdateTourDialogProps {
    tour: tourOdataResType
    open: boolean
    onOpenChange: (open: boolean) => void
    onUpdateSuccess: (updatedTour: TourResType) => void
}

export function UpdateTourDialog({ tour: initialTour, open, onOpenChange, onUpdateSuccess }: UpdateTourDialogProps) {
    const [activeTab, setActiveTab] = useState("info")
    const [tour, setTour] = useState<tourOdataResType>(initialTour)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Reset to first tab when dialog is closed
    useEffect(() => {
        if (!open) {
            setActiveTab("info")
        }
    }, [open])

    const handleUpdateSuccess = () => {
        // Update local tour state if needed
        onUpdateSuccess(tour as TourResType)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[850px]">
                <DialogHeader>
                    <DialogTitle>Chỉnh sửa thông tin Tour</DialogTitle>
                    <DialogDescription>Chọn thông tin bạn muốn chỉnh sửa</DialogDescription>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex items-center justify-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin mr-2" />
                        <p>Loading tour data...</p>
                    </div>
                ) : error ? (
                    <div className="p-4 text-center text-red-500">{error}</div>
                ) : (
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="flex flex-auto mb-4">
                            <TabsTrigger value="info">Thông tin cơ bản</TabsTrigger>
                            <TabsTrigger value="destinations">Địa điểm</TabsTrigger>
                            <TabsTrigger value="schedule">Lịch Trình</TabsTrigger>
                            <TabsTrigger value="tickets">Vé</TabsTrigger>
                        </TabsList>

                        <TabsContent value="info" className="space-y-4">
                            <TourEditInfoForm tourId={tour.id} onUpdateSuccess={handleUpdateSuccess} />
                        </TabsContent>

                        <TabsContent value="destinations" className="space-y-4">
                            {/* Destinations edit form will go here */}
                        </TabsContent>

                        <TabsContent value="schedule" className="space-y-4">
                            {/* Schedule edit form will go here */}
                            <TourEditScheduleForm tourId={tour.id} onUpdateSuccess={handleUpdateSuccess} />
                        </TabsContent>

                        <TabsContent value="tickets" className="space-y-4">
                            {/* Tickets edit form will go here */}
                        </TabsContent>
                    </Tabs>
                )}
            </DialogContent>
        </Dialog>
    )
}

