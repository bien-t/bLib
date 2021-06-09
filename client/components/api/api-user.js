const getUserInfo = async (params, signal) => {
    try {
        let response = await fetch('/api/user/' + params.userId, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            signal: signal
        })

        return await response.json()
    } catch (err) {
        console.log(err)
    }
}


const addToCollection = async (bookStatus, params) => {
    try {
        let response = await fetch('/api/user/collection/' + params.userId + '/add', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookStatus)
        })

        return await response.json()
    } catch (err) {
        console.log(err)
    }
}

const getUserCollection = async (params, pages, status) => {
    try {
        let obj = {};
        obj.pages = pages;
        obj.status = status;
        let response = await fetch('/api/user/collection/' + params.userId, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(obj)
        })

        return await response.json()
    } catch (err) {
        console.log(err)
    }
}

const deleteFromCollection = async (params, bookId) => {
    try {
        let response = await fetch('/api/user/collection/' + params.userId, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookId)
        })

        return await response.json()
    } catch (err) {
        console.log(err)
    }
}

const changeEmail = async (email, userId) => {
    try {
        let response = await fetch('/api/user/' + userId.userId + '/email', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(email)
        })
        return await response.json()

    } catch (err) {
        console.log(err)
    }
}

const changePassword = async (password, userId) => {
    try {
        let response = await fetch('/api/user/' + userId.userId + '/password', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(password)
        })
        return await response.json()

    } catch (err) {
        console.log(err)
    }
}
export default {
    getUserInfo,
    addToCollection,
    getUserCollection,
    deleteFromCollection,
    changeEmail,
    changePassword,
}