import { Fragment, useCallback } from "react";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink } from "~/components/ui/pagination";

const PaginationContainer = ({ onClick, totalPages, currPage, pageReveal = 1 }: { onClick: (i: number) => void, totalPages: number, currPage:number, pageReveal?: number }) => {
    const handlePageClick = useCallback((pageNumber: number) => {
        onClick(pageNumber);
    }, [onClick]);

    const getVisiblePagesForward = useCallback((currPage: number) => {
        const pages = [];
        for (let i = currPage + 1; i <= Math.min(totalPages, currPage + pageReveal); i++) {
            pages.push(i);
        }
        // Using max number as replacement for '...'
        if (pages.length > 0) {
            if(pages[pages.length - 1] < totalPages-1)pages.push(Number.POSITIVE_INFINITY)
            if(pages[pages.length-1]!==totalPages) pages.push(totalPages)
        }
        return pages;
    }, [totalPages, pageReveal]);

    const getVisiblePagesBackward = useCallback((currPage: number) => {
        const pages = [];
        for (let i = currPage - 1; i >= Math.max(1, currPage - pageReveal); i--) {
            pages.unshift(i);
        }
        // Using max number as replacement for '...'
        if (pages.length > 0) {
            if(pages[0]>2) pages.unshift(Number.POSITIVE_INFINITY);
            if(pages[0]!==1) pages.unshift(1)
        }
        return pages;
    }, [pageReveal,currPage]);


    return (
        <Pagination>
            <PaginationContent>
                {getVisiblePagesBackward(currPage).map((page,i) => (
                    <PaginationItem key={i}>
                        {page!==Number.POSITIVE_INFINITY?
                        <PaginationLink 
                            key={page} 
                            onClick={() => handlePageClick(page)}
                        >
                            {page}
                        </PaginationLink>
                        :<PaginationEllipsis></PaginationEllipsis>}
                    </PaginationItem>
                ))}
                <PaginationItem>
                    <PaginationLink onClick={()=>handlePageClick(currPage)} isActive={true}>
                        {currPage}
                    </PaginationLink>
                </PaginationItem>
                {getVisiblePagesForward(currPage).map((page,i) => (
                    <PaginationItem key={i}>
                        {page!==Number.POSITIVE_INFINITY?
                        <PaginationLink 
                            key={page} 
                            onClick={() => handlePageClick(page)}
                        >
                            {page}
                        </PaginationLink>
                        :<PaginationEllipsis></PaginationEllipsis>}
                    </PaginationItem>
                ))}
            </PaginationContent>
        </Pagination>
    );
};

export default PaginationContainer;