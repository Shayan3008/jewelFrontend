import axios from "axios";
import { apiUrl, headers } from "../constants/enviourment";

const handleInputChange = (e, setFormData) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
    }));
};

function setAllMembersToFalse(existingState) {
    // Get keys of the existing state object
    const keys = Object.keys(existingState);

    // Construct a new object with all values set to false
    const newState = {};
    keys.forEach(key => {
        newState[key] = false;
    });

    return newState;
}

const navigateToPage = (navigate, path) => {
    // //console.log(path)
    navigate(path)
}

const makeRequest = async (method, body, url) => {
    //console.log(headers)
    const response = await axios({
        method: method,
        url: apiUrl + url,
        data: body,
        headers: headers
    })
    // console.log(response)
    return response.data
}

function checkIfAnyFalse(obj) {
    for (let key in obj) {
        if (obj.hasOwnProperty(key) && obj[key] === true) {
            return true; // Returns true if any value is false
        }
    }
    return false; // Returns false if no value is false
}

const getMessageFromAxiosError = (error) => error.response.data.message;

export { handleInputChange, navigateToPage, makeRequest, getMessageFromAxiosError, setAllMembersToFalse,checkIfAnyFalse }