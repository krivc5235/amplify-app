export class Comment{
    comments: Comment[] = [];
    likes: number = 0;
    dislikes: number = 0;
    likesUsers: Set<string> = new Set<string>();
    dislikesUsers: Set<string> = new Set<string>();

    constructor(private _id: string, private _user_id: string, private _username: string, private _text: string, private _depth: number, private _blog_id: string, private _parents: Array<string>,){
    }

    get id() {
        return this._id;
    }

    get user_id() {
        return this._user_id;
    }

    get text() {
        return this._text;
    }

    set text(text: string) {
        this._text = text;
    }

    get username() {
        return this._username;
    }

    get parents() {
        return this._parents.slice();
    }

    get blog_id() {
        return this._blog_id;
    }

    get depth() {
        return +this._depth;
    }
}