import "reflect-metadata"
import { Connection, createConnection } from "typeorm"
type DatabaseProp = {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
}
class Database {
    public connection: Connection | undefined
    constructor() {
        const host: string = process.env.MYSQL_HOST || "localhost"
        const portStr: string = process.env.MYSQL_PORT || "3306"
        const username: string = process.env.MYSQL_USERNAME || "root"
        const password: string = process.env.MYSQL_PASSWORD || "root"
        const database: string = process.env.MYSQL_DB || "add_one_club"
        const port = parseInt(portStr)
        this.createConnection({ host, port, username, password, database })
    }
    async createConnection({ host, port, username, password, database }: DatabaseProp) {
        try {
            this.connection = await createConnection({
                type: 'mysql',
                host,
                port,
                username,
                password,
                database,
                entities: [
                    __dirname + "/../entity/*.ts",
                    __dirname + "/../entity/*.js"
                ],
                synchronize: true
            })
            console.log('db connected')
        } catch (err) {
            console.log(err)
        }
    }
}
export default new Database()