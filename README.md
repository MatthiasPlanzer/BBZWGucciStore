# BBZW Gucci Store
Zwischen dem Frontend und Backend wird die Datei `backend/types.ts` geteilt. Darin sind alle Interfaces erfasst.
## Installation
Nach dem Klonen des Git-Repositories können Sie die benötigten Node-Module mit `npm i` installieren. 
## Starten
Das Projekt können Sie mit `npm start` starten.
Anschliessend können Sie unter der URL `http://[::1]:3000` auf das Projekt zugreifen.
## Testen
Die automatisierten Unit-Tests können Sie mit `npm test` ausführen.
**Der Server muss aber im Hintergrund laufen**, denn die Tests überprüfen gleichzeitig das Frontend und das Backend.
Die URL der Tests muss genau `http://localhost:9876` sein, ansonsten treten Fehler mit CORS auf.
