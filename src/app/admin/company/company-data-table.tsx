"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, RefreshCcw } from "lucide-react"
import { CompanyTable } from "@/components/admin/company/company-table"
import { TablePagination } from "@/components/admin/common-table/table-pagination"
import companyApiRequest from "@/apiRequests/company"
import { CompanyResType } from "@/schemaValidations/company.schema"
import { CompanyTableFilterCard } from "@/components/admin/company/company-table-filter"
import { ApproveCompanyDialog } from "@/components/admin/company/company-request/company-request-list"
import { EditCompanyDialog } from "@/components/admin/company/edit-company-dialog"

export default function CompanyDataTable() {
  // Data state
  const [companies, setCompanies] = useState<CompanyResType[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [totalCount, setTotalCount] = useState<number>(0)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(5)

  // Search state
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("")

  // Filter state
  const [licenseFilter, setLicenseFilter] = useState<string>(`all`)

  //Edit state
  const [selectedCompany, setSelectedCompany] = useState<CompanyResType | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // Approval dialog state
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false)


  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 1000)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Reset to first page when search/filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearchTerm, licenseFilter])

  //fetching tour
  const fetchCompany = async () => {
    setLoading(true)

    try {
      // Calculate skip for pagination
      const skip = (currentPage - 1) * pageSize

      // Build OData query parameters
      const params = new URLSearchParams()
      // Pagination
      params.append("$top", pageSize.toString())
      params.append("$skip", skip.toString())
      params.append("$count", "true")

      // Filtering
      const filterConditions: string[] = []

      // Search term (name, email contains)
      if (debouncedSearchTerm) {
        filterConditions.push(`contains(name, '${debouncedSearchTerm}')`);
        filterConditions.push(`contains(email, '${debouncedSearchTerm}')`);
      }

      // License filter
      if (licenseFilter !== "all") {
        filterConditions.push(`lisenced eq ${licenseFilter}`)
      }


      // Combine filter conditions
      if (filterConditions.length > 0) {
        params.append("$filter", filterConditions.join(" or "))
      }

      // Construct the OData query string
      const queryString = `?${params.toString()}`

      // Use tourApiService instead of direct fetch
      const response = await companyApiRequest.getWithOData(queryString)
      console.log(queryString)
      setCompanies(response.payload?.value)
      setTotalCount(response.payload["@odata.count"] || 0)
    } catch (error) {
      console.error("Error fetching tour data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch data with OData parameters
  useEffect(() => {
    fetchCompany()
  }, [currentPage, pageSize, debouncedSearchTerm, licenseFilter])


  //handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true)
    fetchCompany();
    setIsRefreshing(false)
  }

  //handle update
  const handleEditCompany = (company: CompanyResType) => {
    setSelectedCompany(company)
    setIsEditDialogOpen(true)
  }


  const handleEditComplete = (updatedCompany: CompanyResType) => {
    // Update the company in the local state without refetching
    setCompanies((prevCompanies) =>
      prevCompanies.map((company) => (company.id === updatedCompany.id ? updatedCompany : company)),
    )
  }

  // Handle opening the approval dialog
  const handleOpenApprovalDialog = () => {
    setIsApprovalDialogOpen(true)
  }

  // Handle approval completion
  const handleApprovalComplete = () => {
    // Refresh the main company list to reflect changes
    fetchCompany()
  }
  // Calculate total pages
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))

  // Handle page navigation
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("")
    setDebouncedSearchTerm("")
    setLicenseFilter(`all`)
  }
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="mx-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">Quản lý danh sách công ty</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="default"
                onClick={handleRefresh}
                disabled={loading || isRefreshing}
                className="gap-2"
              >
                {isRefreshing ? (
                  <>
                    <RefreshCcw className="h-4 w-4 animate-spin" />
                    <span>Refreshing...</span>
                  </>
                ) : (
                  <>
                    <RefreshCcw className="h-4 w-4" />
                    <span>Refresh</span>
                  </>
                )}
              </Button>

              <Button
                variant={"core"}
                size="default"
                className="gap-2"
                disabled={loading || isRefreshing}
                onClick={handleOpenApprovalDialog}
              >
                <PlusCircle className="h-4 w-4" />
                <span>Duyệt công ty</span>
              </Button>
            </div>
          </div>
        </CardHeader>



        {/* Search and Rating Filter */}
        <CompanyTableFilterCard searchTerm={searchTerm} setSearchTerm={setSearchTerm} licenseFilter={licenseFilter} setLicenseFilter={setLicenseFilter} pageSize={pageSize} setPageSize={setPageSize} />
        {/* Table */}
        <div className="rounded-md border">
          <CompanyTable companies={companies} loading={loading} onEditCompany={handleEditCompany} resetFilters={resetFilters} />
        </div>
        {/* Pagination */}
        <TablePagination currentPage={currentPage} loading={loading} onNextPage={handleNextPage}
          onPreviousPage={handlePreviousPage} totalPages={totalPages}
        />
      </Card>


      {/* Approval Dialog */}
      <ApproveCompanyDialog
        open={isApprovalDialogOpen}
        onOpenChange={setIsApprovalDialogOpen}
        onApprovalComplete={handleApprovalComplete}
      />
      {/* Edit Dialog */}
      <EditCompanyDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        company={selectedCompany}
        onEditComplete={handleEditComplete}
      />
    </div>
  )
}