# celery tasks 

# (1) update one_month, three_month and six_month volatility 
# (2) calc stock price_history for sector, industry and themes 
# (3) update all other fields in sector, industry and theme 

from core.celery import app 
from .models import Sector, Industry, Theme 
import requests
import datetime
import sys 
from collections import Counter


date_today= datetime.date.today()
date_6m_ago = date_today  - datetime.timedelta(weeks=26)

@app.task(bind=True, concurrency=1)
def update_sector_information(self): 
    for sector in Sector.objects.all(): 

        lst_price = sector.price_data[-1]["c"]
        one_month_price = sector.price_data[-21]["c"]
        three_month_price = sector.price_data[-63]["c"]
        six_month_price = sector.price_data[len(sector.price_data)*(-1)]["c"]

        sector.one_month_volatility = ((lst_price/one_month_price)-1)*100
        sector.three_month_volatility = ((lst_price/three_month_price)-1)*100
        
       
        sector.six_month_volatility = ((lst_price/six_month_price)-1)*100


        #adding market cap 
        market_cap = 0 
        for stock in sector.sector_stocks.all():
            if stock.market_cap is not None: 
                market_cap = market_cap + stock.market_cap
        
        sector.market_cap = market_cap

        # add industry list to sector 
        # first check if even true
        sectorStr = ""
        try: 
            for entry in sector.sector_industries.all():
                sectorStr = sectorStr + str(entry.id) + " "
        except: 
            print("adding industries to sector faled")
        sector.industries = sectorStr

        #add themes to theme field
        themeStr = ""
        try: 
            for entry in sector.sector_themes.all():
                themeStr = themeStr + str(entry.id) + " "
        except: 
            print("adding industries to sector faled")
        sector.themes = themeStr

        sector.save()

@app.task(bind=True, concurrency=1)
def update_sector_data(self):
    #updating sector price data 
    for sector in Sector.objects.all(): 
        try: 
            url =f"https://api.polygon.io/v2/aggs/ticker/{sector.ticker}/range/1/day/{date_6m_ago}/{date_today}?adjusted=true&sort=asc&limit=400&apiKey=QBXrfraVibjDpily0I6aaQtU5SSGpJLL"
            response = requests.get(url) 
            data = response.json() 
            sector.price_data = normalizeSingleAssetPriceData(data["results"])
            sector.save()
            # print("added " + sector.ticker) 
        except: 
            print("add " + sector.ticker + " failed")
        



# UPDATING INDUSTRY DATA 
@app.task(bind=True, concurrency=1)
def update_industry_information(self): 
    for industry in Industry.objects.all(): 
    
        if industry.price_data:
            lst_price = industry.price_data[-1]["c"]
            one_month_price = industry.price_data[-21]["c"]
            three_month_price = industry.price_data[-63]["c"]
            six_month_price = industry.price_data[len(industry.price_data)*(-1)]["c"]

            industry.one_month_volatility = ((lst_price/one_month_price)-1)*100
            industry.three_month_volatility = ((lst_price/three_month_price)-1)*100
        
        
            industry.six_month_volatility = ((lst_price/six_month_price)-1)*100
            lst_price = industry.price_data[-1]["c"]
            one_month_price = industry.price_data[-21]["c"]
            three_month_price = industry.price_data[-63]["c"]
            six_month_price = industry.price_data[len(industry.price_data)*(-1)]["c"]

            industry.one_month_volatility = ((lst_price/one_month_price)-1)*100
            industry.three_month_volatility = ((lst_price/three_month_price)-1)*100
            
            
            industry.six_month_volatility = ((lst_price/six_month_price)-1)*100


        #adding market cap 
        market_cap = 0 
        for stock in industry.industry_stocks.all():
            if stock.market_cap is not None: 
                market_cap = market_cap + stock.market_cap
        
        industry.market_cap = market_cap

        # add string listing all themes to industry entry 
        industrStr = ""
        try: 
            for entry in industry.industry_themes.all():
                industrStr = industrStr + str(entry.id) + " "
                
        except: 
            print("adding industries to sector faled")
        industry.themes = industrStr

        #updating stock list
        industrStr = ""
        try: 
            for entry in industry.industry_stocks.all():
                industrStr = industrStr + str(entry.id) + " "
                
        except: 
            print("adding stock to theme failed")
        industry.stocks = industrStr

        themeStr = ""
        try: 
            for entry in industry.industry_themes.all():
                themeStr = themeStr + str(entry.id) + " "
                print(themeStr)
                
        except: 
            print("adding theme to industry failed")
        industry.themes = themeStr

        industry.save()

@app.task(bind=True, concurrency=1)
def update_industry_data(self): 
    for industry in Industry.objects.all(): 
        priceArr = []
        for stock in industry.industry_stocks.all(): 
            priceArr.append(stock.price_data)
        industry.price_data = normalizeSingleAssetPriceData(normalizePrices(priceArr))
        industry.save()
        
