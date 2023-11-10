import express from 'express';
import http from 'http';
import session from 'express-session';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
declare module 'express-session' {
  interface Session {
    customer?: {
      id: number;
      email: string;
      name: string;
     
    };
  }
}



const app = express();
const server = http.createServer(app);

const PORT = 4000;

const prisma = new PrismaClient();
const saltRounds = 10;

app.use(express.json());

app.use(
  session({
    secret: '2fgeowfhpw;oeih3wo',
    cookie: {
      secure: false,
      sameSite: 'strict',
      maxAge: 86400000,
      httpOnly: true,
    },
    resave: false,
    saveUninitialized: false,
  })
);

function setAutoLogout(req: any): void {
  if (req.session.timeout) {
    clearTimeout(req.session.timeout);
  }
  req.session.timeout = setTimeout(() => {
    req.session.destroy(() => {
      console.log('Sessione scaduta');
    });
  }, 300000);
}
app.post('/customers/register', async (req, res) => {
  const { email, password, name } = req.body;

  // Esegui l'hash della password e gestisci la registrazione del cliente
  const hashedPassword = await bcrypt.hash(password, saltRounds); // Usare bcrypt o un'altra libreria di hashing

  try {
    const newCustomer = await prisma.customer.create({
      data: {
        email: email,
        password: hashedPassword,
        name: name,
      },
    });

    res.status(201).json({ message: 'Registrazione avvenuta con successo' });
  } catch (error) {
    console.error('Errore durante la registrazione del cliente:', error);
    res.status(500).json({ message: 'Errore interno del server' });
  }
});

app.get('/customers/register', (req, res) => {
  res.sendFile(__dirname + '/public/register.html');
});

// Endpoint per ottenere il modulo di login
app.get('/customers/login', (req, res) => {
  res.sendFile(__dirname + '/public/login.html');
});

// Endpoint per ottenere l'elenco dei prodotti
app.get('/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany();

    res.json(products);
  } catch (error) {
    console.error('Errore nel recupero dei prodotti:', error);
    res.status(500).json({ message: 'Errore interno del server' });
  }
});

// Endpoint per il login del cliente
app.post('/customers/login', async (req, res) => {
  
  const { email, password } = req.body;

  // Esegui la logica di autenticazione del cliente e imposta la sessione
  try {
    const customer = await prisma.customer.findUnique({
      where: { email: email },
    });

    if (customer && (await bcrypt.compare(password, customer.password))) {
      req.session.customer = {
        id: customer.id,
        email: customer.email,
        name: customer.name,
        // Altri dati del cliente, se necessario
      };

      res.json({ message: 'Accesso effettuato con successo' });
    } else {
      res.status(401).json({ message: 'Credenziali non valide' });
    }
  } catch (error) {
    console.error('Errore durante il login:', error);
    res.status(500).json({ message: 'Errore interno del server' });
  }
});


// Endpoint per il logout del cliente
app.post('/customers/logout', (req, res) => {
  // Esegui la logica di logout del cliente e cancella la sessione
  // ...

  res.json({ message: 'Logout effettuato con successo' });
});

// Endpoint per la ricerca di prodotti per nome
app.get('/products/search', async (req, res) => {
  const productName = req.query.name as string;

  // Esegui la ricerca di prodotti per nome
  // ...

  res.json({ message: 'Ricerca effettuata con successo' });
});

// Endpoint per il rifornimento di prodotti

app.get('/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    
    // Controlla se il campo "quantity" è null e, in caso affermativo, assegnagli un valore predefinito
    const productsWithDefaultQuantity = products.map(product => ({
      ...product,
      quantity: product.quantity || 0, // Valore predefinito (ad esempio, 0)
    }));
    
    res.json(productsWithDefaultQuantity);
  } catch (error) {
    console.error('Errore durante il recupero dei prodotti dal database:', error);
    res.status(500).json({ message: 'Errore interno del server' });
  }
});

app.post('/products/:productId', (req, res) => {
  const productId = parseInt(req.params.productId);
  const newQuantity = req.body.quantity;

  prisma.product
    .update({
      where: { id: productId },
      data: { quantity: newQuantity },
    })
    .then((updatedProduct) => {
      res.status(200).json({ message: 'Quantità aggiornata con successo' });
    })
    .catch((error) => {
      console.error('Errore durante l\'aggiornamento della quantità:', error);
      res.status(500).json({ message: 'Errore durante l\'aggiornamento della quantità' });
    });
});




// Endpoint per l'acquisto di prodotti da parte di un cliente
app.post('/purchases', async (req, res) => {
  // Esegui la logica di acquisto dei prodotti
  // ...

  res.json({ message: 'Acquisto effettuato con successo' });
});

// Endpoint per la gestione della sessione del cliente
app.get('/session', (req, res) => {
  // Restituisci i dati di sessione del cliente
  res.json(req.session.customer);
});

app.use(express.static(__dirname + '/public'));

app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
});