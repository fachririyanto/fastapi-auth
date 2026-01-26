import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { CustomPagination } from "./pagination";

describe("CustomPagination", () => {
    const defaultProps = {
        currentPage: 3,
        totalPage: 10,
        pageRange: 2,
        onClickPage: vi.fn(),
    };

    it("should return null if totalPage is less than or equal to 0", () => {
        const { container } = render(<CustomPagination {...defaultProps} totalPage={0} />);
        expect(container.firstChild).toBeNull();
    });

    it("should render pagination with correct page range", () => {
        render(<CustomPagination {...defaultProps} currentPage={5} pageRange={1} />);

        // With range 1 and current 5, it should show 4, 5, 6
        expect(screen.getByText("4")).toBeInTheDocument();
        expect(screen.getByText("5")).toBeInTheDocument();
        expect(screen.getByText("6")).toBeInTheDocument();
    });

    it("shows ellipsis when there are many pages", () => {
        render(<CustomPagination {...defaultProps} currentPage={3} totalPage={10} />);
        const ellipses = screen.getByText("More pages");
        expect(ellipses).toBeInTheDocument();
    });

    it("calls onClickPage with the correct value when a page is clicked", () => {
        render(<CustomPagination {...defaultProps} currentPage={3} totalPage={10} />);
        const pageLink = screen.getByText("4");
        fireEvent.click(pageLink);
        expect(defaultProps.onClickPage).toHaveBeenCalledWith(4);
    });

    it("calls onClickPage with the correct value when previous page is clicked", () => {
        render(<CustomPagination {...defaultProps} currentPage={3} totalPage={10} />);
        const pageLink = screen.getByText("Previous");
        fireEvent.click(pageLink);
        expect(defaultProps.onClickPage).toHaveBeenCalledWith(2);
    });

    it("calls onClickPage with the correct value when next page is clicked", () => {
        render(<CustomPagination {...defaultProps} currentPage={3} totalPage={10} />);
        const pageLink = screen.getByText("Next");
        fireEvent.click(pageLink);
        expect(defaultProps.onClickPage).toHaveBeenCalledWith(4);
    });
});