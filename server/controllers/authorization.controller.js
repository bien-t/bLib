const initialCheck = (req, res) => {
    try {
        res.send({ user: req.session.user });
    } catch (err) {
        return res.status('401').json({
            error: "Something went wrong"
        })
    }
}

const checkSession = (req,res,next) =>{
    try {
        if((!req.session.user)){
            return res.json({error:'You are not logged in'})
        }
    } catch(err){
        return res.status('401').json({
            error: "Something went wrong"
        })
    }
    next()
}

export default {

    initialCheck,
    checkSession,
}
