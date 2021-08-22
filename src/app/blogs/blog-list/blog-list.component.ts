import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { APIService } from 'src/APIservice.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Blog } from '../blog.model';
import { BlogsService } from '../blogs.service';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.css']
})
export class BlogListComponent implements OnInit, OnDestroy {

  blogs: Blog[] = [];
  blogsSubscription: Subscription = new Subscription();


  constructor(private router: Router, private authService: AuthService, private blogsService: BlogsService, private route: ActivatedRoute, private APIservice: APIService) { }

  ngOnInit() {
    this.blogs = this.blogsService.getBlogs();
    this.blogsSubscription = this.blogsService.updatedBlogs.subscribe(blogs => {
      this.blogs = blogs;
      //console.log(blogs)
    })
    
    
  }

  


  ngOnDestroy() {
    this.blogsSubscription.unsubscribe();
  }

}
