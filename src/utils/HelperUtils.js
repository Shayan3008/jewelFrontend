import axios from "axios";
import { apiUrl, headers } from "../constants/enviourment";

const handleInputChange = (e, setFormData, type) => {
    const { name, value } = e.target;


    setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
    }));
};

const handleDirectInputChange = (name, value, setFormData) => {
    setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
    }));
}

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
    console.log("Token Value:" + localStorage.getItem("token"))
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

const goldRate = (purity, rate) => {
    if (purity === undefined)
        return 0.0
    purity = Number(purity.slice(0, -1))
    return (Number(purity / 24) * rate).toFixed(2);
}


const getMessageFromAxiosError = (error) => error.response.data.message;

const convertDateToCorrectFormat = (dated) => {
    let arrayValue = dated.split("-")
    let date = ""
    for (let i = arrayValue.length - 1; i >= 0; i--) {
        date = date + arrayValue[i] + "-"
    }
    date = date.slice(0, -1);
    return date
}

const validateFields = (data, setValidator, validator) => {
    
    if (checkIfAnyFalse(data)) {
        setValidator(data)
        setTimeout(() => {
            const updatedData = setAllMembersToFalse(validator)
            setValidator(updatedData)
        }, 5000);
        return false;
    }
    return true;
}

const getFilterKey = (formData) => {
    let data = { ...formData }
    let result = ""
    let keys = Object.keys(formData)
    let arr = Object.values(data)
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] !== undefined && arr[i] !== null && arr[i].length > 0)
            result = result + `${keys[i]}=${arr[i]},`
    }
    return result;
}

const Base64ToBlob = (b64Data, contentType = '', sliceSize = 512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
}

const downloadReport = (data, reportFormat, reportName, isReportNameCustom) => {
    let file = Base64ToBlob(data.data, data.httpHeaders['Content-Type'][0]);
    let fileURL = URL.createObjectURL(file);

    let link = document.createElement("a");
    link.href = fileURL;
    let today = new Date();
    let date = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    if (reportFormat === 'excel') {
        link.download = reportName + (!isReportNameCustom ? ("-" + date + "-" + time) : '') + ".xlsx";
    } else {
        link.download = reportName + (!isReportNameCustom ? ("-" + date + "-" + time) : '') + ".pdf";
    }

    // this is necessary as link.click() does not work on the latest firefox
    link.dispatchEvent(
        new MouseEvent("click", { bubbles: true, cancelable: true, view: window })
    );

    setTimeout(function () {
        // For Firefox it is necessary to delay revoking the ObjectURL
        window.URL.revokeObjectURL(data);
        link.remove();
    }, 100);
}

const viewOrEditHelper = (setView, setUpdate) => {
    let categoryData = JSON.parse(localStorage.getItem("update"))
    if (categoryData === null) {
        categoryData = JSON.parse(localStorage.getItem("view"))
        if (categoryData !== null) {
            setView(true)
            setUpdate(false)
        }
    } else {
        setUpdate(true)
    }
    return categoryData
}

const viewButton = () => {
    let categoryData = JSON.parse(localStorage.getItem("update"))
    if (categoryData === null) {
        categoryData = JSON.parse(localStorage.getItem("view"))
        if (categoryData !== null) {
            return true
        }
    } else {
        return false
    }
    return false
}

const handleImageChange = (e, setFormData) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
        const reader = new FileReader();
        reader.onload = (event) => {
            if (reader.readyState === 2) {
                //console.log(event.target.result)
                setFormData((data) => ({
                    ...data,
                    itemImage: event.target.result.split(",")[1]
                }))
            }

        };
        reader.readAsDataURL(selectedImage);
    }
};


export { handleInputChange, navigateToPage, makeRequest, getMessageFromAxiosError, setAllMembersToFalse, checkIfAnyFalse, goldRate, handleDirectInputChange, convertDateToCorrectFormat, validateFields, getFilterKey, downloadReport, viewOrEditHelper, handleImageChange, viewButton }