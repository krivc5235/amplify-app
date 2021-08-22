import { Component, OnInit} from '@angular/core';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { Auth } from 'aws-amplify'
import { APIService } from 'src/APIservice.service';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import { Blog } from './blog.model';
import { BlogsService } from './blogs.service';


@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.css']
})
export class BlogsComponent implements OnInit {

constructor(private authService: AuthService, private APIservice: APIService, private blogsService: BlogsService) {}

  user: User | null = null;

  ngOnInit(){
    this.authService.authenticateUser();
    this.user = this.authService.userSubject.value;
    this.authService.userSubject.subscribe(user => {
      this.user = user;
    })
    this.prepareBlogs();
  }
  
  async prepareBlogs() {
    try {
      const data = await this.APIservice.fetchBlogs();
      const blogsData = JSON.parse(data.data.body);
      console.log(blogsData);
      const blogs = blogsData.map(
        (blog: any) => {
          return new Blog(blog.id, blog.title, blog.text, blog.author, blog.author_id);
        }
      )
      this.blogsService.setBlogs(blogs);
    } catch(err) {
      console.log(err);
    }
    
  }

}
