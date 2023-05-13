# update stock data 
from core.celery import app
# get historic price data stocks every ~hour 
# update entries in database 
from core.celery import app 
import yfinance as yf 
from .models import Stock 
import datetime  
import math  
import finviz  
import traceback
import requests 

date_today= datetime.date.today()
date_6m_ago = date_today  - datetime.timedelta(weeks=26)

@app.task(bind=True, concurrency=1)
def update_stock_data(self):


    for stock in Stock.objects.all(): 
        try: 
            url =f"https://api.polygon.io/v2/aggs/ticker/{stock}/range/1/day/{date_6m_ago}/{date_today}?adjusted=true&sort=asc&limit=400&apiKey=QBXrfraVibjDpily0I6aaQtU5SSGpJLL"
            response = requests.get(url) 
            data = response.json() 
            stock.price_data = normalizePrices(data["results"])
            stock.save()
            print("added " + stock.ticker) 
        except: 
            print("add " + stock.ticker + " failed")
  



@app.task(bind=True, concurrency=1)
def update_stock_information(self):

    #updating market cap  
    for stock in Stock.objects.all(): 
        try: 
            url =f"https://api.polygon.io/v3/reference/tickers/{stock}?apiKey=QBXrfraVibjDpily0I6aaQtU5SSGpJLL"
            response = requests.get(url) 
            data = response.json() 
            stock.market_cap = data["results"]["market_cap"]
            stock.save()
            print("updated market cap for " + stock.ticker) 
        except: 
            print("updating market cap for " + stock.ticker + " failed")


            
        try:
            lst_price = stock.price_data[-1]["c"]
        except: 
            print("lst_price failed")
        try:
            one_month_price = stock.price_data[-21]["c"]
            stock.one_month_volatility = ((lst_price/one_month_price)-1)*100
            print("updated 1month volatility " + stock.ticker)
        except: 
            print("1 month failed")
        try: 
            three_month_price = stock.price_data[-63]["c"]
            stock.three_month_volatility = ((lst_price/three_month_price)-1)*100
        except: 
            print("3 month failed")
        try: 
            six_month_price = stock.price_data[len(stock.price_data)*(-1)]["c"]
            stock.six_month_volatility = ((lst_price/six_month_price)-1)*100
            
        except: 
            print("6 month failed" + stock.ticker)
            
            
           
        stock.save()


def normalizePrices(stock): 
  newPriceArr = []

  # normalizing data 

  max_o = 0
  max_c = 0 
  max_h = 0 
  max_l = 0 
  try: 
     
    for tradingDay in stock: 
      
      if tradingDay["o"] > max_o: 
        max_o = tradingDay["o"]
      if tradingDay["c"] > max_c: 
        max_c = tradingDay["c"]
      if tradingDay["h"] > max_h: 
        max_h = tradingDay["h"]
      if tradingDay["l"] > max_l: 
        max_l = tradingDay["l"]
      
    for tradingDay in stock: 
      newPriceArr.append({
        "o" : tradingDay["o"]/max_o,
        "c" : tradingDay["c"]/max_c,
        "h" : tradingDay["h"]/max_h,
        "l" : tradingDay["l"]/max_l,
      })
    
      

  except: 
      pass

 
    
  return newPriceArr