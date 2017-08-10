# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.conf.urls import url

from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework.authtoken.views import obtain_auth_token

from restapi import views

urlpatterns = [
    url(r'^api-token-auth/',
        obtain_auth_token),

    url(r'^users/$',
        views.UserList.as_view(),
        name='user-list'),
    url(r'^users/(?P<pk>[0-9]+)/$',
        views.UserDetail.as_view(),
        name='user-detail'),

    url(r'^travelplans/$',
        views.TravelPlanList.as_view(),
        name='travelplan-list'),
    url(r'^travelplans/(?P<pk>[0-9]+)/$',
        views.TravelPlanDetail.as_view(),
        name='travelplan-detail'),

    url(r'^mytravelplans/$',
        views.MyTravelPlanList.as_view(),
        name='travelplan-mylist'),
]

urlpatterns = format_suffix_patterns(urlpatterns)
