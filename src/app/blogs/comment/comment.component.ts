
import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { Comment } from '../comment/comment.model'


import { take, tap } from 'rxjs/operators'
import { APIService } from 'src/APIservice.service';
import { BlogsService } from '../blogs.service';

const { v4: uuidv4 } = require('uuid');

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  @Input() comment: Comment = {} as Comment;
  text = "";
  editText = this.text;
  isReplying = false;
  isEdit = false;
  @Input() user: User | null = null;

  constructor(private authService: AuthService, private APIservice: APIService, private blogsService: BlogsService) { }

  async ngOnInit() {
    
      const likesData = await this.APIservice.getLikes(this.comment.id, this.comment.blog_id, "like");
      const likes = JSON.parse(likesData.data.body);

      likes.forEach((element: any) => {
        if (element)
          this.comment.likesUsers.add(element.user_id)
      });
      this.comment.likes = this.comment.likesUsers.size;

      const dislikesData = await this.APIservice.getLikes(this.comment.id, this.comment.blog_id, "dislike");
      const dislikes = JSON.parse(dislikesData.data.body);

      dislikes.forEach((element: any) => {
        if (element)
          this.comment.dislikesUsers.add(element.user_id)
      });
      this.comment.dislikes = this.comment.dislikesUsers.size;
    

  }

  onReply() {
    this.isReplying = !this.isReplying;
  }

  onEdit() {
    this.isEdit = true;
  }

  onAddComment() {

    this.user = this.authService.userSubject.value;
    if (this.user != null) {

      let parentsArray = this.comment.parents;

      parentsArray.push(this.comment.id)
      let depth = this.comment.depth + 1;
      const c = new Comment(uuidv4(), this.user.id, this.user.username, this.text, depth, this.comment.blog_id, parentsArray);
      console.log(c.depth);
      this.APIservice.createComment(c).then(res => {
        this.comment.comments.push(c);
        this.isReplying = false;
        this.editText = "";
      })
      

    }

  }

  onEditComment() {
    this.comment.text = this.editText;
    this.APIservice.createComment(this.comment);
    this.isEdit = false;
  }

  async onDeleteComment() {
    if (this.comment.comments.length === 0) {
      this.APIservice.deleteComment(this.comment.blog_id, this.comment.id).then(res => {
        this.blogsService.deleteComment(this.comment.blog_id, this.comment);
      });
    }


  }

  async onLike() {
    if (this.user != null) {
      if (!this.comment.likesUsers.has(this.user.id)) {

        await this.APIservice.likeComment(this.user.id, this.comment.id, this.comment.blog_id, "like").then(res => {
          this.comment.likes++;
          if (this.user)
            this.comment.likesUsers.add(this.user.id)
        }).catch(e => {
          console.log(e);
        });
      } else {

        await this.APIservice.likeComment(this.user.id, this.comment.id, this.comment.blog_id, "unlike").then(res => {
          this.comment.likes--;
          if (this.user)
            this.comment.likesUsers.delete(this.user.id)
        }).catch(e => {
          console.log(e);
        });
      }
      if (this.comment.dislikesUsers.has(this.user.id)) {

        await this.APIservice.likeComment(this.user.id, this.comment.id, this.comment.blog_id, "undislike").then(res => {
          this.comment.dislikes--;
          if (this.user)
            this.comment.dislikesUsers.delete(this.user.id);
        }).catch(e => {
          console.log(e);
        });
      }
    }

  }

  isLiked() {
    if (this.user != null) {
      return this.comment.likesUsers.has(this.user.id)
    }
    return false;
  }


  async onDislike() {
    console.log("dislike called");
    if (this.user != null) {
      if (!this.comment.dislikesUsers.has(this.user.id)) {

        await this.APIservice.likeComment(this.user.id, this.comment.id, this.comment.blog_id, "dislike").then(res => {
          this.comment.dislikes++;
          if (this.user)
            this.comment.dislikesUsers.add(this.user.id)
        }).catch(e => {
          console.log(e);
        });
      } else {

        await this.APIservice.likeComment(this.user.id, this.comment.id, this.comment.blog_id, "undislike").then(res => {
          this.comment.dislikes--;
          if (this.user)
            this.comment.dislikesUsers.delete(this.user.id)
        }).catch(e => {
          console.log(e);
        });
      }
      if (this.comment.likesUsers.has(this.user.id)) {

        await this.APIservice.likeComment(this.user.id, this.comment.id, this.comment.blog_id, "unlike").then(res => {
          this.comment.likes--;
          if (this.user)
            this.comment.likesUsers.delete(this.user.id);
        }).catch(e => {
          console.log(e);
        });
      }
    }
  }

  isDisliked() {
    if (this.user != null) {
      return this.comment.dislikesUsers.has(this.user.id)
    }
    return false;
  }
}
