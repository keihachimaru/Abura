# Abura

A través de un algoritmo evolutivo, generar un shader que transforme una imagen a trazos de óleo. Aburae, de ahí el nombre abura. Se empieza con una imagen en blanco y negro. La idea del algoritmo sería, generar un "trazo", que será al principio un rectángulo negro con cierta opacidad. Luego, se compara la diferencia entre la imagen, y un canvas gris (con la media de los colores de la imagen) con el trazo. Esto daría un score.

A continuación se repite, y nos quedamos con el mejor trazo, y este muta, y se elije el mejor, y así sucesivamente. Un algoritmo evolutivo vamos. Al final debería de quedar una imagen a "trazos" bastante similar a la original. El objetivo es que tarde 10 minutos en renderizar como máximo. Para poder tener eficiencia, se tendrá que hacer con un fragment shader.
