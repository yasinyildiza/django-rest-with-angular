# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class TravelPlan(models.Model):
    """Travel Plan model"""

    user = models.ForeignKey(User)
    destination = models.CharField(max_length=255)
    comment = models.CharField(max_length=255)
    start_date = models.DateField()
    end_date = models.DateField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def day_count(self):
        today = timezone.now().date()
        days = (self.start_date - today).days

        if days < 0:
            return 'passed'

        if days == 0:
            return 'today'

        if days == 1:
            return 'tomorrow'

        return str(days) + ' days left'
