/*
 * Variable pour les briques
 */

var NBR_LIGNES = 5;
var NBR_BRIQUES_PAR_LIGNE = 10;
var BRIQUE_WIDTH = 48;
var BRIQUE_HEIGHT = 15;
var ESPACE_BRIQUE = 10;
var COULEURS_BRIQUES = ["#503A22", "#88502F", "#A17048", "#D9C38A", "#F7DDAC"];
var limiteBriques = (ESPACE_BRIQUE + BRIQUE_HEIGHT) * NBR_LIGNES;

/*
 * Variable pour la barre de déplacement
 */

var BARRE_JEU_WIDTH = 80; // Largeur de la barre de jeu
var BARRE_JEU_HEIGHT = 10; // Heuteur de la barre de jeu
var COULEUR_BARRE = "white";
/*
 * Variables générales
 */

var tabBriques; // Tableau des briques
var context;
var barreX; // Position en X de la barre
var barreY; // Position en Y de la barre CAD fixe
var ZONE_JEU_WIDTH = 800;
var ZONE_JEU_HEIGHT = 600;
var touche; // Touche enfoncée
var boucleJeu; // Boucle de rafraichissement du contexte 2D
var aGagne = 0; // initialise la variable gagné à 0 pour le joueur
var nb_vies = 3; // nombre de vie pour le jeu

/*
 * variables pour la balle
 */

var COULEUR_BALLE = "yellow";
var DIMENSION_BALLE = 8;
var VITESSE_BALLE = 3.5;
var balleX = 100;
var balleY = 250;
var dirBalleX = 1;
var dirBalleY = -1;

window.addEventListener('load', function () {
    // On récupère l'objet canvas
    var elem = document.getElementById('canvas');
    if (!elem || !elem.getContext) {
        return;
    }

    // On récupère le contexte 2D
    context = elem.getContext('2d');
    if (!context) {
        return;
    }

    // Initialisations des variables
    ZONE_JEU_WIDTH = elem.width;
    ZONE_JEU_HEIGHT = elem.height;

    barreX = (elem.width / 2) - (BARRE_JEU_WIDTH / 2); // centre du jeu
    barreY = (elem.height - BARRE_JEU_HEIGHT * 1.5); // on plasse la barre le plus bas possible

    // Le navigateur est compatible, le contexte est présent, on peut appeler la fonction création des briques
    creerBriques(context, NBR_LIGNES, NBR_BRIQUES_PAR_LIGNE, BRIQUE_WIDTH, BRIQUE_HEIGHT, ESPACE_BRIQUE);

    context.fillStyle = COULEUR_BARRE; // couleur de la barre
    context.fillRect(barreX, barreY, BARRE_JEU_WIDTH, BARRE_JEU_HEIGHT); // Positionnement de la barre

    //initialise les images pour le nombre de vie

    var balise_img = document.createElement("img");
    balise_img.setAttribute("src", "coeur.png");
    balise_img.setAttribute("class", "life1");

    var balise_img2 = document.createElement("img");
    balise_img2.setAttribute("src", "coeur.png");
    balise_img2.setAttribute("class", "life2");

    var balise_img3 = document.createElement("img");
    balise_img3.setAttribute("src", "coeur.png");
    balise_img3.setAttribute("class", "life3");

    document.getElementById("vie").appendChild(balise_img);
    document.getElementById("vie").appendChild(balise_img2);
    document.getElementById("vie").appendChild(balise_img3);

    //demarrer la partie en chopant la balise p qui a la class jouerFdepla
    document.getElementsByClassName("jouer")[0].addEventListener("click", demarrer, false);
    //Evenement lors de l'appuie et du relachement des touches
    window.addEventListener("keydown", keyDown, false);
    window.addEventListener("keyup", keyUp, false);
    
    //deplacement du background 
    $('.jouer').on('click', function start() {
        $('canvas').animate({ 'background-position-x': '+=20%' }, 1000, 'linear', function(){ start(); });
    });
    
}, false);


//Fonction permettant de démarrer la partie en cliquant sur jouer

function demarrer() {
    ScreenMove = 0;
    document.getElementsByClassName("jouer")[0].style.visibility = "hidden";
    boucleJeu = setInterval(refreshGame, 10);
}

/*
 * Fonction qui permet de créer les briques
 */

function creerBriques(ctx, nbrLignes, nbrParLigne, largeur, hauteur, espace) {

    // initialisation du tableau de brique par le nombre de ligne
    tabBriques = new Array(nbrLignes);

    for (var i = 0; i < nbrLignes; i++) {

        // initialisation des briques se trouvant sur la ligne en cours
        tabBriques[i] = new Array(nbrParLigne);

        // Définit la couleur de la ligne de brique
        ctx.fillStyle = COULEURS_BRIQUES[i];

        for (var j = 7; j < nbrParLigne + 7; j++) { // décalage de 6 pour centrer les bricks dans le canvas

            // Afficher une nouvelle brique
            ctx.fillRect((j * (largeur + espace)), (i * (hauteur + espace)), largeur, hauteur);

            // Case actuel du tableau si égale à 1 alors la brique éxiste
            tabBriques[i][j] = 1;

        }
    }

    // retour de la fonction en indiquant que les briques sont bien iniitialisées
    return 1;

}

/*
 * Fonction permettant d'actualiser le jeu
 */

