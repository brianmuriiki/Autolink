from django.urls import path

from api.v1.views.auth import LoginView, LogoutView, MeView, RegisterView
from api.v1.views.automation import (
    AutomationCreateView,
    AutomationDeleteView,
    AutomationListView,
    AutomationToggleView,
    AutomationUpdateView,
    TemplateListCreateView,
)
from api.v1.views.dashboard import AdminAutomationsView, AdminDashboardView, AdminReportsView, AdminUsersView
from api.v1.views.payments import PaymentListCreateView
from api.v1.views.platforms import PlatformConnectView, PlatformDisconnectView, PlatformListView
from api.v1.views.reports import ReportActivityView, ReportSummaryView
from api.v1.views.subscriptions import SubscriptionStatusView, SubscriptionUpgradeView
from api.v1.views.user import ProfileView, UserUpdateView

urlpatterns = [
    path("auth/register/", RegisterView.as_view(), name="auth-register"),
    path("auth/login/", LoginView.as_view(), name="auth-login"),
    path("auth/logout/", LogoutView.as_view(), name="auth-logout"),
    path("auth/me/", MeView.as_view(), name="auth-me"),
    path("user/profile/", ProfileView.as_view(), name="user-profile"),
    path("user/update/", UserUpdateView.as_view(), name="user-update"),
    path("platform/connect/", PlatformConnectView.as_view(), name="platform-connect"),
    path("platform/list/", PlatformListView.as_view(), name="platform-list"),
    path("platform/disconnect/<int:pk>/", PlatformDisconnectView.as_view(), name="platform-disconnect"),
    path("automation/create/", AutomationCreateView.as_view(), name="automation-create"),
    path("automation/list/", AutomationListView.as_view(), name="automation-list"),
    path("automation/update/<int:pk>/", AutomationUpdateView.as_view(), name="automation-update"),
    path("automation/delete/<int:pk>/", AutomationDeleteView.as_view(), name="automation-delete"),
    path("automation/toggle/<int:pk>/", AutomationToggleView.as_view(), name="automation-toggle"),
    path("automation/templates/", TemplateListCreateView.as_view(), name="automation-templates"),
    path("subscription/status/", SubscriptionStatusView.as_view(), name="subscription-status"),
    path("subscription/upgrade/", SubscriptionUpgradeView.as_view(), name="subscription-upgrade"),
    path("payments/", PaymentListCreateView.as_view(), name="payments"),
    path("reports/summary/", ReportSummaryView.as_view(), name="reports-summary"),
    path("reports/activity/", ReportActivityView.as_view(), name="reports-activity"),
    path("admin/dashboard/", AdminDashboardView.as_view(), name="admin-dashboard"),
    path("admin/users/", AdminUsersView.as_view(), name="admin-users"),
    path("admin/users/suspend/", AdminUsersView.as_view(), name="admin-users-suspend"),
    path("admin/automations/", AdminAutomationsView.as_view(), name="admin-automations"),
    path("admin/reports/", AdminReportsView.as_view(), name="admin-reports"),
]
