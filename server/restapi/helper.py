from datetime import datetime

def get_next_month(date):
	year = date.year
	month = date.month + 1
	if month > 12:
		month = 1
		year += 1
	return datetime(year, month, 1)
