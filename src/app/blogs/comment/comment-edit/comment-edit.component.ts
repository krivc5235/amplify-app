import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router, RoutesRecognized } from '@angular/router';
import { BlogsService } from '../../blogs.service';
import {Comment} from '../comment.model'

import { Auth } from 'aws-amplify'
import { Blog } from '../../blog.model';

const { v4: uuidv4 } = require('uuid');

@Component({
  selector: 'app-comment-edit',
  templateUrl: './comment-edit.component.html',
  styleUrls: ['./comment-edit.component.css']
})
export class CommentEditComponent implements OnInit {
  comment: string = ""
  isEditMode: boolean = false;
  commentId: string = "";
  blogId: string = "";
  blog: any = {};
  user: any = {}

  constructor(private router: Router, private route: ActivatedRoute, private blogsService: BlogsService) { }

  ngOnInit(): void {
    this.blogId = this.route.snapshot.params["id"];
    this.blog = this.blogsService.getBlog(this.blogId)
    this.route.params.subscribe((params: Params) => {
      this.commentId = params['comment_id'];
      this.isEditMode = this.commentId != "";
    })
    this.prepareForm();
  }

  async prepareForm() {
    this.user = await Auth.currentAuthenticatedUser();
    if(!this.user.username){
      this.router.navigate(["/blogs"]);
    }
    console.log(this.user);
    if (this.isEditMode) {
      
    }
  }


  onSubmit() {

    
    if (!this.isEditMode) {
      //const c = new Comment(uuidv4, this.user.attributes.sub, this.user.attributes.username, this.comment);
      //this.blogsService.addComment(this.blogId, c);
    }
    else {
      
    }
    this.router.navigate([`/blogs/${this.blogId}`])
  }

  onBack(){
    this.router.navigate([`/blogs/${this.blogId}`])
  }
}
