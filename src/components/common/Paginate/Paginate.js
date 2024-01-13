import React from 'react'
import ReactPaginate from 'react-paginate';
export default function Paginate({ pageCount, setPage }) {
    return (
        <ReactPaginate
            breakLabel="..."
            nextLabel="next >"
            onPageChange={(e) => { setPage(e.selected) }}
            pageRangeDisplayed={5}
            pageCount={Math.ceil(pageCount)}
            previousLabel="< previous"
            renderOnZeroPageCount={null}
            containerClassName="pagination justify-content-center"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            activeClassName="active"
        />
    )
}
