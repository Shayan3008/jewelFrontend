const apiUrl = "http://82.180.145.63:8080"
const headers = {
    "content-type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Authorization": localStorage.getItem("token") == null ? `` : `Bearer ${localStorage.getItem("token")}`
}


export { apiUrl, headers }