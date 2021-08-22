import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { APIService } from 'src/APIservice.service';
import { AuthService } from '../auth/auth.service';
import Amplify, { Auth, Hub } from 'aws-amplify';
import { Blog } from '../blogs/blog.model';
import { BlogsService } from '../blogs/blogs.service';
import { Subscription } from 'rxjs';
import { User } from '../auth/user.model';
import { take, tap } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  subscription = new Subscription()
  user: User |null = null;

  constructor(private authService: AuthService, private router: Router, private APIservice: APIService, private blogsService: BlogsService) { }

  ngOnInit(): void {
    this.authService.userSubject.pipe(take(1), tap(user => {
      this.user = user;
    }))
    this.subscription = this.authService.userSubject.subscribe(user => {
      this.user = user;
    })
    
  }

  onLogOut() {
    this.authService.logOut();
  }

  async onFetchData() {
    try {
      console.log("fetching data");
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

  ngOnDestroy() {
      this.subscription.unsubscribe();
  }


}
