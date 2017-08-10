# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import json

from datetime import date, timedelta
from django.test import TestCase
from django.test.client import Client
from django.contrib.auth.models import User, Group
from django.utils import timezone

from restapi.helper import get_next_month
from restapi.permissions import PLAN_MANAGER, USER_MANAGER
from restapi.models import TravelPlan

LOGIN_URL = '/api-auth/login/'
LOGOUT_URL = '/api-auth/logout/'

USER_LIST_URL = '/v1/users.json'
USER_DETAILS_URL = lambda id: '/v1/users/{}.json'.format(id)

TRAVELPLAN_LIST_URL = '/v1/travelplans.json'
TRAVELPLAN_DETAILS_URL = lambda id: '/v1/travelplans/{}.json'.format(id)
MY_TRAVELPLAN_LIST_URL = '/v1/mytravelplans.json'

USERNAME = 'testuser'
PASSWORD = 'password'

DATE_FORMAT = '%Y-%m-%d'


def create_user(username=None, group_name=None, is_superuser=False, email=''):
    user = User.objects.create(
        username=username or USERNAME,
        is_superuser=is_superuser,
        email=email)
    user.set_password(PASSWORD)
    user.save()

    if group_name:
        group = Group.objects.get(name=group_name)
        user.groups.add(group)

    return user


def create_plan_manager(username=None):
    return create_user(username=username, group_name=PLAN_MANAGER)


def create_user_manager(username=None):
    return create_user(username=username, group_name=USER_MANAGER)


def create_admin(username=None):
    return create_user(username=username, is_superuser=True)


def create_travel_plan(user, destination='destination', comment='comment'):
    return TravelPlan.objects.create(
        user=user,
        destination=destination,
        comment=comment,
        start_date=timezone.now(),
        end_date=timezone.now())


def login(client, user, password=None):
    params = {
        'username': user.username,
        'password': password or PASSWORD,
    }
    return client.post(LOGIN_URL, params)


def logout(client):
    return client.get(LOGOUT_URL)


class TestUserListView(TestCase):
    def setUp(self):
        self.client = Client()

    def tearDown(self):
        pass

    def test_anonymous_user_get(self):
        url = USER_LIST_URL
        rv = self.client.get(url)
        self.assertEqual(rv.status_code, 401)

    def test_anonymous_user_post(self):
        username = 'testuser2'
        params = {
            'username': username,
            'password': PASSWORD,
            'confirm_password': PASSWORD,
        }
        rv = self.client.post(USER_LIST_URL, params)
        self.assertEqual(rv.status_code, 201)

        users = User.objects.filter(username=username)
        self.assertEqual(users.count(), 1)

    def test_regular_user_get(self):
        user = create_user()
        login(self.client, user)
        url = USER_LIST_URL
        rv = self.client.get(url)
        self.assertEqual(rv.status_code, 403)

    def test_regular_user_post(self):
        user = create_user()
        login(self.client, user)
        username = 'testuser2'
        params = {
            'username': username,
            'password': PASSWORD,
            'confirm_password': PASSWORD,
        }
        rv = self.client.post(USER_LIST_URL, params)
        self.assertEqual(rv.status_code, 201)

        users = User.objects.filter(username=username)
        self.assertEqual(users.count(), 1)

    def test_user_manager_get(self):
        admin = create_admin('admin')
        regular = create_user('regular')
        user = create_user_manager()
        login(self.client, user)
        url = USER_LIST_URL
        rv = self.client.get(url)
        self.assertEqual(rv.status_code, 200)
        self.assertEqual(len(rv.data['results']), 3)

    def test_user_manager_post(self):
        user = create_user_manager()
        login(self.client, user)
        username = 'testuser2'
        params = {
            'username': username,
            'password': PASSWORD,
            'confirm_password': PASSWORD,
        }
        rv = self.client.post(USER_LIST_URL, params)
        self.assertEqual(rv.status_code, 201)

        users = User.objects.filter(username=username)
        self.assertEqual(users.count(), 1)

    def test_register_password_mismatch(self):
        username = 'testuser2'
        params = {
            'username': username,
            'password': PASSWORD,
            'confirm_password': PASSWORD*2,
        }
        rv = self.client.post(USER_LIST_URL, params)
        self.assertEqual(rv.status_code, 400)

        users = User.objects.filter(username=username)
        self.assertEqual(users.count(), 0)


