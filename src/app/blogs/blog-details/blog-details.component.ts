import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { Auth } from 'aws-amplify';
import { Subscription } from 'rxjs';
import { APIService } from 'src/APIservice.service';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { Blog } from '../blog.model';
import { BlogsService } from '../blogs.service';
import { Comment } from '../comment/comment.model'

const { v4: uuidv4 } = require('uuid');

@Component({
  selector: 'app-blog-details',
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.css']
})
export class BlogDetailsComponent implements OnInit, OnDestroy {
  blog: Blog = {} as Blog;
  subscription = new Subscription();
  userSubscription = new Subscription();
  id: string = "";
  comment = ""
  user: User | null = null;



  constructor(private route: ActivatedRoute, private blogsService: BlogsService, private router: Router, private authService: AuthService, private APIservice: APIService) { }

  async ngOnInit(){
    this.id = this.route.snapshot.params["id"];
    this.blog = (<Blog>this.blogsService.getBlog(this.id));
    this.subscription = this.route.params.subscribe(
      (params: Params) => {
        this.id = params["id"];
        this.blog = (<Blog>this.blogsService.getBlog(this.id));
      }
    )
    this.userSubscription = this.authService.userSubject.subscribe(user => {
      this.user = user;
    })
    //this.prepareBlogData()
    this.prepareCommentData();
  }
  


  async prepareBlogData() {
    this.APIservice.getBlog(this.blog.id).then(d => {
      console.log(d);
    });
    //console.log(data);
  }
  
  async prepareCommentData() {
    const comments = await this.blogsService.returnComments(this.id);
    
    this.blog.comments = [];
    comments.forEach(comment => {
      const parentsArray = comment.parents;
      if(comment.depth == 0) {
        this.blog.comments.push(comment);
      }
      else{
        let parentComment: Comment | undefined;
        let coms: any = this.blog.comments;
        for(let i = 0; i < parentsArray.length; i++) {
          parentComment = coms.find((c: any) => c.id === parentsArray[i])
          coms = parentComment?.comments
        }
        parentComment?.comments.push(comment);
      }
    });
    
  }

  

  async onDeleteBlog() {
    this.APIservice.deleteBlog(this.blog.id).then(res => {
      this.blogsService.deleteBlog(this.blog);
      this.router.navigate(["/blogs"]);
    });
    
  }

  async onSubmitComment() {
    this.user = this.authService.userSubject.value;
    if (this.user != null) {
      let parentsArray = new Array<string>();
      const c = new Comment(uuidv4(), this.user.id, this.user.username, this.comment, 0, this.blog.id, parentsArray);
      this.APIservice.createComment(c).then(res => {
        //console.log(res);
        this.blog.comments.push(c);
        this.comment = "";
      })
      
      
    }

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }

}
