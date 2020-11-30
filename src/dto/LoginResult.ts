type User = {
    username: string,
    token: string,
    expireTime: number
}
export type LoginResult = {
    isValid: boolean;
    user: User | null;
}