class TestUserListSearchView(TestCase):
    def setUp(self):
        self.client = Client()

    def tearDown(self):
        pass

    def test_search_username(self):
        user = create_admin('admin')
        login(self.client, user)

        keyword = 'Abc'
        match1 = create_user('XYZ' + keyword + 'XYZ')
        match2 = create_user(keyword + 'XYZ')
        match3 = create_user('XYZ' + keyword)
        match4 = create_user('XYZ' + keyword.lower() + 'XYZ')
        match5 = create_user(keyword.lower() + 'XYZ')
        match6 = create_user('XYZ' + keyword.lower())
        match7 = create_user('XYZ' + keyword.upper() + 'XYZ')
        match8 = create_user(keyword.upper() + 'XYZ')
        match9 = create_user('XYZ' + keyword.upper())

        count = 5
        for i in range(count):
            username = 'user' + str(i)
            create_user(username)
            
        url = USER_LIST_URL
        params = {
            'username': keyword
        }
        rv = self.client.get(url, params)
        self.assertEqual(rv.status_code, 200)
        self.assertEqual(rv.data['count'], 9)
        for user in rv.data['results']:
            self.assertIn(keyword.upper(), user['username'].upper())

    def test_search_email(self):
        user = create_admin('admin')
        login(self.client, user)

        keyword = 'Abc'
        match1 = create_user('user1', email='XYZ' + keyword + 'XYZ@mail.com')
        match2 = create_user('user2', email=keyword + 'XYZ@mail.com')
        match3 = create_user('user3', email='XYZ' + keyword + '@mail.com')
        match4 = create_user('user4', email='XYZ' + keyword.lower() + 'XYZ@mail.com')
        match5 = create_user('user5', email=keyword.lower() + 'XYZ@mail.com')
        match6 = create_user('user6', email='XYZ' + keyword.lower() + '@mail.com')
        match7 = create_user('user7', email='XYZ' + keyword.upper() + 'XYZ@mail.com')
        match8 = create_user('user8', email=keyword.upper() + 'XYZ@mail.com')
        match9 = create_user('user9', email='XYZ' + keyword.upper() + '@mail.com')

        count = 5
        for i in range(count):
            username = 'user' + str(i+10)
            email = username + '@mail.com'
            create_user(username, email=email)
            
        url = USER_LIST_URL
        params = {
            'email': keyword
        }
        rv = self.client.get(url, params)
        self.assertEqual(rv.status_code, 200)
        self.assertEqual(rv.data['count'], 9)
        for user in rv.data['results']:
            self.assertIn(keyword.upper(), user['email'].upper())


