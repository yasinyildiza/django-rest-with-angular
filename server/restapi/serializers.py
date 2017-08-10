# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib.auth.models import User

from rest_framework import serializers
from rest_framework.authtoken.models import Token

from restapi.models import TravelPlan


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""

    url = serializers.HyperlinkedIdentityField(
        view_name='user-detail',
        read_only=True)
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'url',
                  'username', 'password',
                  'confirm_password', 'email')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data.get('username'),
            password=validated_data.get('password'),
            email=validated_data.get('email'))

        Token.objects.create(user=user)
        return user

    def validate(self, data):
        super(UserSerializer, self).validate(data)

        password = data.get('password')
        confirm_password = data.get('confirm_password')

        if password != confirm_password:
            raise serializers.ValidationError("Passwords did not match.")

        return data


class UserUpdateSerializer(UserSerializer):
    password = serializers.CharField(write_only=True, required=False)
    confirm_password = serializers.CharField(write_only=True, required=False)

    def update(self, instance, validated_data):
        instance.email = validated_data.get('email', instance.email)
        instance.username = validated_data.get('username', instance.username)
        password = validated_data.get('password', '')
        if password:
            instance.set_password(password)
        instance.save()
        return instance


class TravelPlanSerializer(serializers.HyperlinkedModelSerializer):
    """Serializer for TravelPlan model"""

    url = serializers.HyperlinkedIdentityField(
        view_name='travelplan-detail',
        read_only=True)
    user = serializers.SlugRelatedField(
        read_only=True,
        slug_field='username',
        default=serializers.CurrentUserDefault())

    class Meta:
        model = TravelPlan
        fields = ('id', 'url', 'user', 'destination',
                  'comment', 'start_date', 'end_date',
                  'day_count', 'created_at', 'updated_at')
