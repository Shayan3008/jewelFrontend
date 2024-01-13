import React from 'react'
import Select from 'react-dropdown-select'

export default function SelectComponent({ validator, option, data, placeholder, setFormData, validationText, name,disabled }) {
    return (
        <div>

            <Select disabled={disabled} className='input-container' style={{
                padding: '1rem',
                margin: '1rem',
                fontSize: '16px',
                border: `1px solid ${validator ? 'red' : 'lightgray'}`,
                borderRadius: '5px',
                outline: 'none',
                transition: 'all 1s ease',
                boxShadow: '0 6px 10px 0 rgba(0, 0, 0, 0.1)',
                width: '29vw',


            }} placeholder={placeholder}
                options={option}
                labelField="name"
                valueField="id"
                defaultValue={option.find(e => e.id === data)}
                values={option.length > 0 && data ? [option.find(e => e.id === data)] : []}
                onChange={(values) => {
                    if(values.length === 0)
                        return
                    setFormData(data => ({
                        ...data,
                        [name]: values[0].id
                    }))
                }} />
            <p style={{
                display: validator ? 'block' : `none`,
                color: 'red',
                paddingTop: '2px',
                margin: '1rem'
            }}>{validationText}</p>
        </div>
    )
}