class TestUserDetailView(TestCase):
    def setUp(self):
        self.client = Client()
        self.username = 'testuser2'
        self.user = create_user(username=self.username)

    def tearDown(self):
        pass

    def test_anonymous_user_get(self):
        url = USER_DETAILS_URL(self.user.id)
        rv = self.client.get(url)
        self.assertEqual(rv.status_code, 401)

    def test_anonymous_user_put(self):
        url = USER_DETAILS_URL(self.user.id)
        rv = self.client.put(url)
        self.assertEqual(rv.status_code, 401)

    def test_anonymous_user_delete(self):
        url = USER_DETAILS_URL(self.user.id)
        rv = self.client.delete(url)
        self.assertEqual(rv.status_code, 401)

    def test_regular_user_get(self):
        user = create_user()
        login(self.client, user)
        url = USER_DETAILS_URL(self.user.id)
        rv = self.client.get(url)
        self.assertEqual(rv.status_code, 403)

    def test_regular_user_self_get(self):
        user = create_user()
        login(self.client, user)
        url = USER_DETAILS_URL(user.id)
        rv = self.client.get(url)
        self.assertEqual(rv.status_code, 200)

    def test_regular_user_put(self):
        user = create_user()
        login(self.client, user)
        url = USER_DETAILS_URL(self.user.id)
        rv = self.client.put(url)
        self.assertEqual(rv.status_code, 403)

    def test_regular_user_self_put(self):
        user = create_user()
        login(self.client, user)
        url = USER_DETAILS_URL(user.id)
        username = 'testuser5'
        email = 'abc@def.com'
        params = {
            'username': username,
            'email': email,
        }
        rv = self.client.put(url, json.dumps(params), content_type='application/json')
        self.assertEqual(rv.status_code, 200)

        users = User.objects.filter(username=USERNAME)
        self.assertEqual(users.count(), 0)

        users = User.objects.filter(username=username)
        self.assertEqual(users.count(), 1)

        ruser = users.first()
        self.assertEqual(ruser.email, email)

    def test_regular_user_password_update(self):
        user = create_user()
        login(self.client, user)
        url = USER_DETAILS_URL(user.id)
        password = 'password2'
        params = {
            'username': USERNAME,
            'password': password,
            'confirm_password': password,
        }
        rv = self.client.put(url, json.dumps(params), content_type='application/json')
        self.assertEqual(rv.status_code, 200)

        rv = logout(self.client)
        self.assertEqual(rv.status_code, 200)
        rv = login(self.client, user, password)
        self.assertEqual(rv.status_code, 302)

    def test_regular_user_password_update_mismatch(self):
        user = create_user()
        login(self.client, user)
        url = USER_DETAILS_URL(user.id)
        password = 'password2'
        params = {
            'username': USERNAME,
            'password': password,
            'confirm_password': password*2,
        }
        rv = self.client.put(url, json.dumps(params), content_type='application/json')
        self.assertEqual(rv.status_code, 400)

        rv = logout(self.client)
        self.assertEqual(rv.status_code, 200)
        rv = login(self.client, user, PASSWORD)
        self.assertEqual(rv.status_code, 302)

    def test_regular_user_delete(self):
        user = create_user()
        login(self.client, user)
        url = USER_DETAILS_URL(self.user.id)
        rv = self.client.delete(url)
        self.assertEqual(rv.status_code, 403)

    def test_regular_user_self_delete(self):
        user = create_user()
        login(self.client, user)
        url = USER_DETAILS_URL(user.id)
        rv = self.client.delete(url)
        self.assertEqual(rv.status_code, 204)

    def test_user_manager_get(self):
        user = create_user_manager()
        login(self.client, user)
        url = USER_DETAILS_URL(self.user.id)
        rv = self.client.get(url)
        self.assertEqual(rv.status_code, 200)

    def test_user_manager_put(self):
        user = create_user_manager()
        login(self.client, user)
        url = USER_DETAILS_URL(self.user.id)
        username = 'testuser5'
        params = {
            'username': username,
        }
        rv = self.client.put(url, json.dumps(params), content_type='application/json')
        self.assertEqual(rv.status_code, 200)

        users = User.objects.filter(username=self.username)
        self.assertEqual(users.count(), 0)

        users = User.objects.filter(username=username)
        self.assertEqual(users.count(), 1)

    def test_user_manager_delete(self):
        user = create_user_manager()
        login(self.client, user)
        url = USER_DETAILS_URL(self.user.id)
        rv = self.client.delete(url)
        self.assertEqual(rv.status_code, 204)

class TestTravelPlanListView(TestCase):
    def setUp(self):
        self.client = Client()

    def tearDown(self):
        pass

    def test_anonymous_user_get(self):
        url = TRAVELPLAN_LIST_URL
        rv = self.client.get(url)
        self.assertEqual(rv.status_code, 401)

    def test_anonymous_user_post(self):
        url = TRAVELPLAN_LIST_URL
        rv = self.client.post(url)
        self.assertEqual(rv.status_code, 401)

    def test_regular_user_get(self):
        user = create_user()

        other_count = 3
        for i in range(other_count):
            tuser = create_user('traveluser'+str(i))
            create_travel_plan(tuser)

        user_count = 4
        for i in range(user_count):
            create_travel_plan(user)

        login(self.client, user)
        url = TRAVELPLAN_LIST_URL
        rv = self.client.get(url)
        self.assertEqual(rv.status_code, 200)
        self.assertEqual(len(rv.data['results']), user_count)

    def test_regular_user_post(self):
        user = create_user()
        login(self.client, user)
        url = TRAVELPLAN_LIST_URL
        params = {
            'destination': 'Havana',
            'comment': 'Say hello to Kuba',
            'start_date': '2017-09-13',
            'end_date': '2017-09-21',
        }
        rv = self.client.post(url, params)
        self.assertEqual(rv.status_code, 201)

        plans = TravelPlan.objects.filter(user=user)
        self.assertEqual(plans.count(), 1)

    def test_plan_manager_get(self):
        user = create_plan_manager()

        count = 3
        for i in range(count):
            tuser = create_user('traveluser'+str(i))
            create_travel_plan(tuser)

        login(self.client, user)
        url = TRAVELPLAN_LIST_URL
        rv = self.client.get(url)
        self.assertEqual(rv.status_code, 200)
        self.assertEqual(len(rv.data['results']), count)

    def test_plan_manager_post(self):
        user = create_plan_manager()
        login(self.client, user)
        url = TRAVELPLAN_LIST_URL
        params = {
            'destination': 'Havana',
            'comment': 'Say hello to Kuba',
            'start_date': '2017-09-13',
            'end_date': '2017-09-21',
        }
        rv = self.client.post(url, params)
        self.assertEqual(rv.status_code, 201)

        plans = TravelPlan.objects.filter(user=user)
        self.assertEqual(plans.count(), 1)


