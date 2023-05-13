from .models import Stock, Sector, Industry, Theme 
from rest_framework.serializers import ModelSerializer

import django_filters


class SectorFilter(django_filters.FilterSet): 
    name = django_filters.CharFilter(lookup_expr="iexact")

    class Meta: 
        models = Sector
        fields = ["name"]

class StockSerializer(ModelSerializer): 
    class Meta: 
        model = Stock 
        fields = '__all__'

class SectorSerializer(ModelSerializer): 
    class Meta: 
        model = Sector
        fields ='__all__'   

class IndustrySerializer(ModelSerializer): 
    class Meta: 
        model = Industry
        fields ='__all__'  

class ThemeSerializer(ModelSerializer): 
    
    class Meta: 
        model = Theme
        fields ='__all__'  