@app.task(bind=True, concurrency=1)
def updating_theme_data(self): 
    for theme in Theme.objects.all(): 

        # updatnig theme price data 
        priceArr = []
        for stock in theme.theme_stocks.all(): 
            priceArr.append(stock.price_data)
        
        theme.price_data = normalizeSingleAssetPriceData(normalizePrices(priceArr))
        theme.save()

        #updating 1/3/6 month volatility 
        if theme.price_data :
            lst_price = theme.price_data[-1]["c"]
            one_month_price = theme.price_data[-21]["c"]
            three_month_price = theme.price_data[-63]["c"]
            six_month_price = theme.price_data[len(theme.price_data)*(-1)]["c"]
            

            theme.one_month_volatility = ((lst_price/one_month_price)-1)*100
            theme.three_month_volatility = ((lst_price/three_month_price)-1)*100
        
            print("updating volatilify for " + theme.name)
            theme.six_month_volatility = ((lst_price/six_month_price)-1)*100

            # number of stocks 
            theme.number_of_stocks = len(theme.theme_stocks.all())
        
        

        #updating stock list
        themeStr = ""
        try: 
            for entry in theme.theme_stocks.all():
                themeStr = themeStr + str(entry.id) + " "
                
        except: 
            print("adding stock to theme failed")
        theme.stocks = themeStr

        #updating industry 
        
        theme.save()
    
# NORMALIZE PRICE FUNCTION 

def normalizeSingleAssetPriceData(stock): 
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

def normalizePrices(assets): 
    if not assets:
        return []

   

    # Count the lengths of all sub-arrays
    lengths = [len(x) for x in assets]
    length_counts = Counter(lengths)

    # Filter out lengths that occur less than 3 times
    valid_lengths = [length for length, count in length_counts.items() if count >= 3]

    # Find the maximum length among valid_lengths
    if valid_lengths:
        max_length = max(valid_lengths)
    else:
        print("No length occurs at least 3 times, defaulting to the longest sub-array.")
        max_length = max(lengths)

    # Filter out sub-arrays that do not have the longest valid length
    try:
        assets = [x for x in assets if len(x) == max_length]
    except:
        print("it failed here (-1)")

    
    try: 
    
        combined_stock_price_array = []
        stockList = []
        

        for asset in assets: 
            
            
            # normalizing data 
            helpArr = []
            max_o = 0
            max_c = 0 
            max_h = 0 
            max_l = 0 
            
            try: 
                
                try: 
                    for tradingDay in asset: 
                        
                     
                        if tradingDay["o"] > max_o: 
                            max_o = tradingDay["o"]
                        if tradingDay["c"] > max_c: 
                            max_c = tradingDay["c"]   
                        if tradingDay["h"] > max_h: 
                            max_h = tradingDay["h"]
                        if tradingDay["l"] > max_l:     
                            max_l = tradingDay["l"]
                except: 
                    print("it failed here (1) ")
                    # print(asset)
                    # print(assets)
                    # print(priceArr)
                    
                  
                    
            
            
                try: 

                    for tradingDay in asset: 
                        helpArr.append({
                            "o" : tradingDay["o"]/max_o,
                            "c" : tradingDay["c"]/max_c,
                            "h" : tradingDay["h"]/max_h,
                            "l" : tradingDay["l"]/max_l,
                        })
                    stockList.append(helpArr)
                except: 
                    print("it failed here (2) ")
                  
                    
            except: 
                print("failed first step!")
                exc_type, exc_value, exc_traceback = sys.exc_info()
                message = exc_value.args[0]
                print(message)

            # # # probably second functino 
            
            o = 0
            c = 0
            h = 0 
            l = 0
        
        try: 
        # # i is the number of days 
            
            for i in range(0,len(stockList[0])): 
            
                
                combined_stock_price_array.append({
                    "o" : 0, 
                    "c" : 0, 
                    "h" : 0, 
                    "l" : 0, 
                })
                # j is the number of stocks
                for j in range(0,len(stockList)): 
                    pass
                    combined_stock_price_array[i]["o"] += stockList[j][i]["o"]
                    combined_stock_price_array[i]["c"] += stockList[j][i]["c"]
                    combined_stock_price_array[i]["h"] += stockList[j][i]["h"]
                    combined_stock_price_array[i]["l"] += stockList[j][i]["l"]
        except: 
            
            print("this part failed")
            # print(combined_stock_price_array[0]["l"])
            # print(stockList[0][0]["l"])


        
    
    

    except: 
        # print("compeltely failed normalizing data for this array ")
        exc_type, exc_value, exc_traceback = sys.exc_info()
        message = exc_value.args[0]
        print(message)
    
    return combined_stock_price_array

