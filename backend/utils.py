from django.utils import timezone
from django.conf import settings
import pytz
def get_current_time():
    """Utility function to get current time in the configured timezone"""
    return timezone.localtime()
def convert_to_local_time(dt):
    """Convert any datetime to the configured timezone"""
    if dt is None:
        return None
    if timezone.is_naive(dt):
        dt = timezone.make_aware(dt)
    return dt.astimezone(pytz.timezone(settings.TIME_ZONE))