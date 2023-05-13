from django.db import models
from updating_data.models import Sector, Industry, Theme

# Create your models here.

class Stock(models.Model): 
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=100, null=True)
    ticker = models.CharField(max_length=100)
    profile =  models.TextField(max_length=1000, null=True, blank=True)
    market_cap = models.FloatField(max_length=30, null=True, blank=True)
    price_data = models.JSONField(null=True, blank=True) 
    avg_volume = models.CharField(max_length=100, null=True, blank=True)
    one_month_volatility = models.FloatField(null=True, blank=True)
    three_month_volatility = models.FloatField(null=True, blank=True)
    six_month_volatility = models.FloatField(null=True, blank=True)

    sector = models.ForeignKey(Sector, on_delete=models.SET_NULL, null=True, related_name="sector_stocks", blank=True)
    industry = models.ForeignKey(Industry, on_delete=models.SET_NULL, null=True, related_name="industry_stocks", blank=True)
    themes = models.ManyToManyField(Theme,  null=True, related_name="theme_stocks", blank=True)

    def __str__(self): 
        return self.ticker