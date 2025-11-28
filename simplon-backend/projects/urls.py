# from django.urls import path
# from . import views

# urlpatterns = [
#     path('projects/', views.ProjectListCreate.as_view(), name='project-list'),
#     path('projects/<int:pk>/', views.ProjectDetail.as_view(), name='project-detail'),
#     path('projects/user/<int:user_id>/', views.UserProjects.as_view(), name='user-projects'),
# ]


# projects/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('projects/', views.ProjectListCreate.as_view(), name='project-list'),
    path('projects/<int:pk>/', views.ProjectDetail.as_view(), name='project-detail'),
    path('projects/my-projects/', views.UserProjects.as_view(), name='user-projects'),  # ⭐ CHANGE ICI
]