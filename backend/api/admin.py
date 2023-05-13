from django.contrib import admin
from .models import Stock


class StockAdmin(admin.ModelAdmin):
    search_fields = ["ticker"]

# Register your models here.
admin.site.register(Stock, StockAdmin)