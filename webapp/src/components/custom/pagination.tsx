import { cn } from "@/lib/shadcn/utils";

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

interface CustomPaginationProps {
    currentPage: number;
    totalPage: number;
    pageRange: number;
    className?: string;
    onClickPage: (page: number) => void;
}

export function CustomPagination({
    currentPage,
    totalPage,
    pageRange,
    className,
    onClickPage,
}: CustomPaginationProps) {
    const getPageNumbers = () => {
        const pages = [];
        const start = Math.max(1, currentPage - pageRange);
        const end = Math.min(totalPage, currentPage + pageRange);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        return pages;
    };

    const pages = getPageNumbers();

    if (totalPage <= 0) {
        return null;
    }

    return (
        <Pagination className={cn(className)}>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious 
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1) onClickPage(currentPage - 1);
                        }}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                </PaginationItem>
                {
                    pages[0] > 1 && (
                        <>
                            <PaginationItem>
                                <PaginationLink href="#" onClick={() => onClickPage(1)}>1</PaginationLink>
                            </PaginationItem>
                            {pages[0] > 2 && <PaginationEllipsis />}
                        </>
                    )
                }
                {
                    pages.map((page) => (
                        <PaginationItem key={page}>
                            <PaginationLink
                                href="#"
                                isActive={page === currentPage}
                                onClick={(e) => {
                                    e.preventDefault();
                                    onClickPage(page);
                                }}
                                >
                                {page}
                            </PaginationLink>
                        </PaginationItem>
                    ))
                }
                {
                    pages[pages.length - 1] < totalPage && (
                        <>
                            {pages[pages.length - 1] < totalPage - 1 && <PaginationEllipsis />}
                            <PaginationItem>
                                <PaginationLink href="#" onClick={() => onClickPage(totalPage)}>
                                    {totalPage}
                                </PaginationLink>
                            </PaginationItem>
                        </>
                    )
                }
                <PaginationItem>
                    <PaginationNext 
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < totalPage) onClickPage(currentPage + 1);
                        }}
                        className={currentPage === totalPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}