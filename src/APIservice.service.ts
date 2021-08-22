import { HttpHeaders } from "@angular/common/http";
import { Injectable, Injector, OnInit, SkipSelf } from "@angular/core";
import { CognitoUser } from "amazon-cognito-identity-js";

import { API } from 'aws-amplify';
import { Subject } from "rxjs";
import { AuthService } from "./app/auth/auth.service";
import { User } from "./app/auth/user.model";
import { Blog } from "./app/blogs/blog.model";
import { Comment } from "./app/blogs/comment/comment.model";




@Injectable({ providedIn: 'root' })
export class APIService implements OnInit {

    constructor(private authService: AuthService) {}

    ngOnInit() {
        
    }

    async fetchBlogs() {
        //let jwt = this.getJwtToken();

        let params = { // OPTIONAL
            headers: {
               
            }, // OPTIONAL
            response: true, // OPTIONAL (return the entire Axios response object instead of only response.data)
            queryStringParameters: {
                
            },

        };
        console.log("before sending");
        return API.get('blogsApi', '/blogs', params);
    }

    async getBlog(blogId: string) {
        let params = { // OPTIONAL
            headers: {
                'Authorization': this.authService.getJWTToken()
            }, // OPTIONAL
            response: true, // OPTIONAL (return the entire Axios response object instead of only response.dat
        };
        return API.get('blogsApi', `/blogs/${blogId}`, params)
    }

    async putBlog(blog: Blog) {
        let params = { // OPTIONAL
            headers: {
                'Authorization': this.authService.getJWTToken()
            },
            body: {
                "id": blog.id,
                "title": blog.title,
                "text": blog.text,
                "author": blog.author,
                "author_id": blog.author_id
            }, 
            response: true
        }; 
        console.log(await this.authService.getJWTToken());
        return API.put('blogsApi', '/blogs', params)
    }

    async editBlog(blog: Blog) {
        let params = { // OPTIONAL
            headers: {
                'Authorization': this.authService.getJWTToken()
            },
            body: {
                "title": blog.title,
                "text": blog.text,
                "author": blog.author,
                "author_id": blog.author_id
            }, 
            response: true
        }; 
        return API.put('blogsApi', `/blogs/${blog.id}`, params)
    }

    async deleteBlog(id: string){
        let params = {
            headers: {
                'Authorization': this.authService.getJWTToken()
            },
            response: true
        }
        
        return API.del('blogsApi', `/blogs/${id}`, params)
    }



    async createComment(comment: Comment) {
        let sk = "";
        for(let i = 0; i < comment.parents.length - 1; i++){
            sk += comment.parents[i] + ",";
        }
       
        sk += comment.parents[comment.parents.length - 1];
       
        let body = {
            "comment_id": comment.id,
            "blog_id": comment.blog_id,
            "user_id": comment.user_id,
            "username": comment.username,
            "text": comment.text,
            "depth": comment.depth,
            "parents": sk 
        };
        let params = {
            headers: {
                'Authorization': this.authService.getJWTToken()
            },
            body: body,
            response: true
        }
        return API.put('blogsApi', `/blogs/${comment.blog_id}/comments`, params)
    }

    async getComments(blogId: string){
        let params = {
            headers: {
                
            },
            response: true,
        };
        return API.get('blogsApi', `/blogs/${blogId}/comments`, params);
    }


    async deleteComment(blogId: string, commentId: string){
        let params = {
            headers: {
                'Authorization': this.authService.getJWTToken()
            },
            response: true,
        };
        return API.del('blogsApi', `/blogs/${blogId}/comments/${commentId}`, params)
    }

    async likeComment(user_id: string, comment_id: string, blog_id: string, type: string) {
        let params = {
            headers: {
                'Authorization': this.authService.getJWTToken()
            },
            body: {
                "user_id": user_id
            },
            response: true,
        };
        return API.put('blogsApi', `/blogs/${blog_id}/comments/${comment_id}/${type}`, params)
    }

    async getLikes(comment_id: string, blog_id: string, type: string){
        let params = {
            headers: {
                
            },
            response: true,
        };
        return API.get('blogsApi', `/blogs/${blog_id}/comments/${comment_id}/${type}`, params)
    }

    /*
    async getUser(userId: string) {
        let params = {
            headers: {
                'Authorization': this.authService.getJWTToken()
            },
            response: true,
        };
        
        return API.get('blogsApi', `/users/${userId}`, params);
        
        
    }*/

    /*
    async createUser(user: User) {
        let body = {
            id: user.id,
            username: user.username,
            email: user.email
        }
        let params = {
            headers: {},
            response: true,
            body: body
        };
        API.put('blogsApi', '/users', params).then(response => {
            console.log(response);
        })

    }

    */

}