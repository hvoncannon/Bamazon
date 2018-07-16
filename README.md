# Bamazon

This is a collection of two CLI apps for a faux online store.

They use the inquirer node package to accept user input, and the mysql node package to connect to a mysql database with a single products table. 

The customer app shows all products available for sale, and prompts the user to enter an item ID and quantity desired to purchase. If there is enough stock available to complete a purchase the user is shown a success message and total cost of the order. If there is not enough stock then the user is shown a failure message.

The manager app allows the user to do 4 tasks. The first shows a list of all products, this time including stock levels. The next will show all products where the stock quantity is less than 5. The next allows the user to update the stock level of an item chosen out of a list. Finally the user can also create a new item, with pertinent information accepted in prompts.

Video demoing functionality: https://www.screencast.com/t/bpwGnGN1aq
