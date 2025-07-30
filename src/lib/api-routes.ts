export const LOGIN_ROUTE = () => '/api/auth/login';

export const REGISTER_ROUTE = () => '/api/auth/register';

export const GET_USERS_ROUTE = () => '/api/users';

export const BANNERS_ROUTE = () => '/api/banners';

export const GET_ONE_BANNER_ROUTE = (id: string) => `/api/banners/${id}`;

export const DASHBOARD_OVERVIEW_ROUTE = () => '/api/dashboard/overview';

export const DASHBOARD_RECENT_ACTIVITY_ROUTE = () => '/api/dashboard/recent-activity';

export const PAYMENTS_STATS_ROUTE = () => '/api/payments/stats';

export const PAYMENTS_LIST_ROUTE = () => '/api/payments/list';

export const PLANS_ROUTE = () => '/api/plans';

export const GET_ONE_PLAN_ROUTE = (id: string) => `/api/plans/${id}`;