class TestTravelPlanListSearchView(TestCase):
    def setUp(self):
        self.client = Client()

    def tearDown(self):
        pass

    def test_search_user(self):
        user = create_admin('admin')
        login(self.client, user)

        keyword = 'Abc'
        create_travel_plan(create_user('XYZ' + keyword + 'XYZ'))
        create_travel_plan(create_user(keyword + 'XYZ'))
        create_travel_plan(create_user('XYZ' + keyword))
        create_travel_plan(create_user('XYZ' + keyword.lower() + 'XYZ'))
        create_travel_plan(create_user(keyword.lower() + 'XYZ'))
        create_travel_plan(create_user('XYZ' + keyword.lower()))
        create_travel_plan(create_user('XYZ' + keyword.upper() + 'XYZ'))
        create_travel_plan(create_user(keyword.upper() + 'XYZ'))
        create_travel_plan(create_user('XYZ' + keyword.upper()))

        count = 5
        for i in range(count):
            username = 'user' + str(i)
            create_travel_plan(create_user(username))
            
        url = TRAVELPLAN_LIST_URL
        params = {
            'user': keyword
        }
        rv = self.client.get(url, params)
        self.assertEqual(rv.status_code, 200)
        self.assertEqual(rv.data['count'], 9)
        for plan in rv.data['results']:
            self.assertIn(keyword.upper(), plan['user'].upper())

    def test_search_destination(self):
        user = create_admin('admin')
        login(self.client, user)

        keyword = 'Abc'
        create_travel_plan(create_user('user1'), destination='XYZ' + keyword + 'XYZ')
        create_travel_plan(create_user('user2'), destination=keyword + 'XYZ')
        create_travel_plan(create_user('user3'), destination='XYZ' + keyword)
        create_travel_plan(create_user('user4'), destination='XYZ' + keyword.lower() + 'XYZ')
        create_travel_plan(create_user('user5'), destination=keyword.lower() + 'XYZ')
        create_travel_plan(create_user('user6'), destination='XYZ' + keyword.lower())
        create_travel_plan(create_user('user7'), destination='XYZ' + keyword.upper() + 'XYZ')
        create_travel_plan(create_user('user8'), destination=keyword.upper() + 'XYZ')
        create_travel_plan(create_user('user9'), destination='XYZ' + keyword.upper())

        count = 5
        for i in range(count):
            username = 'user' + str(i+10)
            create_travel_plan(create_user(username))
            
        url = TRAVELPLAN_LIST_URL
        params = {
            'destination': keyword
        }
        rv = self.client.get(url, params)
        self.assertEqual(rv.status_code, 200)
        self.assertEqual(rv.data['count'], 9)
        for plan in rv.data['results']:
            self.assertIn(keyword.upper(), plan['destination'].upper())

    def test_search_comment(self):
        user = create_admin('admin')
        login(self.client, user)

        keyword = 'Abc'
        create_travel_plan(create_user('user1'), comment='XYZ' + keyword + 'XYZ')
        create_travel_plan(create_user('user2'), comment=keyword + 'XYZ')
        create_travel_plan(create_user('user3'), comment='XYZ' + keyword)
        create_travel_plan(create_user('user4'), comment='XYZ' + keyword.lower() + 'XYZ')
        create_travel_plan(create_user('user5'), comment=keyword.lower() + 'XYZ')
        create_travel_plan(create_user('user6'), comment='XYZ' + keyword.lower())
        create_travel_plan(create_user('user7'), comment='XYZ' + keyword.upper() + 'XYZ')
        create_travel_plan(create_user('user8'), comment=keyword.upper() + 'XYZ')
        create_travel_plan(create_user('user9'), comment='XYZ' + keyword.upper())

        count = 5
        for i in range(count):
            username = 'user' + str(i+10)
            create_travel_plan(create_user(username))
            
        url = TRAVELPLAN_LIST_URL
        params = {
            'comment': keyword
        }
        rv = self.client.get(url, params)
        self.assertEqual(rv.status_code, 200)
        self.assertEqual(rv.data['count'], 9)
        for plan in rv.data['results']:
            self.assertIn(keyword.upper(), plan['comment'].upper())

    def test_search_start_date(self):
        user = create_admin('admin')
        login(self.client, user)

        min_date = date(2017, 10, 14)
        max_date = min_date + timedelta(days=10)

        plan_before = create_travel_plan(user)
        plan_before.start_date = min_date - timedelta(days=5)
        plan_before.save()

        plan_at_min_date = create_travel_plan(user)
        plan_at_min_date.start_date = min_date
        plan_at_min_date.save()

        plan_in_between = create_travel_plan(user)
        plan_in_between.start_date = min_date + timedelta(days=5)
        plan_in_between.save()

        plan_at_max_date = create_travel_plan(user)
        plan_at_max_date.start_date = max_date
        plan_at_max_date.save()

        plan_later = create_travel_plan(user)
        plan_later.start_date = max_date + timedelta(days=5)
        plan_later.save()

        url = TRAVELPLAN_LIST_URL
        params = {
            'start_date_min': min_date.strftime('%Y-%m-%d'),
            'start_date_max': max_date.strftime('%Y-%m-%d'),
        }
        rv = self.client.get(url, params)
        self.assertEqual(rv.status_code, 200)
        self.assertEqual(rv.data['count'], 3)
        ids = map(lambda plan: plan['id'], rv.data['results'])
        self.assertIn(plan_at_min_date.id, ids)
        self.assertIn(plan_in_between.id, ids)
        self.assertIn(plan_at_max_date.id, ids)

    def test_search_start_date_invalid(self):
        user = create_admin('admin')
        login(self.client, user)

        url = TRAVELPLAN_LIST_URL
        params = {
            'start_date_min': 'this is not a valid date',
            'start_date_max': 'this is not valid either',
        }
        rv = self.client.get(url, params)
        self.assertEqual(rv.status_code, 400)

    def test_search_end_date(self):
        user = create_admin('admin')
        login(self.client, user)

        min_date = date(2017, 10, 14)
        max_date = min_date + timedelta(days=10)

        plan_before = create_travel_plan(user)
        plan_before.end_date = min_date - timedelta(days=5)
        plan_before.save()

        plan_at_min_date = create_travel_plan(user)
        plan_at_min_date.end_date = min_date
        plan_at_min_date.save()

        plan_in_between = create_travel_plan(user)
        plan_in_between.end_date = min_date + timedelta(days=5)
        plan_in_between.save()

        plan_at_max_date = create_travel_plan(user)
        plan_at_max_date.end_date = max_date
        plan_at_max_date.save()

        plan_later = create_travel_plan(user)
        plan_later.end_date = max_date + timedelta(days=5)
        plan_later.save()

        url = TRAVELPLAN_LIST_URL
        params = {
            'end_date_min': min_date.strftime('%Y-%m-%d'),
            'end_date_max': max_date.strftime('%Y-%m-%d'),
        }
        rv = self.client.get(url, params)
        self.assertEqual(rv.status_code, 200)
        self.assertEqual(rv.data['count'], 3)
        ids = map(lambda plan: plan['id'], rv.data['results'])
        self.assertIn(plan_at_min_date.id, ids)
        self.assertIn(plan_in_between.id, ids)
        self.assertIn(plan_at_max_date.id, ids)

    def test_search_end_date_invalid(self):
        user = create_admin('admin')
        login(self.client, user)

        url = TRAVELPLAN_LIST_URL
        params = {
            'end_date_min': 'this is not a valid date',
            'end_date_max': 'this is not valid either',
        }
        rv = self.client.get(url, params)
        self.assertEqual(rv.status_code, 400)


