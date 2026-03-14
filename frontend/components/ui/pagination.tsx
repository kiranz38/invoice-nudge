import React from 'react';

const ChevronLeft = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);
const ChevronRight = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ page, totalPages, onPageChange }) => {
  const range = (start: number, end: number) => Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const renderPageNumbers = () => {
    if (totalPages <= 5) {
      return range(1, totalPages).map((num) => (
        <li key={num} className={`page-item ${num === page ? 'active' : ''}`}>
          <button className="page-link" onClick={() => onPageChange(num)}>
            {num}
          </button>
        </li>
      ));
    } else {
      const pagesToShow = 5;
      const start = Math.max(1, page - Math.floor(pagesToShow / 2));
      const end = Math.min(totalPages, start + pagesToShow - 1);

      const showLeftEllipsis = start > 1;
      const showRightEllipsis = end < totalPages;

      return (
        <>
          {showLeftEllipsis && <li className="page-item"><button className="page-link" onClick={() => onPageChange(1)}>1</button></li>}
          {showLeftEllipsis && <li className="page-item"><button className="page-link" onClick={() => onPageChange(start - 1)}>...</button></li>}
          {range(start, end).map((num) => (
            <li key={num} className={`page-item ${num === page ? 'active' : ''}`}>
              <button className="page-link" onClick={() => onPageChange(num)}>
                {num}
              </button>
            </li>
          ))}
          {showRightEllipsis && <li className="page-item"><button className="page-link" onClick={() => onPageChange(end + 1)}>...</button></li>}
          {showRightEllipsis && <li className="page-item"><button className="page-link" onClick={() => onPageChange(totalPages)}>{totalPages}</button></li>}
        </>
      );
    }
  };

  return (
    <nav aria-label="Page navigation">
      <ul className="pagination">
        <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => onPageChange(page - 1)} aria-label="Previous">
            <ChevronLeft />
          </button>
        </li>
        {renderPageNumbers()}
        <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => onPageChange(page + 1)} aria-label="Next">
            <ChevronRight />
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;