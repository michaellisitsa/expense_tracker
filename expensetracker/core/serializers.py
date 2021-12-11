from .models import ExpenseCategory, ExpenseTimePeriod, Expense
from rest_framework import serializers

# class UserSerializer(serializers.HyperlinkedModelSerializer):
#     class Meta:
#         model =
#         fields = ['description','dateStart','dateEnd']


class ExpenseSerializer(serializers.ModelSerializer):
    # https://www.django-rest-framework.org/api-guide/relations/#nested-relationships
    # category = serializers.RelatedField(
    #     many=False,
    #     read_only=True,
    # )

    def create(self, validated_data):

        # request = self.context.get("request")

        expense = Expense()
        expense.description = validated_data["description"]
        expense.cost = validated_data["cost"]
        expense.expenseTimePeriod = validated_data["expenseTimePeriod"]
        # State should hold what category you're currently in.
        # But how do you prevent a form being submitted with a different username.
        # Especially for the get request, we need to ensure the filter is set to
        # only those categories that the user has created.
        # expense.user = request.user

        expense.save()

        return expense

    class Meta:
        """
        https://www.django-rest-framework.org/api-guide/serializers/#modelserializer
        Also in tutorial, note that a Serializer is like a Form class, whereas a ModelSerializer
        is like a ModelForm because it maps to a class.
        https://www.django-rest-framework.org/tutorial/1-serialization/#using-modelserializers
        """

        model = Expense
        exclude = ["expenseTimePeriod"]


class ExpenseTimePeriodSerializer(serializers.ModelSerializer):
    # https://www.django-rest-framework.org/api-guide/relations/#nested-relationships
    # category = serializers.RelatedField(
    #     many=False,
    #     read_only=True,
    # )

    def create(self, validated_data):

        # request = self.context.get("request")

        time_period = ExpenseTimePeriod()
        time_period.description = validated_data["description"]
        time_period.dateStart = validated_data["dateStart"]
        time_period.dateEnd = validated_data["dateEnd"]
        # State should hold what category you're currently in.
        # But how do you prevent a form being submitted with a different username.
        # Especially for the get request, we need to ensure the filter is set to
        # only those categories that the user has created.
        time_period.category = validated_data["category"]
        # time_period.user = request.user

        time_period.save()

        return time_period

    class Meta:
        """
        https://www.django-rest-framework.org/api-guide/serializers/#modelserializer
        Also in tutorial, note that a Serializer is like a Form class, whereas a ModelSerializer
        is like a ModelForm because it maps to a class.
        https://www.django-rest-framework.org/tutorial/1-serialization/#using-modelserializers
        """

        model = ExpenseTimePeriod
        # fields = ["description", "dateStart", "dateEnd"]
        exclude = ["category"]


class ExpenseCategorySerializer(serializers.ModelSerializer):
    # expenseTimePeriod = serializers.StringRelatedField(many=False)
    # expenseTimePeriod = ExpenseTimePeriodSerializer(many=True, read_only=True)

    # Append current user to API request, so you don't need to directly fetch user id.
    # See discussion https://stackoverflow.com/a/64991320
    def create(self, validated_data):

        request = self.context.get("request")

        category = ExpenseCategory()
        category.name = validated_data["name"]
        category.assignee = validated_data["assignee"]
        category.budget = validated_data["budget"]
        category.description = validated_data["description"]
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
        # fields = [
        #     "name",
        #     "assignee",
        #     "budget",
        #     "description",
        #     "user",
        #     "expenseTimePeriod",
        # ]

        exclude = ["user"]
        extra_kwargs = {"user": {"required": False}}
