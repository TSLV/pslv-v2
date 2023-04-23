const createConnection = async (data) => {
    return await fetch("/api/connection/create", {
        method: "POST",
        data: JSON.stringify(data)
    }).then(async res => await res.json())
}