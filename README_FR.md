###### Simple-ReactDataTable ######


### Description ###

    Simple React DataTable est un composant React léger et flexible pour afficher des données sous forme de tableau. Il offre des fonctionnalités de pagination, de recherche, et de tri colonnaire, rendant la gestion de grandes quantités de données plus accessible et intuitive.


### Caractéristiques ###

    Pagination : Naviguez facilement à travers les données paginées.
    Recherche : Recherchez rapidement des données spécifiques, y compris sur une colonne en particulier.
    Tri colonnaire : Triez de manière ascendante ou descendante les données d'une colonne.


### Installation ###

    Pour installer le package, exécutez la commande suivante dans votre projet React :

    npm install simple-reactdatatable


### Utilisation ###

    Comment utiliser le composant ReactDataTable dans votre application ?

        ==> Importation : 
                import {ReactDataTable} from 'simple-reactdatatable';

        ==> Exemple d'utilisation :
                function MyComponent() {
                    const data = [...]; // Votre tableau de données
                    const columns = [...]; // Les colonnes à afficher

                    return <ReactDataTable data={data} columns={columns} />;
                }

        ==> Props :
                - `data` (Array): Les données à afficher sous forme de tableau. Doit être un tableau d'objets.
                - `columns` (Array): Les colonnes du tableau. Chaque objet doit contenir un `key` et un `title`.
                - `onRowClick` (Function): Fonction appelée lorsqu'une ligne est cliquée. Reçoit l'objet de données de la ligne.
                - `defaultEntriesPerPage` (Number): Nombre d'entrées à afficher par page. Par défaut 10.
                - `sortColumnParam` (String): Clé de colonne initiale pour le tri. Par défaut 'name'.
                - `headerHeight`, `tableBodyHeight`, `paginationHeight` (String): Hauteur personnalisée pour les différentes parties du tableau. Par défaut 'auto'.
                - `headerFontSize`, `tableBodyFontSize`, `paginationFontSize` (String): Taille de la police pour le header, le corps et la pagination. Par défaut '1rem'.
                - `fontFamily` (String): Police d'écriture pour le texte du tableau. Par défaut 'Arial'.
                - `containerWidth` (String): Largeur du container du tableau. Par défaut '100%'.


### Dépendances ###
    React
    prop-types