import { Component, Input, OnInit } from '@angular/core';
import { Blog } from '../blog.model';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
  @Input() blog: Blog = {} as Blog;

  constructor() { }

  ngOnInit(): void {
  }

}
