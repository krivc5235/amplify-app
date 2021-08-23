import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { APIService } from "src/APIservice.service";
import { Blog } from "./blog.model";
import { Comment } from "./comment/comment.model";
const { v4: uuidv4 } = require('uuid');


@Injectable({ providedIn: 'root' })
export class BlogsService {
   
    blogs: Blog[] = [];
    updatedBlogs = new Subject<Blog[]>();

    constructor(private APIservice: APIService) { }


    getBlogs() {
        return this.blogs;
    }

    getBlog(id: string) {
        return this.blogs.find(blog => blog.id === id)
    }

    setBlogs(blogs: Blog[]) {
        this.blogs = blogs;
        this.updatedBlogs.next(this.blogs.slice());
    }

    createBlog(blog: Blog) {
        this.blogs.push(blog);
        this.updatedBlogs.next(this.blogs.slice())
        console.log(this.blogs)
    }

    async returnComments(id: string) {
        let commentsArray: Comment[] = []
        const commentsData = await this.APIservice.getComments(id);
        const comments = JSON.parse(commentsData.data.body);
        //console.log("comments");
        //console.log(comments);
        comments.forEach((element: any) => {
            let parentsArray = new Array();
            if(parseInt(element.depth) > 0) {
                let array = element.parents.split(",");
                for(let i = 0; i < array.length; i++) {
                    parentsArray.push(array[i]);
                }
            }
            let c = new Comment(element.id, element.user_id, element.username, element.text, element.depth, id, parentsArray)
            if (commentsArray.length == 0) {
                commentsArray.push(c);
            } else {
                let index = 0;
                while(index < commentsArray.length && c.depth > commentsArray[index].depth) {
                    index ++;
                }
                commentsArray.splice(index, 0, c);
            }
        });
        return commentsArray;
    }

    updateBlog(id: string, blog: Blog) {
        console.log("Old: ")
        console.log(this.blogs)

        this.blogs[this.blogs.findIndex(blog => blog.id === id)] = blog;
        this.updatedBlogs.next(this.blogs.slice())
        console.log("New:")
        console.log(this.blogs)
    }

    deleteBlog(blog: Blog) {
        const index = this.blogs.indexOf(blog);
        console.log(this.blogs);
        console.log(index);
        this.blogs.splice(index, 1);
        console.log(this.blogs);
        this.updatedBlogs.next(this.blogs.slice());
    }

    getComments(blogId: string) {
        return this.blogs.find(x => x.id === blogId)?.comments;
    }

    addComment(blogId: string, comment: Comment) {
        let blog = this.blogs.find(x => x.id === blogId);
        if (blog != null) {
            blog.comments.push(comment);
        }
    }

    deleteComment(blog_id: string, comment: Comment) {
        let blog = this.blogs.find(blog => blog.id === blog_id);
      
        if(blog) {
           
            let parentsArray = comment.parents;
            let parentComment: Comment | undefined;
            let coms: any = blog.comments;
            for(let i = 0; i < parentsArray.length; i++) {
                parentComment = coms.find((c: any) => c.id === parentsArray[i])
                coms = parentComment?.comments
            }
            let removeIndex = coms.find((c: any) => c.id === comment.id);
            let index = coms.indexOf(removeIndex);
            
            console.log(index);
            coms.splice(index, 1);
        } else {
            console.log("nekki ne stima");
        }
    }

    
}