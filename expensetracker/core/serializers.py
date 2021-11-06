from .models import ExpenseCategory, ExpenseTimePeriod, Expense
from rest_framework import serializers

# class UserSerializer(serializers.HyperlinkedModelSerializer):
#     class Meta:
#         model = 
#         fields = ['description','dateStart','dateEnd']

class ExpenseTimePeriodSerializer(serializers.ModelSerializer):
    # https://www.django-rest-framework.org/api-guide/relations/#nested-relationships
    # category = serializers.RelatedField(
    #     many=False,
    #     read_only=True,
    # )
    class Meta:
        """
            https://www.django-rest-framework.org/api-guide/serializers/#modelserializer
            Also in tutorial, note that a Serializer is like a Form class, whereas a ModelSerializer
            is like a ModelForm because it maps to a class.
            https://www.django-rest-framework.org/tutorial/1-serialization/#using-modelserializers        
        """
        model = ExpenseTimePeriod
        fields = ['description','dateStart','dateEnd','category']
    

class ExpenseCategorySerializer(serializers.ModelSerializer):
    # expenseTimePeriod = serializers.StringRelatedField(many=False)
    expenseTimePeriod = ExpenseTimePeriodSerializer(many=True, read_only=True)

    # Append current user to API request, so you don't need to directly fetch user id.
    # See discussion https://stackoverflow.com/a/64991320
    def create(self, validated_data):
    
        request = self.context.get("request")
        
        category = ExpenseCategory()
        category.name = validated_data['name']
        category.assignee = validated_data['assignee']
        category.budget = validated_data['budget']
        category.description = validated_data['description']
        category.user = request.user

        category.save()

        return category

    class Meta:
        """
            https://www.django-rest-framework.org/api-guide/serializers/#modelserializer
            Also in tutorial, note that a Serializer is like a Form class, whereas a ModelSerializer
            is like a ModelForm because it maps to a class.
            https://www.django-rest-framework.org/tutorial/1-serialization/#using-modelserializers        
        """
        model = ExpenseCategory

        # The last item is name for the foreign key applied to the ExpenseTimePeriod field
        # This allows you to nest the children of the ExpenseCategory
        # https://www.django-rest-framework.org/api-guide/relations/
        fields = ["name", "assignee", "budget", "description","user","expenseTimePeriod"]
        extra_kwargs = {'user': {'required': False}}

