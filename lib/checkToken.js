import jwt from "jsonwebtoken"
export function checkToken(req){
    try {
        let token = req.headers.get("authorization")?.split(" ")[1]
        if(!token){
            return false
        }
        else{
            const decoded = jwt.verify(token,process.env.JWTSECRETKEY)
            return decoded?.user?.id
        }
    } catch (error) {
        console.log(error)
    }
}