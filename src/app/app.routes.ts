// import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Signup } from './components/signup/signup';
import { AccountSetup } from './components/account-setup/account-setup';
import { Homepage } from './components/homepage/homepage';
import { BookJob } from './components/book-job/book-job';
import { CurrentBookings } from './components/current-bookings/current-bookings';
// import { ReportData } from './components/report-data/report-data';
import { ComplianceDocs } from './components/compliance-docs/compliance-docs';
import { AdminDashboard } from './components/admin-dashboard/admin-dashboard';
import { Status } from './components/status/status';
import { Review } from './components/review/review';
import { ActiveJobs } from './components/active-jobs/active-jobs';
import { CancelledJobs } from './components/cancelled-jobs/cancelled-jobs';
import { CompletedJobs } from './components/completed-jobs/completed-jobs';
import { Feedbacks } from './components/feedbacks/feedbacks';
import { ReportsComponent } from './components/reports/reports';
import { AdminLayout } from './components/admin-layout/admin-layout';
import { AdminProfile } from './components/admin-profile/admin-profile';
import { UserProfile } from './components/user-profile/user-profile';
import { CustomerSupport } from './components/customer-support/customer-support';
import { VerifyEmail } from './components/verify-email/verify-email';
import { NotFoundRedirect } from './components/not-found-redirect/not-found-redirect';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'signup',
    component: Signup,
  },
  {
    path: 'account-setup',
    component: AccountSetup,
  },
  {
    path: 'home',
    component: Homepage,
  },
  {
    path: 'book-job',
    component: BookJob,
  },
  {
    path: 'current-bookings',
    component: CurrentBookings,
  },
  {
    path: 'status',
    component: Status,
  },
  {
    path: 'compliance-docs',
    component: ComplianceDocs,
  },
  // {
  //   path: 'admin-dashboard',
  //   component: AdminDashboard,
  // },
  {
    path: 'verify-email',
    loadComponent: () =>
      import('./components/verify-email/verify-email').then((m) => m.VerifyEmail),
  },
  {
    path: 'review',
    component: Review,
  },
  {
    path: 'active-jobs',
    component: ActiveJobs,
  },
  {
    path: 'cancelled-jobs',
    component: CancelledJobs,
  },
  {
    path: 'completed-jobs',
    component: CompletedJobs,
  },
  {
    path: 'feedbacks',
    component: Feedbacks,
  },
  {
    path: 'reports',
    component: ReportsComponent,
  },
  {
    path: 'admin-layout',
    component: AdminLayout,
    children: [
      {
        path: '',
        component: AdminDashboard,
      },
      {
        path: 'active-jobs',
        component: ActiveJobs,
      },
      {
        path: 'cancelled-jobs',
        component: CancelledJobs,
      },
      {
        path: 'completed-jobs',
        component: CompletedJobs,
      },
      {
        path: 'feedbacks',
        component: Feedbacks,
      },
      {
        path: 'admin-dashboard',
        component: AdminDashboard,
      },
      {
        path: 'admin-profile',
        component: AdminProfile,
      },
    ],
  },
  {
    path: 'user-profile',
    component: UserProfile,
  },
  {
    path: 'customer-support',
    component: CustomerSupport,
  },
  // wildcard - must be last
  {
    path: '**',
    component: NotFoundRedirect,
  },
];
