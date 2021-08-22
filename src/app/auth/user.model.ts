export class User {
    constructor(private _id: string, private _username: string, private _email: string) {
    }

    get id() {
        return this._id;
    }

    get username() {
        return this._username;
    }

    get email() {
        return this._email;
    }
}