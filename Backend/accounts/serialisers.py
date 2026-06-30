from django.contrib.auth.models import User
from rest_framework import serializers

# register serializer
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
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
    
    def validate_email(self, value):
        if User.objects.filter(email= value).exists():
            raise serializers.ValidationError("A user with this email already exists")
        return value
        
    
# Profile serializer
class UserSerializer(serializers.Serializer):
        model = User
        fields = ["id", "username", "first_name", "last_name", "email"]
        
# Password Change Serializer
class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)
    

# # Forgot Password Serializer 
# class ForgotPasswordSerializer(serializers.ModelSerializer):
#     email = serializers.EmailField()  
    
# # Reset Password Serializer
# class ResetPasswordSerializer(serializers.ModelSerializer):
#     token = serializers.CharField()
#     password = serializers.CharField()