class TestTravelPlanDetailView(TestCase):
    def setUp(self):
        self.client = Client()
        self.username = 'testuser2'
        self.user = create_user(username=self.username)
        self.travel_plan = create_travel_plan(self.user)

    def tearDown(self):
        pass

    def test_anonymous_user_get(self):
        url = TRAVELPLAN_DETAILS_URL(self.travel_plan.id)
        rv = self.client.get(url)
        self.assertEqual(rv.status_code, 401)

    def test_anonymous_user_put(self):
        url = TRAVELPLAN_DETAILS_URL(self.travel_plan.id)
        rv = self.client.put(url)
        self.assertEqual(rv.status_code, 401)

    def test_anonymous_user_delete(self):
        url = TRAVELPLAN_DETAILS_URL(self.travel_plan.id)
        rv = self.client.delete(url)
        self.assertEqual(rv.status_code, 401)

    def test_regular_user_get(self):
        user = create_user()
        login(self.client, user)
        url = TRAVELPLAN_DETAILS_URL(self.travel_plan.id)
        rv = self.client.get(url)
        self.assertEqual(rv.status_code, 403)

    def test_regular_user_self_get(self):
        user = create_user()
        travel_plan = create_travel_plan(user)
        login(self.client, user)
        url = TRAVELPLAN_DETAILS_URL(travel_plan.id)
        rv = self.client.get(url)
        self.assertEqual(rv.status_code, 200)

    def test_regular_user_put(self):
        user = create_user()
        login(self.client, user)
        url = TRAVELPLAN_DETAILS_URL(self.travel_plan.id)
        rv = self.client.put(url)
        self.assertEqual(rv.status_code, 403)

    def test_regular_user_self_put(self):
        user = create_user()
        travel_plan = create_travel_plan(user)
        login(self.client, user)
        url = TRAVELPLAN_DETAILS_URL(travel_plan.id)
        destination = 'destination2'
        comment = 'commnet2'
        start_date = '2016-07-14'
        end_date = '2016-07-15'
        params = {
            'destination': destination,
            'comment': comment,
            'start_date': start_date,
            'end_date': end_date,
        }
        rv = self.client.put(url, json.dumps(params), content_type='application/json')
        self.assertEqual(rv.status_code, 200)

        plan = TravelPlan.objects.get(id=travel_plan.id)
        self.assertEqual(plan.destination, destination)
        self.assertEqual(plan.comment, comment)
        self.assertEqual(plan.start_date.strftime(DATE_FORMAT), start_date)
        self.assertEqual(plan.end_date.strftime(DATE_FORMAT), end_date)

    def test_regular_user_delete(self):
        user = create_user()
        login(self.client, user)
        url = TRAVELPLAN_DETAILS_URL(self.travel_plan.id)
        rv = self.client.delete(url)
        self.assertEqual(rv.status_code, 403)

    def test_regular_user_self_delete(self):
        user = create_user()
        travel_plan = create_travel_plan(user)
        login(self.client, user)
        url = TRAVELPLAN_DETAILS_URL(travel_plan.id)
        rv = self.client.delete(url)
        self.assertEqual(rv.status_code, 204)

    def test_plan_manager_get(self):
        user = create_plan_manager()
        login(self.client, user)
        url = TRAVELPLAN_DETAILS_URL(self.travel_plan.id)
        rv = self.client.get(url)
        self.assertEqual(rv.status_code, 200)

    def test_plan_manager_put(self):
        user = create_plan_manager()
        login(self.client, user)
        url = TRAVELPLAN_DETAILS_URL(self.travel_plan.id)
        destination = 'destination2'
        comment = 'commnet2'
        start_date = '2016-07-14'
        end_date = '2016-07-15'
        params = {
            'destination': destination,
            'comment': comment,
            'start_date': start_date,
            'end_date': end_date,
        }
        rv = self.client.put(url, json.dumps(params), content_type='application/json')
        self.assertEqual(rv.status_code, 200)

        plan = TravelPlan.objects.get(id=self.travel_plan.id)
        self.assertEqual(plan.destination, destination)
        self.assertEqual(plan.comment, comment)
        self.assertEqual(plan.start_date.strftime(DATE_FORMAT), start_date)
        self.assertEqual(plan.end_date.strftime(DATE_FORMAT), end_date)

    def test_plan_manager_delete(self):
        user = create_plan_manager()
        login(self.client, user)
        url = TRAVELPLAN_DETAILS_URL(self.travel_plan.id)
        rv = self.client.delete(url)
        self.assertEqual(rv.status_code, 204)


