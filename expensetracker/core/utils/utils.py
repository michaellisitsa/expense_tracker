from datetime import datetime, timedelta
from django.db.models import Q, Sum

# Utility to generate Summary table
def summariseTimePeriod(time_periods, expenses, days):
    # Get current date, and get a timedelta by number of days
    currentDate = datetime.now().date()
    dayDelta = timedelta(days)

    # Get the date offset backwards from now by the number of days
    prevDate = currentDate - dayDelta

    # Filter expensePeriods that fit between X days ago and now.
    filtered_time_periods = time_periods.filter(
        Q(dateStart__range=[prevDate, currentDate])
        | Q(dateEnd__range=[prevDate, currentDate])
    )

    # Get expenses within falling into the time period queried above
    adjusted_dayDelta = []
    orig_dayDelta = []
    period_id = []
    adjusted_expense = []
    for time_period in filtered_time_periods:
        # Sum up all the expenses within each time period separately
        total_expenses = (
            expenses.filter(expenseTimePeriod=time_period).aggregate(Sum("cost"))[
                "cost__sum"
            ]
            or 0
        )
        total_expenses = float(total_expenses)

        # Get fraction of each expense total based on whether it fits fully, or partially into the time period.
        if time_period.dateStart < prevDate:
            adjusted_dayDelta.append((time_period.dateEnd - prevDate).days)
            adjusted_expense.append(
                (time_period.dateEnd - prevDate).days
                / (time_period.dateEnd - time_period.dateStart).days
                * total_expenses
            )
        else:
            adjusted_dayDelta.append((time_period.dateEnd - time_period.dateStart).days)
            adjusted_expense.append(float(total_expenses))
        orig_dayDelta.append((time_period.dateEnd - time_period.dateStart).days)
        period_id.append(time_period.id)

    # Convert to the average expenses per month.
    expenses_rate = (
        int(30.0 / sum(adjusted_dayDelta) * sum(adjusted_expense))
        if sum(adjusted_dayDelta) != 0
        else "-"
    )
    # TODO - Remove overlapping days
    coverage = int(sum(adjusted_dayDelta) / days * 100)

    return (expenses_rate, coverage)
