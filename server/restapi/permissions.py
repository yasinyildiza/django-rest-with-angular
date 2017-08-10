# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib.auth.models import User, Group, Permission

from rest_framework import permissions

# Group name for Travel Plan manager
PLAN_MANAGER = 'plan_manager'

# Group name for User manager
USER_MANAGER = 'user_manager'


def is_manager(user, name):
    return user.groups.filter(name=name).count() > 0
    

def is_plan_manager(user):
    return is_manager(user, PLAN_MANAGER)


def is_user_manager(user):
    return is_manager(user, USER_MANAGER)


def is_admin(user):
    return user.is_superuser


class UserListViewPermission(permissions.BasePermission):
    """Custom permission for User list view"""

    def has_permission(self, request, view):
        if request.method == 'POST':
            return True

        return is_user_manager(request.user) or \
               is_admin(request.user)


class UserDetailViewPermission(permissions.BasePermission):
    """Custom permission for User detail view"""

    def has_object_permission(self, request, view, obj):
        return obj == request.user or \
               is_user_manager(request.user) or \
               is_admin(request.user)


class TravelPlanListViewPermission(permissions.BasePermission):
    """Custom permission for Travel Plan view"""

    def has_permission(self, request, view):
        return True


class TravelPlanDetailViewPermission(permissions.BasePermission):
    """Custom permission for Travel Plan view"""

    def has_object_permission(self, request, view, obj):
        return obj.user == request.user or \
               is_plan_manager(request.user) or \
               is_admin(request.user)
