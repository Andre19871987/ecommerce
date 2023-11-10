import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function insertProduct(productId: number, productName: string, price: number, description: string, imagePath: string) {
  try {
    // Esegui un'operazione di inserimento nel database utilizzando Prisma
    const insertedProduct = await prisma.product.create({
      data: {
        id: productId,
        name: productName,
        price: price,
        info: description,
        quantity: 10,
        imagePath: imagePath, // Assicurati che imagePath sia incluso se è un campo obbligatorio
      },
    });

    console.log(`Prodotto con ID ${insertedProduct.id} inserito nel database con successo.`);
  } catch (error) {
    console.error(`Errore durante l'inserimento del prodotto con ID ${productId}:`, error);
  }
}

// Chiamata alla funzione per inserire un prodotto
insertProduct(24, 'Zucchine', 3.99, "Zucchine verdi", 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQojpj77ViwYjaqDRtxy2g6skkff9ppis6D7w&usqp=CAU');


//yarn nodemon ./src/public/products-img/insert-products.ts

//utilizzo https://tinyurl.com/app per abbreviare l'url delle immagini