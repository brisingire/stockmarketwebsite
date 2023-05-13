from django.urls import path 
from . import views 


urlpatterns = [
    path('stocks', views.stocks.as_view()),
    path('stocks/<int:id>', views.getStockById),
    path('stocks/<str:ticker>', views.getStock),
   

    path('sectors', views.sectors.as_view()),
    path('sectors/<int:id>', views.getSectorById),
    path('sectors/<str:name>', views.getSector),
    

    path('industries', views.industries.as_view()), 
    path('industries/<int:id>', views.getIndustryById),
    path('industries/<str:name>', views.getIndustry), 
    

    path('themes', views.themes.as_view()),
    path('themes/<str:id>', views.getThemeById),
    path('themes/<str:name>', views.getTheme),
    
]
