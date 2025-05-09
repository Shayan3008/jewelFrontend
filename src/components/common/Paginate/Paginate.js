import React from 'react';
import ReactPaginate from 'react-paginate';
import SelectSizeComponent from '../Select/SelectSizeComponent';
export default function Paginate({ pageCount, setPage, page, size, setSize }) {
    const pageSizes = [
        {
            id: 5,
            name: 5
        },
        {
            id: 10,
            name: 10
        },
        {
            id: 15,
            name: 15
        }
    ]
    return (
        <div>
            <div style={{ display: 'flex',justifyContent:"space-between",alignItems:"center" }}>

                <p>page {page + 1} of {Math.ceil(pageCount)}</p>

                <SelectSizeComponent data={size} option={pageSizes}  placeholder={"Set Page Size"} setPageSize={(values) => { setSize(values[0].id) }} />
            </div>
            <div style={{ height: '10px' }}></div>
            <ReactPaginate

                breakLabel="..."
                nextLabel="next >"
                onPageChange={(e) => {
                    console.log(page)
                    setPage(e.selected)
                }}
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
                forcePage={page}
            />


        </div>
    )
}
