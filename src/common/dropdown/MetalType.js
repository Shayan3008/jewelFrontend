import { getMessageFromAxiosError, makeRequest } from "../../utils/HelperUtils";

const getMetalTypeLOVs = async () => {
    try {

        const response = await makeRequest("GET", null, "/metalType");
        if (response.statusCode === 200) {
            const metalOptions = response.body.map(element => ({
                id: element.metalName,
                name: element.metalName
            }));
            return metalOptions;
        }
    } catch (error) {
        alert(getMessageFromAxiosError(error))
        return null
    }
}

export { getMetalTypeLOVs }