import { getMessageFromAxiosError, makeRequest } from "../../utils/HelperUtils";

const fetchKarigarLOV = async () => {

    try {
        const response = await makeRequest("GET", null, "/karigar/karigarLov");
        if (response.statusCode === 200) {
            const karigars = response.body.map(element => ({
                id: element.id,
                name: element.karigarName
            }));
            return karigars;
        }
        return null;

    } catch (error) {
        alert(getMessageFromAxiosError(error))
        return null
    }
};

export { fetchKarigarLOV }