class TestMyTravelPlanList(TestCase):
    def setUp(self):
        self.client = Client()

    def tearDown(self):
        pass

    def test_anonymous_user_get(self):
        url = MY_TRAVELPLAN_LIST_URL
        rv = self.client.get(url)
        self.assertEqual(rv.status_code, 401)

    def test_mixed(self):
        now = timezone.now()
        next_month= get_next_month(now)
        nnext_month = get_next_month(next_month)

        user1 = create_user(username='user1')

        # Travel Plan in this month
        plan_before = create_travel_plan(user1)
        plan_before.start_date = now
        plan_before.save()

        # Travel plan in the next month
        plan_next = create_travel_plan(user1)
        plan_next.start_date = date(next_month.year, next_month.month, 10)
        plan_next.save()

        # Travel plan two months later
        plan_nnext = create_travel_plan(user1)
        plan_nnext.start_date = date(nnext_month.year, nnext_month.month, 20)
        plan_nnext.save()

        user2 = create_user(username='user2')

        # Travel plan in the next month
        # but belonging to another user
        other_plan_next = create_travel_plan(user2)
        other_plan_next.start_date = date(next_month.year, next_month.month, 10)
        other_plan_next.save()

        login(self.client, user1)
        url = MY_TRAVELPLAN_LIST_URL
        rv = self.client.get(url)
        self.assertEqual(rv.status_code, 200)

        self.assertEqual(len(rv.data['results']), 1)
        self.assertEqual(rv.data['results'][0]['id'], plan_next.id)


