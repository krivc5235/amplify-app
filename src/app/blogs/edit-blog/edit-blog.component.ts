import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { APIService } from 'src/APIservice.service';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { Blog } from '../blog.model';
import { BlogsService } from '../blogs.service';

const { v4: uuidv4 } = require('uuid');


@Component({
  selector: 'app-edit-blog',
  templateUrl: './edit-blog.component.html',
  styleUrls: ['./edit-blog.component.css']
})
export class EditBlogComponent implements OnInit {
  isEditMode = false;
  id: string = '';
  title: string = "";
  text: string = "";

  constructor(private route: ActivatedRoute, private authService: AuthService, private blogsService: BlogsService, private router: Router, private APIservice: APIService) { }

  async ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.isEditMode = this.id != null;
    })
    this.prepareForm();

  }

  prepareForm() {
    if (this.isEditMode) {
      const blog = this.blogsService.getBlog(this.id);
      if (blog != null) {
        this.title = blog.title;
        this.text = blog.text;
      }

    }
  }

  onSubmit() {
    let user = this.authService.userSubject.value
    let blog: Blog;
    if (user != null) {
      if (!this.isEditMode) {
        blog = new Blog(uuidv4(), this.title, this.text, user.username , user.id);
       
        this.APIservice.putBlog(blog).then(res => {
           this.blogsService.createBlog(blog);
        });
      }
      else {

        let blog = this.blogsService.getBlog(this.id);
        if (blog != null || blog != undefined) {
          blog.title = this.title;
          blog.text = this.text;
          
          this.APIservice.editBlog(blog).then(res =>{
            console.log(res);
            if(blog != undefined) {
              this.blogsService.updateBlog(blog.id, blog);
            }
            
          });
        }
      }
      
    }

    this.router.navigate(["/blogs"])

  }

}
