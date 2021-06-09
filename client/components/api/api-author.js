const getAuthorData = async (params, signal) => {
    try {
        let response = await fetch('/api/author/' + params.authorId, {
            method:'GET',
            headers: {
                'Accept': 'application/json',
            },
            signal:signal
        })

        return await response.json()
    } catch (err) {
        console.log(err)
    }
}


export default {
    getAuthorData
}