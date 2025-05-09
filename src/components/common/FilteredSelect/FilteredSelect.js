import React from 'react'
import Select from 'react-dropdown-select'

export default function FilteredSelect({ option, placeholder, setFilters, name, disabled }) {

    return (

        <Select disabled={disabled} className='input-container' style={{
            padding: '1rem',
            margin: '0rem',
            fontSize: '16px',
            border: `1px solid lightgray`,
            borderRadius: '5px',
            outline: 'none',
            transition: 'all 1s ease',
            boxShadow: '0 6px 10px 0 rgba(0, 0, 0, 0.1)',
            width: '29vw',
            zIndex:'1000'

        }} placeholder={"Enter Metal Name"}
            addPlaceholder={placeholder}
            options={option}
            labelField="name"
            valueField="id"
            multi={false}
            // values={option.length > 0 ? [option] : []}
            searchable={true}
            closeOnClickInput={true}
            // create={true}
            separator={true}
            searchBy='name'
            dropdownHeight='300px'
            color="#0074D9"

            onChange={(values) => {
                if (values.length === 0)
                    return
                setFilters(data => ({
                    ...data,
                    [name]: values[0].id
                }))
            }} />


    )
}