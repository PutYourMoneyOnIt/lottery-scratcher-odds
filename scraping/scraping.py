from requests import get
from bs4 import BeautifulSoup
import json

def main():
    top_prizes = 'http://www.calottery.com/play/scratchers-games/top-prizes-remaining'
    response = get(top_prizes)
    #used when writing to txt file
    #fname = open("top_prizes.txt", 'w')
    
    soup = BeautifulSoup(response.text, 'html.parser')
    type(soup)
    #isolating the odds table from the html"
    table_container = soup.find_all('table', class_ = 'tablesorter about tag_even')
    #Only need the tbody from the table and not the thead
    tbody_container = table_container[0].find('tbody')
    #saving all rows into a separate container
    row_container = tbody_container.find_all('tr')
    #JSON variables
    data = {} 
    data['game'] = []
    #looping through row containers
    for x in range(len(row_container)):
        #no identifying container for each element, had to just get all cells
        element_container = row_container[x].find_all('td')
        game = []
        #used when writing to txt file
        #myString = ""

        #looping through 
        for y in range(len(element_container) - 1):
            #used when writing to txt file
            #myString = myString + element_container[y].text + ' '

            #getting table element and removing troublesome characters
            telem = element_container[y].text
            telem = telem.strip('$') #removing $ to match our database holding numbers
            telem = telem.replace(',', '') #removing ',' as we want plain numbers
            telem = telem.replace('\'', '') #remoinvg single quote, causes problems with sql queries
            game.append(telem)
        #used when writing to txt file
        #fname.write(myString + '\n')
        
        #formatting JSON object
        data['game'].append({
            'GameNumber' : game[1],
            'TicketPrice' : game[0],
            'Name' : game[2],
            'TopPrize' : game[3],
            'TotalWinners' : game[4],
            'PrizeClaimed' : game[5],
            'PrizeAvailable' : game[6],
        })
    #write data file to json file
    with open('odds.json', 'w') as outfile:  
        json.dump(data, outfile, indent=4)

if __name__ == "__main__":
    main()