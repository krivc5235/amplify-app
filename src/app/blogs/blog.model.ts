import { Comment } from "./comment/comment.model";

export class Blog {

    comments: Comment[] = [];

    constructor(private _id: string, public title: string, public text: string, private _author: string, private _author_id: string) {}
    

    get id(): string {
        return this._id;
    }

    get author(): string{
        return this._author;
    }


    get author_id(): string{
        return this._author_id;
    }
    
}