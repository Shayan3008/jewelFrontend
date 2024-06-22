import { getMessageFromAxiosError, makeRequest } from "../../utils/HelperUtils";

const fetchAllVendorHeaders = async () => {
    const request = await makeRequest("GET", null, "/vendor-header");
    try {
        let data = []
        for (let i in request.body) {
            let data2 = {}
            data2.id = request.body[i].id
            data2.name = request.body[i].name
            data.push(data2)
        }
        return data;
    } catch (error) {
        alert(getMessageFromAxiosError(error))
        return null;
    }
}

export {fetchAllVendorHeaders}