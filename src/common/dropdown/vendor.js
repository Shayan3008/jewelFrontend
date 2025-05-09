import { getMessageFromAxiosError, makeRequest } from "../../utils/HelperUtils";

const fetchAllVendors = async () => {
    const request = await makeRequest("GET", null, "/vendor/vendorLov");
    try {
        let data = []
        for (let i in request.body) {

            let data2 = {}
            data2.id = request.body[i].id
            data2.name = request.body[i].vendorName
            data.push(data2)
        }
        return data;
    } catch (error) {
        alert(getMessageFromAxiosError(error))
        return null;
    }
}

export { fetchAllVendors }