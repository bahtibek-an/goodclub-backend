import bcrypt from "bcrypt";


export const createHashPassword = async (password: string) => {
    return bcrypt.hash(password, 12);
}