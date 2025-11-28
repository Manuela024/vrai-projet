
from rest_framework import serializers
from django.contrib.auth.models import User
# from .models import UserProfile  # ← COMMENTEZ ou SUPPRIMEZ cette ligne

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True, source='*')
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'profile']