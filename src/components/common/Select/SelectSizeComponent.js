import React from 'react'
import Select from 'react-dropdown-select';

export default function SelectSizeComponent({ validator, option, data, placeholder, setPageSize }) {
    return (
        <div>

            <Select className='input-container' style={{
                padding: '1rem',
                margin: '1rem',
                fontSize: '16px',
                border: `1px solid ${validator ? 'red' : 'lightgray'}`,
                borderRadius: '5px',
                outline: 'none',
                transition: 'all 1s ease',
                boxShadow: '0 6px 10px 0 rgba(0, 0, 0, 0.1)',
                width: '15vw',


            }} placeholder={placeholder}
                options={option}
                labelField="name"
                valueField="id"
                values={option !== undefined && option.length > 0 && data ? [option.find(e => e.id === data)] : []}
                searchable={true}
                closeOnClickInput={true}
                // create={true}
                separator={true}
                addPlaceholder={placeholder}
                searchBy='name'
                dropdownHeight='300px'
                color="#0074D9"

                onChange={setPageSize}
                // clearable={true}
            />
        </div>
    )
}
