import { getMessageFromAxiosError, makeRequest } from "../../utils/HelperUtils";

const fetchAllVendors = async () => {
    const request = await makeRequest("GET", null, "/vendor");
    try {
        let data = []
        for (let i in request.body) {
            console.log(i)
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