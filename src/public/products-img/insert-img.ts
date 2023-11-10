import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const main = async () => {
    try {
        const productId = 24; // Specifica l'ID del prodotto da aggiornare
        const newImagePath = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGyvIRqPy0ts07CwyMgy4kfp8CObImToCHuw&usqp=CAU'
        const updatedProduct = await prisma.product.update({
            where: {
                id:productId
            },
            data: {
               
                imagePath: newImagePath,
            
                
            }
        });

        console.log(updatedProduct);
    } catch (error) {
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
//>yarn nodemon ./src/querySamples.ts
  //yarn nodemon ./src/public/products-img/insert-img.ts
  /*Ho Importato Axios per effettuare richieste HTTP e il modulo Prisma per la gestione del database.
Crea un'istanza del cliente Prisma.
Definisce una funzione downloadAndInsertProductImageche scarica un'immagine da un URL e l'inserto
Nella funzione main, vengono specificati l'ID del prodotto e l'URL dell'immagine da scaricare.
Viene chiamata la funzione downloadAndInsertProductImagecon i parametri specificati.
Viene gestito l'errore in caso di problemi
Infine, il client Prisma viene disconnesso nel blocco finally.*/
