import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';


import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { BlogsComponent } from './blogs/blogs.component';
import { BlogComponent } from './blogs/blog/blog.component';
import { EditBlogComponent } from './blogs/edit-blog/edit-blog.component';
import { HeaderComponent } from './header/header.component';
import { BlogDetailsComponent } from './blogs/blog-details/blog-details.component';
import { BlogListComponent } from './blogs/blog-list/blog-list.component';
import { CommentComponent } from './blogs/comment/comment.component';
import { CommentEditComponent } from './blogs/comment/comment-edit/comment-edit.component';


@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    BlogsComponent,
    BlogComponent,
    EditBlogComponent,
    HeaderComponent,
    BlogDetailsComponent,
    BlogListComponent,
    CommentComponent,
    CommentEditComponent
  ],
  imports: [
    BrowserModule,
    //AmplifyUIAngularModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
