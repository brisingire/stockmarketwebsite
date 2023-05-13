from django.db import models

# Create your models here.

class Sector(models.Model): 
    name = models.CharField(max_length=100, null=True)
    type = models.CharField(max_length=100, null=True)
    ticker = models.CharField(max_length=100, null=True)
    price_data = models.JSONField(null=True, blank=True)
    number_of_stocks = models.IntegerField(null=True, blank=True)
    market_cap = models.FloatField(null=True, blank=True)
    one_month_volatility = models.FloatField(null=True, blank=True)
    three_month_volatility = models.FloatField(null=True, blank=True)
    six_month_volatility = models.FloatField(null=True, blank=True)
    industries = models.CharField(max_length=4000,blank=True, null=True)
    themes = models.CharField(max_length=4000,blank=True, null=True)

    def __str__(self): 
        return self.name
    

class Industry(models.Model): 
    name = models.CharField(max_length=100, null=True)
    type = models.CharField(max_length=100, null=True)
    price_data = models.JSONField(null=True, blank=True)
    number_of_stocks = models.IntegerField(null=True, blank=True)
    market_cap = models.FloatField(null=True, blank=True)
    one_month_volatility = models.FloatField(null=True, blank=True)
    three_month_volatility = models.FloatField(null=True, blank=True)
    six_month_volatility = models.FloatField(null=True, blank=True)
    sector = models.ForeignKey(Sector, null=True,  on_delete=models.SET_NULL,related_name="sector_industries", blank=True)
    themes = models.CharField(max_length=4000,blank=True, null=True)
    stocks = models.TextField(max_length=4000,blank=True, null=True)

    def __str__(self): 
        return self.name



class Theme(models.Model): 
    name = models.CharField(max_length=100, null=True)
    type = models.CharField(max_length=100, null=True)
    price_data = models.JSONField(null=True, blank=True)
    number_of_stocks = models.IntegerField(null=True, blank=True)
    market_cap = models.FloatField(null=True, blank=True)
    one_month_volatility = models.FloatField(null=True, blank=True)
    three_month_volatility = models.FloatField(null=True, blank=True)
    six_month_volatility = models.FloatField(null=True, blank=True)
    sector = models.ForeignKey(Sector, null=True,  on_delete=models.SET_NULL,related_name="sector_themes", blank=True)
    industry = models.ForeignKey(Industry, null=True,  on_delete=models.SET_NULL,related_name="industry_themes", blank=True)
    stocks = models.TextField(max_length=4000,blank=True, null=True)

    def __str__(self): 
        return self.name


