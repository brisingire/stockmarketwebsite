from django.shortcuts import render
from rest_framework.response import Response
from api.serializers import StockSerializer, SectorSerializer, IndustrySerializer, ThemeSerializer
from rest_framework.decorators import api_view
from rest_framework import generics 
from api.models import Stock, Sector, Industry, Theme 
from rest_framework.filters import SearchFilter, OrderingFilter

# Create your views here.


class stocks(generics.ListAPIView):
    serializer_class = StockSerializer
    queryset = Stock.objects.all() #querset to get all stocks
    filter_backends = (SearchFilter, OrderingFilter)
    search_fields = ("ticker","name")
    ordering_fields = ("ticker","name")

@api_view(['GET'])
def getStockById(request, id): 
    stock = Stock.objects.get(id=id)
    serializer = StockSerializer(stock, many=False)
    return Response(serializer.data)


@api_view(['GET'])
def getStock(request, ticker): 
    stock = Stock.objects.get(ticker=ticker)
    serializer = StockSerializer(stock, many=False)
    return Response(serializer.data)


# sectors 


class sectors(generics.ListAPIView): 
    serializer_class = SectorSerializer
    queryset = Sector.objects.all()
    filter_backends = (SearchFilter, OrderingFilter)
    search_fields = ("name",)



@api_view(['GET'])
def getSector(request, name): 
    sector = Sector.objects.get(name=name)
    serializer = SectorSerializer(sector, many=False)
    return Response(serializer.data)

@api_view(['GET'])
def getSectorById(request, id): 
    sector = Sector.objects.get(id=id)
    serializer = SectorSerializer(sector, many=False)
    return Response(serializer.data)


# industries 

class industries(generics.ListAPIView): 
    serializer_class = IndustrySerializer
    queryset = Industry.objects.all()
    filter_backends = (SearchFilter, OrderingFilter)
    search_fields = ("name",)

@api_view(['GET'])
def getIndustry(request, name): 
    industry = Industry.objects.get(name=name)
    serializer = IndustrySerializer(industry, many=False)
    return Response(serializer.data)

@api_view(['GET'])
def getIndustryById(request, id): 
    industry = Industry.objects.get(id=id)
    serializer = IndustrySerializer(industry, many=False)
    return Response(serializer.data)

#themes 
class themes(generics.ListAPIView): 
    serializer_class = ThemeSerializer
    queryset = Theme.objects.all()
    filter_backends = (SearchFilter, OrderingFilter)
    search_fields = ("name",)

@api_view(['GET'])
def getTheme(request, name): 
    theme = Theme.objects.get(name=name)
    serializer = ThemeSerializer(theme, many=False)
    return Response(serializer.data)

@api_view(['GET'])
def getThemeById(request, id): 
    theme = Theme.objects.get(id=id)
    serializer = ThemeSerializer(theme, many=False)
    return Response(serializer.data)