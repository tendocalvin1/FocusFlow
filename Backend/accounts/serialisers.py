from django.contrib.auth.models import User
from rest_framework import serializers

# register serializer
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "first_name", "last_name", "email", "password"]
        
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username = validated_data["username"],
            first_name = validated_data["first_name"],
            last_name = validated_data["last_name"],
            email = validated_data["email"],
            password=validated_data["password"]
        )
        return user
    
# Profile serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "first_name", "last_name", "email"]
        
# Password Change Serializer
class ChangePasswordSerializer(serializers.ModelSerializer):
    old_password = serializers.CharField()
    new_password = serializers.CharField()
    

# Forgot Password Serializer 
class ForgotPasswordSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()  
    
# Reset Password Serializer
class ResetPasswordSerializer(serializers.ModelSerializer):
    token = serializers.CharField()
    password = serializers.CharField()