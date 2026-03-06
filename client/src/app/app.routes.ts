import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { adminGuard } from './core/guards/admin-guard';
import { guestGuard } from './core/guards/guest-guard';
import { authMatchGuard } from './core/guards/auth-match-guard';

export const routes: Routes = [
  // User routes - wrapped in UserLayout, only matches when logged in
  {
    path: '',
    loadComponent: () => import('./layouts/user-layout/user-layout').then((m) => m.UserLayout),
    canMatch: [authMatchGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/user/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'library',
        loadComponent: () => import('./pages/user/bookmarks/bookmarks').then((m) => m.Bookmarks),
      },
      {
        path: 'stories',
        loadComponent: () => import('./pages/user/my-blogs/my-blogs').then((m) => m.MyBlogs),
      },
      {
        path: 'stats',
        loadComponent: () => import('./pages/user/stats/stats').then((m) => m.Stats),
      },
      {
        path: 'create',
        loadComponent: () =>
          import('./pages/user/create-blog/create-blog').then((m) => m.CreateBlog),
      },
      {
        path: 'edit/:slug',
        loadComponent: () => import('./pages/user/edit-blog/edit-blog').then((m) => m.EditBlog),
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import('./pages/user/notifications/notifications').then((m) => m.Notifications),
      },
      {
        path: 'settings',
        loadComponent: () => import('./pages/user/settings/settings').then((m) => m.Settings),
      },
      // Shared routes accessible within user layout
      {
        path: 'blog/:slug',
        loadComponent: () =>
          import('./pages/public/blog-detail/blog-detail').then((m) => m.BlogDetail),
      },
      {
        path: 'profile/:username',
        loadComponent: () => import('./pages/public/profile/profile').then((m) => m.Profile),
      },
      {
        path: 'search',
        loadComponent: () => import('./pages/public/search/search').then((m) => m.Search),
      },
      {
        path: 'explore',
        loadComponent: () => import('./pages/public/explore/explore').then((m) => m.Explore),
      },
      {
        path: 'category/:slug',
        loadComponent: () =>
          import('./pages/public/category-page/category-page').then((m) => m.CategoryPage),
      },
      {
        path: 'tag/:slug',
        loadComponent: () => import('./pages/public/tag-page/tag-page').then((m) => m.TagPage),
      },
      {
        path: 'about',
        loadComponent: () => import('./pages/public/about/about').then((m) => m.About),
      },
      {
        path: 'terms',
        loadComponent: () => import('./pages/public/terms/terms').then((m) => m.Terms),
      },
      {
        path: 'privacy',
        loadComponent: () => import('./pages/public/privacy/privacy').then((m) => m.Privacy),
      },
      {
        path: 'contact',
        loadComponent: () => import('./pages/public/contact/contact').then((m) => m.Contact),
      },
      {
        path: 'membership',
        loadComponent: () =>
          import('./pages/public/membership/membership').then((m) => m.Membership),
      },
    ],
  },

  // Public routes - fallback when not logged in
  {
    path: '',
    loadComponent: () =>
      import('./layouts/public-layout/public-layout').then((m) => m.PublicLayout),
    children: [
      { path: '', loadComponent: () => import('./pages/public/home/home').then((m) => m.Home) },
      {
        path: 'explore',
        loadComponent: () => import('./pages/public/explore/explore').then((m) => m.Explore),
      },
      // {
      //   path: 'search',
      //   loadComponent: () => import('./pages/public/search/search').then((m) => m.Search),
      // },
      {
        path: 'blog/:slug',
        loadComponent: () =>
          import('./pages/public/blog-detail/blog-detail').then((m) => m.BlogDetail),
      },
      {
        path: 'profile/:username',
        loadComponent: () => import('./pages/public/profile/profile').then((m) => m.Profile),
      },
      {
        path: 'category/:slug',
        loadComponent: () =>
          import('./pages/public/category-page/category-page').then((m) => m.CategoryPage),
      },
      {
        path: 'tag/:slug',
        loadComponent: () => import('./pages/public/tag-page/tag-page').then((m) => m.TagPage),
      },
      {
        path: 'login',
        loadComponent: () => import('./pages/public/login/login').then((m) => m.Login),
        canActivate: [guestGuard],
      },
      {
        path: 'register',
        loadComponent: () => import('./pages/public/register/register').then((m) => m.Register),
        canActivate: [guestGuard],
      },
      {
        path: 'about',
        loadComponent: () => import('./pages/public/about/about').then((m) => m.About),
      },
      {
        path: 'terms',
        loadComponent: () => import('./pages/public/terms/terms').then((m) => m.Terms),
      },
      {
        path: 'privacy',
        loadComponent: () => import('./pages/public/privacy/privacy').then((m) => m.Privacy),
      },
      {
        path: 'contact',
        loadComponent: () => import('./pages/public/contact/contact').then((m) => m.Contact),
      },
      {
        path: 'membership',
        loadComponent: () =>
          import('./pages/public/membership/membership').then((m) => m.Membership),
      },
    ],
  },

  // Admin routes - wrapped in AdminLayout, protected by authGuard + adminGuard
  {
    path: 'admin',
    loadComponent: () => import('./layouts/admin-layout/admin-layout').then((m) => m.AdminLayout),
    canActivate: [authGuard, adminGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/admin/admin-dashboard/admin-dashboard').then((m) => m.AdminDashboard),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./pages/admin/manage-users/manage-users').then((m) => m.ManageUsers),
      },
      {
        path: 'blogs',
        loadComponent: () =>
          import('./pages/admin/manage-blogs/manage-blogs').then((m) => m.ManageBlogs),
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./pages/admin/manage-reports/manage-reports').then((m) => m.ManageReports),
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./pages/admin/manage-categories/manage-categories').then(
            (m) => m.ManageCategories,
          ),
      },
      {
        path: 'tags',
        loadComponent: () =>
          import('./pages/admin/manage-tags/manage-tags').then((m) => m.ManageTags),
      },
    ],
  },

  // 404 wildcard
  {
    path: '**',
    loadComponent: () => import('./pages/public/not-found/not-found').then((m) => m.NotFound),
  },
];