class TestHelper(TestCase):
    def setUp(self):
        pass

    def tearDown(self):
        pass

    def test_middle(self):
        d = date(2015, 5, 3)
        next_month = get_next_month(d)
        self.assertEqual(next_month.year, 2015)
        self.assertEqual(next_month.month, 6)
        self.assertEqual(next_month.day, 1)

    def test_end(self):
        d = date(2015, 12, 17)
        next_month = get_next_month(d)
        self.assertEqual(next_month.year, 2016)
        self.assertEqual(next_month.month, 1)
        self.assertEqual(next_month.day, 1)


class TestTravelPlanModel(TestCase):
    def setUp(self):
        pass

    def tearDown(self):
        pass

    def test_day_count_passed(self):
        now = timezone.now()
        past = now - timedelta(days=10)
        user = create_user()
        plan = create_travel_plan(user)
        plan.start_date = past
        plan.save()

        plan = TravelPlan.objects.get(id=plan.id)
        self.assertEqual(plan.day_count, 'passed')

    def test_day_count_today(self):
        now = timezone.now()
        user = create_user()
        plan = create_travel_plan(user)
        plan.start_date = now
        plan.save()

        plan = TravelPlan.objects.get(id=plan.id)
        self.assertEqual(plan.day_count, 'today')

    def test_day_count_tomorrow(self):
        now = timezone.now()
        tomorrow = now + timedelta(days=1)
        user = create_user()
        plan = create_travel_plan(user)
        plan.start_date = tomorrow
        plan.save()

        plan = TravelPlan.objects.get(id=plan.id)
        self.assertEqual(plan.day_count, 'tomorrow')

    def test_day_count_future(self):
        day_count = 10
        now = timezone.now()
        future = now + timedelta(days=day_count)
        user = create_user()
        plan = create_travel_plan(user)
        plan.start_date = future
        plan.save()

        plan = TravelPlan.objects.get(id=plan.id)
        self.assertIn(str(day_count), plan.day_count)
