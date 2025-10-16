from django.test import TestCase
from django.contrib.auth.models import User
from .models import UserProfile

class UserProfileTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="12345")
        self.profile = UserProfile.objects.create(user=self.user, phone_number="123456789")

    def test_profile_creation(self):
        self.assertEqual(self.profile.user.username, "testuser")