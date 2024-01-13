import React, { useEffect, useState } from 'react'
import Dropdown from 'react-dropdown';
import ContentHeader from '../../../components/contentHeader/ContentHeader';
import { apiUrl, headers } from '../../../constants/enviourment';
import axios from 'axios';
import { handleInputChange } from '../../../utils/HelperUtils';

export default function AddSubCategory() {
    const [option, setOption] = useState(["earings"])

    let defaultOption = null;
    const [formData, setFormData] = useState({
        name: "",
        parentCategory: ""
    })
    const submitData = () => {
        //console.log("Submitting new category");
        //console.log(formData.categoryName)
    }

    useEffect(() => {
        const fetchData = async () => {
            //console.log("Hello")
        }
        fetchData()

    }, [])
    return (
        <>

            <ContentHeader titleName={"Add Sub Category"} buttonName={"Submit"} submitData={submitData} />
            <div className='formHeader'>

                <h5 style={{
                    margin: 0,
                    background: '#96d496',
                    padding: '0.4rem'
                }}>Sub-Category details</h5>

                <div className='formField'>
                    <div className='divFlex'>
                        <div className='fields'>
                            <h5 className='fieldName'>
                                Category
                            </h5>
                            <div>
                                <Dropdown options={option} name="category" onChange={e => {
                                    setFormData((prevFormData) => ({
                                        ...prevFormData,
                                        "parentCategory": e.value,
                                    }));
                                }} value={defaultOption} placeholder="Select an option" />
                                {/* <p style={{
                                margin: '0.2rem',
                                fontSize: '0.8rem',
                                color: 'red'
                            }}>Category name must be atleast 3 letters</p> */}
                            </div>
                        </div>


                        <div className='fields'>
                            <h5 className='fieldName'>
                                SubCategory Name
                            </h5>
                            <div>
                                <input className='fieldInput' name='name' placeholder='Enter SubCategory Name' />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
