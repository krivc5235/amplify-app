import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { BlogDetailsComponent } from './blogs/blog-details/blog-details.component';
import { BlogListComponent } from './blogs/blog-list/blog-list.component';
import { BlogsComponent } from './blogs/blogs.component';
import { CommentEditComponent } from './blogs/comment/comment-edit/comment-edit.component';
import { EditBlogComponent } from './blogs/edit-blog/edit-blog.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/blogs',
    pathMatch: 'full'
  },
  {
    path: 'blogs',
    component: BlogsComponent,
    children: [
      {
        path: '',
        component: BlogListComponent,
        pathMatch: "full"
      },
      {
        path: 'new',
        component: EditBlogComponent
      },
      {
        path: ':id/edit',
        component: EditBlogComponent
      },
      {
        path: ':id',
        component: BlogDetailsComponent

      },
      {
        path: ':id/comments/:comment_id/edit',
        component: CommentEditComponent
      },
      {
        path: ':id/comments/new',
        component: CommentEditComponent
      }

    ]
  },
  {
    path: 'auth',
    component: AuthComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
