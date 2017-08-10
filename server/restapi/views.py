# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import datetime

from django.contrib.auth.models import User
from django.utils import timezone

from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view

from rest_framework.exceptions import ValidationError
from restapi.helper import get_next_month
from restapi.models import TravelPlan
from restapi.permissions import UserListViewPermission, \
                                UserDetailViewPermission, \
                                TravelPlanListViewPermission, \
                                TravelPlanDetailViewPermission, \
                                is_plan_manager, \
                                is_admin
from restapi.serializers import UserSerializer, \
                                UserUpdateSerializer, \
                                TravelPlanSerializer


DATE_FORMAT = '%Y-%m-%d'


class UserList(generics.ListCreateAPIView):
    permission_classes = (UserListViewPermission, )
    queryset = User.objects.all()
    ordering = ('id', )
    serializer_class = UserSerializer
    search_fields = ('username', 'email')

    def get_queryset(self):
        username = self.request.query_params.get('username', None)
        email = self.request.query_params.get('email', None)

        q = User.objects.all()

        if username:
            q = q.filter(username__icontains=username)

        if email:
            q = q.filter(email__icontains=email)

        return q


class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (permissions.IsAuthenticated,
                          UserDetailViewPermission, )
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_serializer_class(self):
        if self.request.method == 'PUT':
            return UserUpdateSerializer

        return self.serializer_class


class TravelPlanList(generics.ListCreateAPIView):
    permission_classes = (permissions.IsAuthenticated,
                          TravelPlanListViewPermission, )
    serializer_class = TravelPlanSerializer
    ordering = ('id', )

    def get_queryset(self):
        q = self.request.user.travelplan_set.all()

        if is_admin(self.request.user) or \
           is_plan_manager(self.request.user):
            q = TravelPlan.objects.all()

        user = self.request.query_params.get('user', None)
        destination = self.request.query_params.get('destination', None)
        comment = self.request.query_params.get('comment', None)
        start_date_min = self.request.query_params.get('start_date_min', None)
        start_date_max = self.request.query_params.get('start_date_max', None)
        end_date_min = self.request.query_params.get('end_date_min', None)
        end_date_max = self.request.query_params.get('end_date_max', None)

        if user:
            q = q.filter(user__username__icontains=user)

        if comment:
            q = q.filter(comment__icontains=comment)

        if destination:
            q = q.filter(destination__icontains=destination)

        if start_date_min:
            try:
                start_date_min = datetime.datetime.strptime(start_date_min, DATE_FORMAT)
                start_date_max = datetime.datetime.strptime(start_date_max, DATE_FORMAT)
            except ValueError:
                raise ValidationError('Invalid start_date')
            else:
                q = q.filter(start_date__gte=start_date_min, start_date__lte=start_date_max)

        if end_date_min:
            try:
                end_date_min = datetime.datetime.strptime(end_date_min, DATE_FORMAT)
                end_date_max = datetime.datetime.strptime(end_date_max, DATE_FORMAT)
            except ValueError:
                raise ValidationError('Invalid start_date')
            else:
                q = q.filter(end_date__gte=end_date_min, end_date__lte=end_date_max)

        return q


class TravelPlanDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (permissions.IsAuthenticated,
                          TravelPlanDetailViewPermission, )
    queryset = TravelPlan.objects.all()
    serializer_class = TravelPlanSerializer


class MyTravelPlanList(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated, )
    serializer_class = TravelPlanSerializer
    ordering = ('id', )

    def get_queryset(self):
        next_month= get_next_month(timezone.now())
        nnext_month = get_next_month(next_month)

        return self.request.user.travelplan_set.filter(
            start_date__gte=next_month,
            start_date__lt=nnext_month).all()
