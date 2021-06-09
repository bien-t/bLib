const createAccount = async (user) => {
    try {
        let response = await fetch('/api/signup', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(user)
        })
        return await response.json()
    } catch (err) {
        console.log(err)
    }
}

export default createAccount;