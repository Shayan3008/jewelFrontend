import React from 'react'
import { FaSearch } from "react-icons/fa";
import Button from 'react-bootstrap/Button';

export default function SearchFilter({ search, setSearch, fetchData, filterDropDown, filter, setFilter }) {
     return (
        <div style={{
            display: 'flex',
            width: '50%',
            padding: '1rem 0'
        }}>

            {search === null || search === undefined ? null : <input style={{
                padding: '0.5rem',
                width: '100%'
            }} onKeyDown={(e) => {
                if (e.key === "Enter") {
                    fetchData()
                }
            }} placeholder='Search' value={search} onChange={(e) => setSearch(e.target.value)} />}
            <div style={{ width: '20%' }}>
                <Button style={{ borderRadius: '0px', height: '100%' }} variant="success" onClick={async () => {
                    fetchData()
                }}>
                    Search <FaSearch />

                </Button>

            </div>
        </div>
    )
}
