import express from 'express'
import cors from 'cors'
import { getAll, getOne, createOne, deleteOne, updateOne, connectToDB } from './db.js'

const app = express()
let db; //db connection

app.use(express.json())
app.use(cors())

app.get('/',(req,res)=>{
    res.send("Welcome!")
})

app.get('/Prodotti', async (req,res)=>{
    const prodotti = await getAll(db, 'Prodotti')
    res.json(prodotti)
})

app.get('/Prodotti/:id', async (req,res)=>{
    const id = req.params.id
    console.log(id)
    const prodotto = await getOne(db, 'Prodotti', id)
    if (prodotto){
        res.json(prodotto)
    } else {
        res.status(404).json({message: "prodotto non trovato"})
    }
})

app.post('/Prodotti', async (req, res)=>{
    console.log(req.body);
    const categoria = req.body?.categoria;
    const marca = req.body?.marca;
    const modello = req.body?.modello;
    const prezzo = req.body?.prezzo;

    if(categoria && marca && modello && prezzo){
        //creo il nuovo prodotto e lo inserisco nel DB
        const newProd = {
            categoria,
            marca,
            modello,
            prezzo
        }
        const prodotto = await createOne(db, 'Prodotti', newProd)
        res.status(200).json(prodotto)
    } else{
        res.status(400).json({error:"body non conforme. inserire tutti i campi richiesti"})
    }
})

app.delete('/Prodotti/:id', async (req,res)=>{
    const id = req.params.id
    const prodotto = await deleteOne(db, 'Prodotti', id)
    if(prodotto){
        res.status(200).send("Prodotto eliminato")
    }
    else{
        res.status(404).send("Prodotto non trovato")
    }
})

app.put('/Prodotti/:id', async (req,res)=>{
    const id = req.params.id
    const newValues = {}

    if(req.body?.categoria)
        newValues.categoria = req.body.categoria
    if(req.body?.modello)
        newValues.modello = req.body.modello
    if(req.body?.marca)
        newValues.marca = req.body.marca
    if(req.body?.prezzo)
        newValues.prezzo = req.body.prezzo

    const prodotto = await updateOne(db, 'Prodotti', id, newValues)
    if(prodotto){
        res.status(200).json(prodotto)
    }
    else{
        res.status(404).send("Prodotto non trovato")
    }
})

app.listen(8080, async ()=>{
    try{
        db = await connectToDB()
        console.log("Server in esecuzione su porta 8080 e DB connesso")
    } catch(e){
        console.error(e)
    }
    
})