export const DASHBOARD_OVERVIEW_ROUTE = () => '/api/dashboard/overview';

export const DASHBOARD_RECENT_ACTIVITY_ROUTE = () => '/api/dashboard/recent-activity';

export const DASHBOARD_SUBSCRIPTIONS_ROUTE = () => '/api/dashboard/subscriptions';

export const DASHBOARD_SCHEDULING_ROUTE = () => '/api/dashboard/scheduling';

export const DASHBOARD_SERVICES_ROUTE = () => '/api/dashboard/services';

export const DASHBOARD_GROWTH_ROUTE = () => '/api/dashboard/growth';

export const PAYMENTS_STATS_ROUTE = () => '/api/payments/stats';

export const PAYMENTS_LIST_ROUTE = () => '/api/payments/list';

export const REPORTS_ROUTE = () => '/api/reports';

export const REPORTS_STATISTICS_ROUTE = () => '/api/reports/statistics';

export const REPORTS_MY_ROUTE = () => '/api/reports/my-reports';

export const LOGIN_ROUTE = () => '/api/auth/login';
export const REFRESH_TOKEN_ROUTE = () => '/api/auth/refresh';

export const REGISTER_ROUTE = () => '/api/auth/register';

export const VERIFY_EMAIL_CODE_ROUTE = () => '/api/auth/verify-email-code';

export const RESEND_VERIFICATION_ROUTE = () => '/api/auth/resend-verification';

export const GET_USERS_ROUTE = () => '/api/users';

export const BANNERS_ROUTE = () => '/api/banners';

export const CASHBACK_STATISTICS_ROUTE = () => '/api/cashback/admin/statistics';

export const CASHBACK_TRANSACTIONS_ROUTE = () => '/api/cashback/admin/transactions';

export const CASHBACK_APPROVE_TRANSACTION_ROUTE = (id: string) => `/api/cashback/admin/transactions/${id}/approve`;

export const CASHBACK_DECLINE_TRANSACTION_ROUTE = (id: string) => `/api/cashback/admin/transactions/${id}/decline`;

export const GET_ONE_BANNER_ROUTE = (id: string) => `/api/banners/${id}`;

export const PLANS_ROUTE = () => '/api/plans';

export const ONE_PLAN_ROUTE = (id: string) => `/api/plans/${id}`;

export const PETS_ROUTE = () => '/api/pet';

export const GET_ONE_PET_ROUTE = (id: string) => `/api/pet/${id}`;

export const DELETE_MICROCHIPPED_PET_ROUTE = (id: string) => `/api/pet/${id}/microchip`;

export const MICROCHIPPED_PETS_ROUTE = () => '/api/pet/getAllMicrochipedPets';

export const MICROCHIP_STATS_ROUTE = () => '/api/pet/microchip/stats';

export const SERVICES_ROUTE = () => '/api/services';

export const ONE_SERVICE_ROUTE = (id: string) => `/api/services/${id}`;

export const SERVICES_USAGE_RECORD_ROUTE = () => '/api/services-usage/record';

export const GET_SCHEDULE_SERVICE_ROUTE = () => '/api/scheduling/without-token';

export const RESCHEDULE_SERVICE_ROUTE = (id: string) => `/api/scheduling/${id}/reagendamento-admin`;

export const DELETE_SCHEDULE_SERVICE_ROUTE = (id: string) => `/api/scheduling/${id}/cancelamento-admin`;