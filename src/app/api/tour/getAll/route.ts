/* eslint-disable @typescript-eslint/no-explicit-any */
import { type NextRequest, NextResponse } from 'next/server';
import { tourApiRequest } from '@/apiRequests/tour';
import { formatDateToYYYYMMDD } from '@/lib/utils';
import { TourSortBy } from "@/types/tours";

export async function GET(request: NextRequest) {
  try {
    // Get search params
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '9');
    const minPrice = parseInt(searchParams.get('minPrice') || '0');
    const maxPrice = parseInt(searchParams.get('maxPrice') || '100000000');
    const sortBy = searchParams.get('sortBy') || '';
    const date = searchParams.get('date') || '';
    const isPriceFilterActive = searchParams.get('isPriceFilterActive') === 'true';
    const isDateFilterActive = searchParams.get('isDateFilterActive') === 'true';

    // Calculate skip for pagination
    const skip = (page - 1) * pageSize;

    // Build filter string
    let filterString = `contains(title, '${query.trim()}') and isDeleted eq false`;
    
    if (isPriceFilterActive) {
      filterString += ` and onlyFromCost ge ${minPrice} and onlyFromCost le ${maxPrice}`;
    }
    
    if (isDateFilterActive && date) {
      const formattedDate = formatDateToYYYYMMDD(new Date(date));
      filterString += ` and tourScheduleResponses/any(t: t/openDate eq ${formattedDate})`;
    }

    // Build params for OData query
    const params: Record<string, any> = {
      $filter: filterString,
      $top: pageSize,
      $skip: skip,
      $count: true,
    };

    // Add sorting if needed
    if (sortBy === TourSortBy.PriceAsc.toString()) {
        params.$orderby = "onlyFromCost asc";
      } else if (sortBy === TourSortBy.PriceDesc.toString()) {
        params.$orderby = "onlyFromCost desc";
      }

    // Make the API call
    const response = await tourApiRequest.getOdataTour(params);
    
    // Extract data
    const tours = response.payload.value || [];
    const total = response.payload["@odata.count"] || tours.length;

    // Return the response
    return NextResponse.json({ 
      tours, 
      total 
    });
  } catch (error) {
    console.error("Error fetching tours:", error);
    return NextResponse.json(
      { error: "Failed to fetch tours" },
      { status: 500 }
    );
  }
}