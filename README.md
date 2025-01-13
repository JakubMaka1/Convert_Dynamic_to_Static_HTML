# Convert_Dynamic_to_Static_HTML
Stworzone na potrzeby wyświetlania informacji na ekranach w kantynach, istniejący system nie wspiera dynamicznych stron html [JS] dlatego wymagane było przerobienie strony jako statyczną poprzez wykonanie zrzutu ekranu a następnie wrzucenie pod jakimś portem

Właczamy poleceniem:
pm2 start "nazwa pliku".js --name "jakaś nazwa dla usługi" --max-memory-restart 1G

Wyswietlenie logów 
pm2 monit

Wyświelenie istniejących włacoznych/zatrzymanych usług
pm2 list

komendę pm2 musimy odpalić w katalogu skryptu, zdjęcia przechowywane są w katalogu "Lokalizacja_Skyptu"/Public jako pliki *.png