function refreshGame() {

    // On efface la zone de donnée
    clearContexte(context, 0, ZONE_JEU_WIDTH, 0, ZONE_JEU_HEIGHT);

    aGagne = 1;

    showBrick();
    
    if (aGagne) gagne(); // vérification pour savoir si le joueur a gagné

    // couleur de la barre de jeu
    context.fillStyle = COULEUR_BARRE;

    //afficher la barre de jeu
    context.fillRect(barreX, barreY, BARRE_JEU_WIDTH, BARRE_JEU_HEIGHT);

    //appel de la fonction de deplacement de la barre de jeu
    deplacer();

    // Afficher la balle dans le jeu avec l'appel de la fonction adéquate
    balleShow(context);

    // deplacement de la balle
    balleMove();

}

/*
 * Fonction permettant l'affichage des briques
 */

function showBrick() {

    // Afficher les briques qui ne pas touché soit celle qui ont la valeur 1
    for (var i = 0; i < tabBriques.length; i++) {
        context.fillStyle = COULEURS_BRIQUES[i];
        for (var j = 0; j < tabBriques[i].length; j++) {
            if (tabBriques[i][j] == 1) {
                context.fillRect((j * (BRIQUE_WIDTH + ESPACE_BRIQUE)), (i * (BRIQUE_HEIGHT + ESPACE_BRIQUE)), BRIQUE_WIDTH, BRIQUE_HEIGHT);
                aGagne = 0; // cela signifie qu'il reste au moins une brique
            }
        }
    }
   
}

/*
 * Fonction permettant de rendre transparent un zone de donnée dans notre context
 */

function clearContexte(ctx, startwidth, ctxwidth, startheight, ctxheight) {
    ctx.clearRect(startwidth, startheight, ctxwidth, ctxheight);
}

//fonction permettant de connaître la touche appuyé
function keyDown(e) {
    var code = e.keyCode;
    if (code == 37 || code == 39) // Gauche || Droite
        touche = code;
    if (code == 32 && document.getElementsByClassName("jouer")[0].style.visibility == "visible") // Espace
        demarrer();
}

//fonction permettant de savoir si on relache une touche
function keyUp(e) {
    var code = e.keyCode;
    if (touche == code)
        touche = 0;
}

//fonction permettant de deplacer la barre de jeu
function deplacer() {
    var vitesse = 4; // vitesse deplacement de la barre

    if (touche == 37 && barreX >= 0) // Gauche
        barreX -= vitesse;
    else if (touche == 39 && barreX + BARRE_JEU_WIDTH <= canvas.width) // Droite
        barreX += vitesse;
}

//fonction affichage de la balle
function balleShow(ctx) {
    ctx.fillStyle = COULEUR_BALLE;
    ctx.beginPath();
    ctx.arc(balleX, balleY, DIMENSION_BALLE, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
}

//fonction permettant de deplacer la balle dans le jeu
function balleMove() {
    balleX += dirBalleX * VITESSE_BALLE;
    balleY += dirBalleY * VITESSE_BALLE;

    // Calcul de la nouvelle position de la balle

    if ((balleX + dirBalleX * VITESSE_BALLE) > ZONE_JEU_WIDTH)
        dirBalleX = -1;
    else if ((balleX + dirBalleX * VITESSE_BALLE) < 0)
        dirBalleX = 1;
    if ((balleY + dirBalleY * VITESSE_BALLE) > ZONE_JEU_HEIGHT) //test si le joueur a perdu car la balle a touché le bas du jeu
        perdu();
    else {
        if ((balleY + dirBalleY * VITESSE_BALLE) < 0)
            dirBalleY = 1;
        else {
            if (((balleY + dirBalleY * VITESSE_BALLE) > (ZONE_JEU_HEIGHT - BARRE_JEU_HEIGHT)) && ((balleX + dirBalleX * VITESSE_BALLE) >= barreX) && ((balleX + dirBalleX * VITESSE_BALLE) <= (barreX + BARRE_JEU_WIDTH))) { // test collision avec la barre de jeu
                dirBalleY = -1;
                dirBalleX = 2 * (balleX - (barreX + BARRE_JEU_WIDTH / 2)) / BARRE_JEU_WIDTH;
            }
        }
    }

    // Test des collisions avec les briques
    if (balleY <= limiteBriques) {
        // On est dans la zone des briques
        var ligneY = Math.floor(balleY / (BRIQUE_HEIGHT + ESPACE_BRIQUE));
        var ligneX = Math.floor(balleX / (BRIQUE_WIDTH + ESPACE_BRIQUE));
        if (tabBriques[ligneY][ligneX] == 1) {
            tabBriques[ligneY][ligneX] = 0;
            dirBalleY = 1;
        }
    }
}

//fonction permettant de savoir si le joueur à perdu
function perdu() {
    nb_vies--;
    if (nb_vies == 0) {
        ScreenMove = 1;
        $("#vie img:last-child").remove();
        alert("Vous avez perdu !");
        location.reload(true);
    } else {

        $("#vie img:last-child").remove();
        alert("Il vous reste " + nb_vies + " vie(s)");
        continuer();

    }
    clearInterval(boucleJeu); // permet de stopper la boucle infini du jeu
}

//fonction permettant de savoir si le joueur à gagné
function gagne() {
    clearInterval(boucleJeu);
    alert("Bravo Champion tu as gagné le droit de recommencer !");
    location.reload(true);
}

//Fonction permettant de continuer si le joueur n'a pas 0 vie 
function continuer() {
    var play = document.getElementsByClassName("jouer")[0];
    play.innerHTML = "Continuer";
    play.style.width = "120px";
    play.style.visibility = "visible";
    barreX = canvas.width / 2 - BARRE_JEU_WIDTH / 2;
    barreY = canvas.height - BARRE_JEU_HEIGHT - 5;
    balleX = canvas.width / 2;
    balleY = canvas.height - BARRE_JEU_HEIGHT - 5 - DIMENSION_BALLE;
    dirBalleX = Math.random() * 2 - 1;
    dirBalleY = -1;
    refreshGame();
}