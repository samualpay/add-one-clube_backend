import HttpException from '../exception/HttpException'
import database from '../config/database'
export class BaseRepository {
    getConnection() {
        if (database.connection) {
            return database.connection
        } else {
            throw new HttpException(500, 'db connect failed')
        }
    }
}