from datetime import datetime, timedelta
from django.db.models import Q, Sum

#Utility to generate Summary table
def summariseTimePeriod(time_periods, expenses, days):
    currentDate = datetime.now().date()
    dayDelta = timedelta(days)
    prevDate = currentDate - dayDelta
    filtered_time_periods = time_periods.filter(Q(dateStart__range=[prevDate, currentDate]) | Q(dateEnd__range=[prevDate, currentDate]))

    # Get number of days within last week/month/year falling into a time period
    adjusted_dayDelta = []
    orig_dayDelta = []
    period_id = []
    adjusted_expense = []
    for time_period in filtered_time_periods:
        total_expenses = float(expenses.filter(expenseTimePeriod=time_period).aggregate(Sum('cost'))['cost__sum']) or 0
        if time_period.dateStart < prevDate:
            adjusted_dayDelta.append((time_period.dateEnd-prevDate).days)
            adjusted_expense.append((time_period.dateEnd-prevDate).days/(time_period.dateEnd-time_period.dateStart).days * total_expenses)
        else:
            adjusted_dayDelta.append((time_period.dateEnd-time_period.dateStart).days)
            adjusted_expense.append(float(total_expenses))
        orig_dayDelta.append((time_period.dateEnd-time_period.dateStart).days)
        period_id.append(time_period.id)
            
    # Convert to the average expenses per month. 
    expenses_rate = int(30. / sum(adjusted_dayDelta) * sum(adjusted_expense)) if sum(adjusted_dayDelta) != 0 else "-"
    coverage = int(sum(adjusted_dayDelta) / days * 100)


    return (expenses_rate, coverage)